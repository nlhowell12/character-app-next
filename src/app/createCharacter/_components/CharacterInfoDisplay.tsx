import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    SelectChangeEvent,
    Button,
    Typography,
    Grid,
    Checkbox,
    FormControlLabel,
    Snackbar,
    Alert,
} from '@mui/material';
import { Dispatch, useState } from 'react';
import {
    CharacterAction,
    deleteModAction,
    updateAction,
} from '../../../_reducer/characterReducer';
import { Character, CharacterKeys, Modifier, Sizes } from '@/_models';
import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { ModifierDialog } from '../../_components/ModifierDialog';

import useCharacterService from '@/app/api/_services/useCharacterService';
import { ModChipStack } from '@/app/_components/ModChipStack';
import { isCharacterPsionic } from '@/_utils/spellUtils';
import { useRouter } from 'next/navigation';
import { DisplayCell } from '@/app/character/_components/DisplayCell';

interface CharacterInfoDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    onUpdate?: () => void;
}

interface DisplayCellProps {
    label: string;
    value: string | number;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    disabled?: boolean;
}

const cellStylingObject = {
    borderBottom: 'none',
    padding: '0 .5rem .5rem 0',
};

export const CharacterInfoDisplay = ({
    character,
    dispatch,
    onUpdate,
}: CharacterInfoDisplayProps) => {
    const [openModifiers, setOpenModifers] = useState<boolean>(false);
    const { createCharacter, updateCharacter } = useCharacterService();
    const [error, setError] = useState(false);
    const router = useRouter();
    const handleSizeChange = (e: SelectChangeEvent<string>) => {
        const {
            target: { value },
        } = e;
        dispatch(updateAction(CharacterKeys.size, value));
    };

    const handleSave = async () => {
        const validateSubmit = true;
        if (!!validateSubmit) {
            if (!!onUpdate) {
                const res: Response = await updateCharacter(character);
                if (res.ok) {
                    onUpdate();
                } else {
                    setError(true);
                }
            } else {
                const res: Response = await createCharacter(character);
                if (res.ok) {
                    router.push('/');
                } else {
                    setError(true);
                }
            }
        }
    };

    const handleAddModifier = (appliedModifier: Modifier) => {
        // set up on close
        dispatch(
            updateAction(CharacterKeys.miscModifiers, [
                ...character.miscModifiers,
                appliedModifier,
            ])
        );
    };
    const handleDeleteMod = (mod: Modifier) => {
        dispatch(deleteModAction(mod));
    };
    return (
        <>
            <Grid container>
                <Snackbar
                    open={error}
                    autoHideDuration={3000}
                    onClose={() => setError(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setError(false)}
                        severity='error'
                        sx={{ width: '100%' }}
                    >
                        Error
                    </Alert>
                </Snackbar>
                <DisplayCell
                    editable
                    cellTitle='Name:'
                    value={character.name}
                    onChange={(e) =>
                        dispatch(
                            updateAction(CharacterKeys.name, e.target.value)
                        )
                    }
                />
                <DisplayCell
                    cellTitle='Player Name:'
                    value={character.playerName}
                    disabled
                />
                <Grid item xs={12} sx={{ margin: '.25rem .5rem' }}>
                    <Button
                        variant='outlined'
                        onClick={() => setOpenModifers(true)}
                    >
                        <Typography>Add Modifier</Typography>
                        <Add />
                    </Button>
                    <ModifierDialog
                        onAdd={handleAddModifier}
                        onClose={() => setOpenModifers(false)}
                        open={openModifiers}
                    />
                    <Button variant='outlined' onClick={handleSave}>
                        <Typography>
                            {!!onUpdate
                                ? `Update Character `
                                : `Create Character`}
                        </Typography>
                        <SaveIcon sx={{ marginLeft: '.5rem' }} />
                    </Button>
                </Grid>
                <DisplayCell
                    editable
                    cellTitle='Race:'
                    value={character.race}
                    onChange={(e) =>
                        dispatch(
                            updateAction(CharacterKeys.race, e.target.value)
                        )
                    }
                />
                <DisplayCell
                    editable
                    cellTitle='Subrace:'
                    value={character.subRace}
                    onChange={(e) =>
                        dispatch(
                            updateAction(CharacterKeys.subRace, e.target.value)
                        )
                    }
                />
                <Grid item xs={4}>
                    <FormControl sx={{ width: '100%' }}>
                        <InputLabel>Size</InputLabel>
                        <Select
                            label='Size:'
                            value={character.size}
                            fullWidth
                            onChange={handleSizeChange}
                        >
                            {Object.values(Sizes).map((name) => {
                                return (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                <DisplayCell
                    editable
                    cellTitle='XP:'
                    value={character.experience}
                    onChange={(e) =>
                        dispatch(
                            updateAction(
                                CharacterKeys.experience,
                                Number(e.target.value)
                            )
                        )
                    }
                />
                <DisplayCell
                    editable
                    cellTitle='Max Hit Points:'
                    value={character.maxHitPoints}
                    onChange={(e) => {
                        dispatch(
                            updateAction(
                                CharacterKeys.maxHitPoints,
                                Number(e.target.value)
                            )
                        );
                        dispatch(
                            updateAction(
                                CharacterKeys.currentHitPoints,
                                Number(e.target.value)
                            )
                        );
                    }}
                />
                {isCharacterPsionic(character) ? (
                    <DisplayCell
                        editable
                        cellTitle='Max Power Points:'
                        value={character.maxPowerPoints}
                        onChange={(e) => {
                            dispatch(
                                updateAction(
                                    CharacterKeys.maxPowerPoints,
                                    Number(e.target.value)
                                )
                            );
                            dispatch(
                                updateAction(
                                    CharacterKeys.powerPoints,
                                    Number(e.target.value)
                                )
                            );
                        }}
                    />
                ) : null}
                <DisplayCell
                    editable
                    cellTitle='Age:'
                    value={character.age}
                    onChange={(e) =>
                        dispatch(
                            updateAction(CharacterKeys.age, e.target.value)
                        )
                    }
                />
                <DisplayCell
                    editable
                    cellTitle='Height:'
                    value={character.height}
                    onChange={(e) =>
                        dispatch(
                            updateAction(CharacterKeys.height, e.target.value)
                        )
                    }
                />
                <DisplayCell
                    editable
                    cellTitle='Weight:'
                    value={character.weight}
                    onChange={(e) =>
                        dispatch(
                            updateAction(CharacterKeys.weight, e.target.value)
                        )
                    }
                />
                <DisplayCell
                    editable
                    cellTitle='Eyes:'
                    value={character.eyeColor}
                    onChange={(e) =>
                        dispatch(
                            updateAction(CharacterKeys.eyeColor, e.target.value)
                        )
                    }
                />
                <DisplayCell
                    editable
                    cellTitle='Hair:'
                    value={character.hairColor}
                    onChange={(e) =>
                        dispatch(
                            updateAction(
                                CharacterKeys.hairColor,
                                e.target.value
                            )
                        )
                    }
                />
                <Grid item xs={12} xl={4}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={character.isPsionic}
                                onChange={(e) => {
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.isPsionic,
                                            e.target.checked
                                        )
                                    );
                                    if (
                                        !e.target.checked &&
                                        character.maxPowerPoints > 0
                                    ) {
                                        dispatch(
                                            updateAction(
                                                CharacterKeys.maxPowerPoints,
                                                0
                                            )
                                        );
                                        dispatch(
                                            updateAction(
                                                CharacterKeys.powerPoints,
                                                0
                                            )
                                        );
                                    }
                                }}
                                name='boolDamageType'
                            />
                        }
                        label='Is this character innately psionic?'
                    />
                </Grid>
            </Grid>
            <Grid item>
                <ModChipStack
                    mods={character.miscModifiers}
                    onDelete={handleDeleteMod}
                />
            </Grid>
        </>
    );
};
