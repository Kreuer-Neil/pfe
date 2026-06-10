import {ChangeEvent, ReactNode, useState} from "react";
import {cn} from "@/lib/utils";
import {ITranslatableObject} from "@/types";
import {useTranslation} from "react-i18next";

type ValidationRule = 'required' | 'min-6' | 'number' | 'int' | 'date' | 'time';

interface TextInputProps {
    name: string;
    label: string;
    type?: 'text' |'email'| 'number' | 'textarea' | 'date' | 'time';
    style?: 'default' | 'no-label' | 'text';
    required?: boolean;
    value: string;
    setValue: any;
    error?: string|null;
    validation?: ((value: string) => ITranslatableObject | null);
    validationRules?: ValidationRule[];
    hasError?: ((error: boolean) => void);
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
        style = 'default',
        required = false,
        value,
        setValue,
        error = null,
        validationRules = [],
        hasError = (() => null),
        placeholder,
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

    const [validationError, setValidationError] = useState<ITranslatableObject | null>(null);

    const validate = (e: any) => {
        if (type === "number" && Number(e.currentTarget.value) === 0) {
            setValue(null);
        }
        setValidationError(checkValidationRules(validationRules, value, label) ?? null);
        hasError(!!validationError);
    }

    let defaultClass: string = 'input';
    let labelClass = '';
    switch (style) {
        case 'text':
            defaultClass = 'edit-input';
            labelClass = 'sr-only';
            break;
    }

    const canAutocomplete = ['email', 'number', 'password', 'search', 'tel', 'text', 'textarea', 'url'].includes(type);

    return (
        <label htmlFor={name} className={cn('flex flex-col gap-1', className)}>
            <span className={labelClass}>
            {required ? '*' : null}
                {label}
            </span>
            {type === 'textarea' ?
                <textarea id={name} name={name} value={value}
                          className={cn('max-h-32', defaultClass, "min-h-20 p-2", inputClassName)}
                          autoFocus={autoFocus}
                          onFocus={(e) => e.currentTarget.style.height = String(e.currentTarget.scrollHeight) + 'px'}
                          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                              setValue(e.currentTarget.value);
                              // TODO fix shrinking not optimal
                              e.currentTarget.style.height = String(e.currentTarget.scrollHeight) + 'px';
                          }}
                          onBlur={validate}
                          placeholder={placeholder}/>
                :
                <input id={name} name={name} type={type} value={value} className={cn(defaultClass, inputClassName)}
                       autoFocus={autoFocus}
                       onChange={(e) => {
                           setValue(e.currentTarget.value);
                       }} autoComplete={canAutocomplete ? name : undefined}
                       onBlur={validate}
                       placeholder={placeholder}/>
            }
            {(error || validationError) &&
                <span className="field-error">{error ?? t(validationError!.key, validationError!.params)}</span>}
        </label>
    )
}
