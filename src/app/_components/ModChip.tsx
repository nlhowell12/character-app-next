import { Modifier, BonusTypes } from "@/_models";
import { camelToTitle } from "@/_utils/stringUtils";
import { Chip } from "@mui/material";

interface ModCardProps {
    mod: Modifier;
    onDelete: () => void;
}
const modifierString = (key: keyof Modifier, value: any) => {
    switch(key) {
        case('skill'):
            return value;
        case('attribute'):
            return value;
        case('damageType'):
            return value;
        case('value'):
            return ''; 
        case('damage'):
            return camelToTitle(key);
        case('attack'):
            return camelToTitle(key);
        case('defense'):
            return camelToTitle(key);
        case('resistance'):
            return camelToTitle(key);
        case('type'):
            return '';
        default:
            return key
    }
}

export const ModChip = ({ mod, onDelete }: ModCardProps) => {
    const modValue = !!mod.value ? `+${mod.value}` : '';
    let assignmentString = '';
    Object.entries(mod).forEach(([key, value]) => {
        if(!!value){
            assignmentString += ` ${modifierString(key as keyof Modifier, value)}`
        }
    })
    return (
        <Chip
            /* @ts-ignore */
            label={`${modValue} ${BonusTypes[mod.type]} - ${assignmentString}`}
            variant='outlined'
            onDelete={onDelete}
        />
    );
};
