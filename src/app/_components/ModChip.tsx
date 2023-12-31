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
        case('definition'):
            return '';
        case('damageType'):
            return `(${value})`;
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
        case('id'):
            return '';
        case('damageDice'):
            return '';
        case('numberOfDice'):
            return '';
        default:
            return key
    }
}

export const ModChip = ({ mod, onDelete }: ModCardProps) => {
    const positive = !!mod.value && mod.value >= 0 ? '+' : ''
    const modValue = !!mod.value ? `${positive}${mod.value}` : '';
    const modDefinition = !!mod.definition ? ` (${mod.definition})` : ''
    const modType = !mod.numberOfDice ? mod.type : ''
    const bonusDamageDice = !!mod.numberOfDice ? `+${mod.numberOfDice}${mod.damageDice}`: '';
    let assignmentString = '';
    Object.entries(mod).forEach(([key, value]) => {
        if(!!value){
            assignmentString += ` ${modifierString(key as keyof Modifier, value)}`
        }
    })
    return (
        <Chip
            /* @ts-ignore */
            label={`${bonusDamageDice} ${modValue} ${modType} - ${assignmentString}${modDefinition}`}
            variant='outlined'
            onDelete={onDelete}
        />
    );
};
