import {ReactNode} from "react";
import {Checkbox} from "@/components/ui/checkbox";
import {Field, FieldLabel} from "@/components/ui/field";
import {Item, ItemContent, ItemMedia} from "@/components/ui/item";

interface SelectableCardProps {
    name: string;
    value: string;
    image?: ReactNode;
    defaultChecked?: boolean;
    children: ReactNode;
}

export default function CheckboxCard({name, value, image, defaultChecked, children}: SelectableCardProps) {
    return (
        <Item asChild
              className="check-card"
        >
            <FieldLabel>
                {image &&
                    <ItemMedia variant="image">
                        {image}
                    </ItemMedia>
                }
                <Checkbox name={name} value={value} defaultChecked={defaultChecked} className="sr-only"/>
                <ItemContent>
                    {children}
                </ItemContent>
            </FieldLabel>
        </Item>
    );
}
