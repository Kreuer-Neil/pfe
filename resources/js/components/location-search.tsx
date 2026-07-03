import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import LocationController from '@/actions/App/Http/Controllers/LocationController';
import {INominatimResult} from '@/types';
import {Field, FieldGroup, FieldLegend, FieldSet} from '@/components/ui/field';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import InputError from '@/components/input-error';
import {MapPin, X} from 'lucide-react';
import {Spinner} from "@/components/ui/spinner";

interface LocationSearchProps {
    legend: string;
    initialPlace?: string | null;
    errors?: Record<string, string>;
}

// Searches locations via LocationController and exposes the pick as hidden
// q/osm_id/osm_type inputs. Renders no <Form> itself - it's meant to be
// nested inside whatever <Form> the caller already wraps its fields with.
export default function LocationSearch({legend, initialPlace, errors}: LocationSearchProps) {
    const {t} = useTranslation('location');

    const [isEditing, setIsEditing] = useState<boolean>(!initialPlace);
    const [query, setQuery] = useState<string>('');
    const [results, setResults] = useState<INominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [selected, setSelected] = useState<INominatimResult | null>(null);

    useEffect(() => {
        if (query.trim().length < 2) {
            setResults([]);
            return;
        }

        const handle = setTimeout(() => {
            setIsSearching(true);
            fetch(LocationController.search.url({query: {q: query}}))
                .then((response) => response.json())
                .then((data: INominatimResult[]) => setResults(data))
                .finally(() => setIsSearching(false));
        }, 1000);

        return () => clearTimeout(handle);
    }, [query]);

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
                            setQuery('');
                        }}>
                            <span className="sr-only">{t('change')}</span>
                            <X/>
                        </Button>
                    </Field>
                ) : (
                    <Field>
                        <Label htmlFor="location-search">{t('search_placeholder')}</Label>
                        <Input
                            id="location-search"
                            autoComplete="off"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('search_placeholder')}
                        />
                        {isSearching && <Spinner/>}
                        {!isSearching && query.trim().length >= 2 && results.length === 0 && (
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
                <input type="hidden" name="q" value={selected ? query : ''}/>
                <input type="hidden" name="osm_id" value={selected?.osm_id ?? ''}/>
                <input type="hidden" name="osm_type" value={selected?.osm_type ?? ''}/>
            </FieldGroup>
        </FieldSet>
    );
}
