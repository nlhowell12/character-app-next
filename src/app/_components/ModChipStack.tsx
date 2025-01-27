import { BonusTypes, Modifier, ModifierSource } from '@/_models';
import { Stack } from '@mui/material';
import * as R from 'ramda';
import { ModChip } from './ModChip';
import { v4 as uuidv4 } from 'uuid';

interface ModChipStackProps {
    mods: Modifier[];
    onDelete: (value: any) => void;
    edit?: boolean;
}

export const ModChipStack = ({ mods, onDelete, edit = false }: ModChipStackProps) => {
    const showMod = (x: Modifier) => {
        if(edit) return true;
        switch(x.type){
            case BonusTypes.Racial:
                return false;
        }
        switch(x.source){
            case ModifierSource.trait:
                return false
            case ModifierSource.synergy:
                return false
            case ModifierSource.classAbility:
                return false
        }
        return true;
    }
    return (
        <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='flex-end'>
            {R.filter(showMod, mods).map((mod) => {
                return (
                    <ModChip
                        key={`${mod.type}-${mod.id || uuidv4()}`}
                        mod={mod}
                        onDelete={() => onDelete(mod)}
                    />
                );
            })}
        </Stack>
    );
};
