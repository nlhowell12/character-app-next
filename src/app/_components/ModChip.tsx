import { BonusTypes, Modifier, SkillTypes } from "@/_models";
import { camelToTitle } from "@/_utils/stringUtils";
import { Chip, Tooltip } from "@mui/material";

interface ModCardProps {
    mod: Modifier;
    onDelete: (() => void) | undefined;
}
const modifierString = (key: keyof Modifier, value: any) => {
    switch(key) {
        case('skill'):
            {/* @ts-ignore */}
            return SkillTypes[value];
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
        case('initiative'):
            return camelToTitle(key);
        case('spellSchool'):
            return value;
        case('type'):
            return '';
        case('id'):
            return '';
        case('damageDice'):
            return '';
        case('numberOfDice'):
            return '';
        case('source'):
            return '';
        case('save'):
            return 'Save';
        case('allSaves'):
            return 'All Saves';
        case('allSkills'):
            return 'All Skills';
        case('fromEquipment'):
            return '';
        default:
            return key
    }
}

const getModType = (mod: Modifier) => {
    if(!!mod.spellSchool){
        return 'DC'
    }
    if(!mod.numberOfDice) {
        return mod.type
    }
    return ''
}

const getModSource = (mod: Modifier) => {
    if(mod.type === BonusTypes.Racial){
        return ''
    };
    if(mod.fromEquipment){
        return '(Equipment)';
    }
    return mod.source;
}
export const ModChip = ({ mod, onDelete }: ModCardProps) => {
    const positive = !!mod.value && mod.value >= 0 ? '+' : ''
    const modValue = !!mod.value ? `${positive}${mod.value}` : '';
    const bonusDamageDice = !!mod.numberOfDice ? `+${mod.numberOfDice}${mod.damageDice}`: '';
    let assignmentString = '';
    Object.entries(mod).forEach(([key, value]) => {
        if(!!value){
            assignmentString += ` ${modifierString(key as keyof Modifier, value)}`
        }
    })
    return (
        !!mod.definition ? 
            <Tooltip title={mod.definition}>
            <Chip
                /* @ts-ignore */
                label={`${bonusDamageDice} ${modValue} ${getModType(mod)} - ${assignmentString}(${getModSource(mod)})`}
                variant='outlined'
                onDelete={onDelete}
            />
        </Tooltip> : 
        <Chip
            /* @ts-ignore */
            label={`${bonusDamageDice} ${modValue} ${getModType(mod)} - ${assignmentString}${getModSource(mod)}`}
            variant='outlined'
            onDelete={onDelete}
        />
    );
};
