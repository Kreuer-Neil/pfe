import {ReactNode, useState} from "react";
import {cn} from "@/lib/utils";
import {ITranslatableObject} from "@/types";
import {useTranslation} from "react-i18next";

type ValidationRule = 'required' | 'min-6' | 'number' | 'int' | 'date' | 'time';

interface TextInputProps {
    name: string;
    label: string;
    type?: 'text' | 'number' | 'textarea' | 'date' | 'time';
    required?: boolean;
    value: string;
    setValue: any;
    validation?: ((value: string) => ITranslatableObject | null);
    validationRules?: ValidationRule[];
    hasError?:((error: boolean) => void);
    placeholder?: string;
    autoFocus?: boolean;
    className?: string;
    inputClassName?: string;
}

function checkValidationRules(
    validationRules: ValidationRule[],
    value: string,
    label: string,
): ITranslatableObject | void {
    for (let i = 0; i < validationRules.length; i++) {
        switch (validationRules[i]) {
            case "required":
                if ((!value) && value.length <= 0)
                    return {key: 'field_required', params: {fieldName: label}};
                break;
            case "number":
                if (!(Number(value) !== 0) && value !== '')
                    return {key: 'field_not_number', params: {fieldName: label}};
                break;
            // TODO see how to automate the min length
            case "min-6":
                if (!(value.length >= 6))
                    return {key: 'field_min_length', params: {fieldName: label, min: '6'}};
                break;
            case "date":
                const dateRegExp: RegExp = /^[0-9]{4}-[0-9]{2}-[0-9]{2}?$/;
                if (value.length !== 10 && dateRegExp.test(value))
                    return {key: 'field_not_date', params: {fieldName: label}};
                break;
            case "time":
                const timeRegExp: RegExp = /^[0-9]{2}:[0-9]{2}?$/;
                if (value.length !== 5 && timeRegExp.test(value))
                    return {key: 'field_not_time', params: {fieldName: label}};
                break;
        }
    }
}

export default function GeneralInput(
    {
        name,
        label,
        type = 'text',
        required = false,
        value,
        setValue,
        validationRules = [],
        hasError = (()=> null),
        placeholder = '',
        autoFocus = false,
        className = '',
        inputClassName = '',
    }: TextInputProps): ReactNode {
    const {t} = useTranslation('errors');

    if (required) {
        className += ' input-required';
        validationRules!.unshift('required');
    }

    if (type === 'date') {
        validationRules!.push('date');
    } else if (type === 'time') {
        validationRules!.push('time');
    } else if (type === 'number') {
        validationRules!.push('number');
    }

    const [error, setError] = useState<ITranslatableObject | null>(null);

    const validate = () => {
        setError(checkValidationRules(validationRules, value, label) ?? null);
        hasError(!!error);
    }

    return (
        <label htmlFor={name} className={cn('flex flex-col gap-1', className)}>
            {required ? '*' : null}
            {label}
            {type === 'textarea' ?
                <textarea id={name} name={name} value={value} className={cn("input min-h-20", inputClassName)}
                          autoFocus={autoFocus}
                          onChange={(e) => setValue(e.currentTarget.value)}
                          onBlur={validate}
                          placeholder={placeholder}/>
                :
                <input id={name} name={name} type={type} value={value} className={cn("input", inputClassName)}
                       autoFocus={autoFocus}
                       onChange={(e) => setValue(e.currentTarget.value)} autoComplete={name}
                       onBlur={validate}
                       placeholder={placeholder}/>
            }
            {error ?
                <span className="field-error">{t(error.key, error.params)}</span>
                : null}
        </label>
    )
}
