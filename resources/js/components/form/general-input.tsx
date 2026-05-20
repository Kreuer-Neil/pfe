import {ReactNode} from "react";
import {cn} from "@/lib/utils";

interface TextInputProps {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'date' | 'time';
    required?: boolean;
    value: string;
    setValue: any;
    placeholder?: string;
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
        placeholder = '',
        className = '',
        inputClassName = '',
    }: TextInputProps): ReactNode {

    inputClassName += required ? ' input-required' : '';
    return (
        <label htmlFor={name} className={cn('flex flex-col gap-1', className)}>
            {required ? '*' : null}
            {label}
            {type === 'textarea' ?
                <textarea id={name} name={name} value={value} className={cn("input min-h-20", inputClassName)}
                          onChange={(e) => setValue(e.currentTarget.value)} placeholder={placeholder}/>
                :
                <input id={name} name={name} type={type} value={value} className={cn("input", inputClassName)}
                       onChange={(e) => setValue(e.currentTarget.value)} autoComplete={name} placeholder={placeholder}/>
            }
        </label>
    )
}
