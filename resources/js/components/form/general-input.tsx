import {ReactNode, useState} from "react";
import {cn} from "@/lib/utils";
import {ITranslatableObject} from "@/types";
import {useTranslation} from "react-i18next";

type ValidationRule = 'required' | 'min-8' | 'date';

interface TextInputProps {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'date' | 'time';
    required?: boolean;
    value: string;
    setValue: any;
    validation?: ((value: string) => ITranslatableObject | null);
    validationRules?: ValidationRule[];
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

    if (validationRules?.length > 0) {
        for (let i = 0; i < validationRules.length; i++) {
            switch (validationRules[i]) {
                case "required":
                    if ((!value) && value.length <= 0) {
                        return {key: 'field_required', params: {fieldName: label}};
                    }
                    break;
            }
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
        placeholder = '',
        autoFocus = false,
        className = '',
        inputClassName = '',
    }: TextInputProps): ReactNode {
    const {t} = useTranslation('errors');

    if (required) {
        className += ' input-required';
        validationRules!.push('required');
    }

    const [error, setError] = useState<ITranslatableObject | null>(null);

    const validate = () => {
        if (validationRules?.length > 0) {
            setError(checkValidationRules(validationRules, value, label) ?? null);
        }
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
