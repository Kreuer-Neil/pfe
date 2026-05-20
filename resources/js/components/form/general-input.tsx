import {ReactNode} from "react";
import {cn} from "@/lib/utils";
import {ISubmitError} from "@/types";
import {useTranslation} from "react-i18next";

interface TextInputProps {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'date' | 'time';
    required?: boolean;
    value: string;
    setValue: any;
    validation?: ((value:string) => ISubmitError | null);
    placeholder?: string;
    autoFocus?: boolean;
    className?: string;
    inputClassName?: string;
}

export default function GeneralInput(
    {
        name,
        label,
        type = 'text',
        required = false,
        value,
        setValue,
        validation = () => null,
        placeholder = '',
        autoFocus = false,
        className = '',
        inputClassName = '',
    }: TextInputProps): ReactNode {
    const {t} = useTranslation('errors');

    inputClassName += required ? ' input-required' : '';
    const error: ISubmitError | null = validation(value);
    return (
        <label htmlFor={name} className={cn('flex flex-col gap-1', className)}>
            {required ? '*' : null}
            {label}
            {type === 'textarea' ?
                <textarea id={name} name={name} value={value} className={cn("input min-h-20", inputClassName)}
                          autoFocus={autoFocus}
                          onChange={(e) => setValue(e.currentTarget.value)} placeholder={placeholder}/>
                :
                <input id={name} name={name} type={type} value={value} className={cn("input", inputClassName)}
                       autoFocus={autoFocus}
                       onChange={(e) => setValue(e.currentTarget.value)} autoComplete={name} placeholder={placeholder}/>
            }
            {error ?
                <span className="field-error">{t(error.key,error.params)}</span>
                : null}
        </label>
    )
}
