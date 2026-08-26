import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import {INominatimResult, INominatimSearchResponse} from '@/types';
import {Field, FieldGroup, FieldLegend, FieldSet} from '@/components/ui/field';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import InputError from '@/components/input-error';
import {MapPin, X} from 'lucide-react';
import {Spinner} from "@/components/ui/spinner";
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group';

interface LocationSearchProps {
    legend: string;
    initialPlace?: string | null;
    errors?: Record<string, string>;
}

interface IPreciseFields {
    street: string;
    number: string;
    city: string;
    postalCode: string;
}

const emptyPreciseFields: IPreciseFields = {street: '', number: '', city: '', postalCode: ''};

// Searches locations via LocationController and exposes the pick as hidden
// q/osm_id/osm_type inputs. Renders no <Form> itself - it's meant to be
// nested inside whatever <Form> the caller already wraps its fields with.
export default function LocationSearch({legend, initialPlace, errors}: LocationSearchProps) {
    const {t} = useTranslation('location');

    const [isEditing, setIsEditing] = useState<boolean>(!initialPlace);

    // Here, string rather than bool in case a 3rd mode is added.
    const [mode, setMode] = useState<'free' | 'precise'>('free');

    // Kept separate per mode (rather than a single shared field) so toggling back and
    // forth between free/precise search never clobbers what the user already typed in
    // the other mode.
    const [freeQuery, setFreeQuery] = useState<string>('');
    const [preciseFields, setPreciseFields] = useState<IPreciseFields>(emptyPreciseFields);

    // The query text actually resolved by the backend (typed verbatim in free mode,
    // built server-side from fields in precise mode) - this is what gets submitted as `q`.
    const [resolvedQuery, setResolvedQuery] = useState<string>('');
    const [results, setResults] = useState<INominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [selected, setSelected] = useState<INominatimResult | null>(null);

    const isFreeReady = freeQuery.trim().length >= 2;
    const isPreciseReady = preciseFields.street.trim().length >= 2 && preciseFields.city.trim().length >= 2;

    useEffect(() => {
        const ready = mode === 'free' ? isFreeReady : isPreciseReady;

        if (!ready) {
            setResults([]);
            return;
        }

        const handle = setTimeout(() => {
            setIsSearching(true);

            const params = mode === 'precise'
                ? {
                    precise: '1',
                    street: preciseFields.street,
                    number: preciseFields.number,
                    city: preciseFields.city,
                    postal_code: preciseFields.postalCode,
                }
                : {q: freeQuery};

            fetch(LocationController.search.url({query: params}))
                .then((response) => response.json())
                .then((data: INominatimSearchResponse) => {
                    setResolvedQuery(data.query);
                    setResults(data.results);
                })
                .finally(() => setIsSearching(false));
        }, 1000);

        return () => clearTimeout(handle);
    }, [mode, freeQuery, preciseFields, isFreeReady, isPreciseReady]);

    const switchMode = (value: string) => {
        if (!value) return;
        setMode(value as 'free' | 'precise');
        setResults([]);
    };

    return (
        <FieldSet>
            <FieldLegend>{legend}</FieldLegend>
            <FieldGroup>
                {!isEditing ? (
                    <Field orientation="horizontal">
                        <MapPin/>
                        <p>{initialPlace}</p>
                        <Button type="button" size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                            {t('change')}
                        </Button>
                    </Field>
                ) : selected ? (
                    <Field orientation="horizontal">
                        <MapPin/>
                        <p>{selected.display_name}</p>
                        <Button type="button" size="icon-sm" variant="outline" onClick={() => {
                            setSelected(null);
                        }}>
                            <span className="sr-only">{t('change')}</span>
                            <X/>
                        </Button>
                    </Field>
                ) : (
                    <Field>
                        {/* Field's vertical orientation forces `w-full` on its direct children via
                            `[&>*]:w-full` - wrapping in a plain div keeps the ToggleGroup itself
                            (a grandchild) at its natural width. */}
                        <div className="flex justify-center">
                        <ToggleGroup type="single"
                                     value={mode}
                                     variant="outline"
                                     onValueChange={switchMode}
                        >
                            <ToggleGroupItem value="free">{t('mode_search')}</ToggleGroupItem>
                            <ToggleGroupItem value="precise">{t('mode_precise')}</ToggleGroupItem>
                        </ToggleGroup>
                        </div>

                        {mode === 'free' ? (
                            <Field>
                                <Label htmlFor="location-search">{t('search_placeholder')}</Label>
                                <Input
                                    id="location-search"
                                    autoComplete="off"
                                    value={freeQuery}
                                    onChange={(e) => setFreeQuery(e.target.value)}
                                    placeholder={t('search_placeholder')}
                                />
                            </Field>
                        ) : (
                            <FieldGroup>
                                <Field orientation="horizontal">
                                    <Field>
                                        <Label htmlFor="location-street">{t('street_label')}</Label>
                                        <Input
                                            id="location-street"
                                            autoComplete="off"
                                            value={preciseFields.street}
                                            onChange={(e) => setPreciseFields((f) => ({...f, street: e.target.value}))}
                                        />
                                    </Field>
                                    <Field>
                                        <Label htmlFor="location-number">{t('number_label')}</Label>
                                        <Input
                                            id="location-number"
                                            autoComplete="off"
                                            value={preciseFields.number}
                                            onChange={(e) => setPreciseFields((f) => ({...f, number: e.target.value}))}
                                        />
                                    </Field>
                                </Field>
                                <Field orientation="horizontal">
                                    <Field>
                                        <Label htmlFor="location-postal-code">{t('postal_code_label')}</Label>
                                        <Input
                                            id="location-postal-code"
                                            autoComplete="off"
                                            value={preciseFields.postalCode}
                                            onChange={(e) => setPreciseFields((f) => ({...f, postalCode: e.target.value}))}
                                        />
                                    </Field>
                                    <Field>
                                        <Label htmlFor="location-city">{t('city_label')}</Label>
                                        <Input
                                            id="location-city"
                                            autoComplete="off"
                                            value={preciseFields.city}
                                            onChange={(e) => setPreciseFields((f) => ({...f, city: e.target.value}))}
                                        />
                                    </Field>
                                </Field>
                            </FieldGroup>
                        )}

                        {isSearching && <Spinner/>}
                        {!isSearching && (mode === 'free' ? isFreeReady : isPreciseReady) && results.length === 0 && (
                            <p className="text-muted-foreground text-sm">{t('no_results')}</p>
                        )}
                        {results.length > 0 && (
                            <ul className="flex flex-col border border-border rounded-md divide-y divide-border overflow-hidden">
                                {results.map((result) => (
                                    <li key={`${result.osm_type}-${result.osm_id}`}>
                                        <button
                                            type="button"
                                            className="w-full text-left px-3 py-2 hover:bg-accent"
                                            onClick={() => {
                                                setSelected(result);
                                                setResults([]);
                                            }}
                                        >
                                            {result.display_name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <InputError message={errors?.osm_id}/>
                    </Field>
                )}
                <input type="hidden" name="q" value={selected ? resolvedQuery : ''}/>
                <input type="hidden" name="osm_id" value={selected?.osm_id ?? ''}/>
                <input type="hidden" name="osm_type" value={selected?.osm_type ?? ''}/>
            </FieldGroup>
        </FieldSet>
    );
}
