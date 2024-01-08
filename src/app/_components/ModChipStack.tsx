import { Modifier, ModifierSource } from '@/_models';
import { Stack } from '@mui/material';
import * as R from 'ramda';
import { ModChip } from './ModChip';
import { v4 as uuidv4 } from 'uuid';

interface ModChipStackProps {
    mods: Modifier[];
    onDelete: (value: any) => void;
}

export const ModChipStack = ({ mods, onDelete }: ModChipStackProps) => {
    const notASI = (x: Modifier) =>
    x.definition !== ModifierSource.attributeScoreIncrease;
    return (
        <Stack direction='row' spacing={1} flexWrap='wrap' justifyContent='flex-end'>
            {R.filter(notASI, mods).map((mod) => {
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
