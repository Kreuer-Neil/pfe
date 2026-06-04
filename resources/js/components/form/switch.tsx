import {cn} from "@/lib/utils";
import {Dispatch} from "react";

interface SwitchProps {
    label:string;
    isChecked:boolean;
    // setValue:Dispatch<State>
    setValue:any;
    className?:string;
}

export default function Switch({label,isChecked,setValue,className = ''}:SwitchProps) {
    return(
        <label className={cn('flex items-center w-full cursor-pointer', className)}>
            {label}
            {/* TODO style as mobile switch */}
            <input type="checkbox" className="ml-auto"
                          checked={isChecked}
            onChange={(e)=> setValue(!isChecked)}
        />
        </label>
    );
}
