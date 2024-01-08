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
} from '@mui/material';
import { Dispatch, useState } from 'react';
import {
    CharacterAction,
    deleteModAction,
    updateAction,
} from '../../../_reducer/characterReducer';
import {
    Character,
    CharacterClassNames,
    CharacterKeys,
    Modifier,
    Sizes,
} from '@/_models';
import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import { ModifierDialog } from '../../_components/ModifierDialog';

import useCharacterService from '@/app/api/_services/useCharacterService';
import { ModChipStack } from '@/app/_components/ModChipStack';
import { isCharacterPsionic } from '@/_utils/spellUtils';

interface CharacterInfoDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
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

const DisplayCell = ({
    label,
    value,
    onChange,
    disabled,
}: DisplayCellProps) => {
    return (
        <TableCell sx={cellStylingObject}>
            <TextField
                variant='outlined'
                label={label}
                value={value}
                onChange={onChange || undefined}
                disabled={!!disabled}
            />
        </TableCell>
    );
};

export const CharacterInfoDisplay: React.FC<CharacterInfoDisplayProps> = ({
    character,
    dispatch,
}) => {
    const [openModifiers, setOpenModifers] = useState<boolean>(false);
    const { createCharacter } = useCharacterService();

    const handleSizeChange = (e: SelectChangeEvent<string>) => {
        const {
            target: { value },
        } = e;
        dispatch(updateAction(CharacterKeys.size, value));
    };

    const handleSave = () => {
        const validateSubmit = true;
        if (!!validateSubmit) {
            createCharacter(character);
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
        <Grid container>
            <Grid xs={12} item>
                <Table>
                    <TableBody>
                        <TableRow
                            sx={{
                                border: 'none',
                            }}
                        >
                            <DisplayCell
                                label='Name'
                                value={character.name}
                                onChange={(e) =>
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.name,
                                            e.target.value
                                        )
                                    )
                                }
                            />
                            <DisplayCell
                                label='Player Name'
                                value={character.playerName}
                                disabled
                            />
                            <TableCell sx={cellStylingObject}>
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
                            </TableCell>
                            <TableCell sx={cellStylingObject}>
                                <Button variant='outlined' onClick={handleSave}>
                                    <Typography>Create Character</Typography>
                                    <SaveIcon sx={{ marginLeft: '.5rem' }} />
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <DisplayCell
                                label='Race'
                                value={character.race}
                                onChange={(e) =>
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.race,
                                            e.target.value
                                        )
                                    )
                                }
                            />
                            <DisplayCell
                                label='Subrace'
                                value={character.subRace}
                                onChange={(e) =>
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.subRace,
                                            e.target.value
                                        )
                                    )
                                }
                            />
                            <TableCell sx={cellStylingObject}>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel>Size</InputLabel>
                                    <Select
                                        label='Size'
                                        value={character.size}
                                        fullWidth
                                        onChange={handleSizeChange}
                                    >
                                        {Object.values(Sizes).map((name) => {
                                            return (
                                                <MenuItem
                                                    key={name}
                                                    value={name}
                                                >
                                                    {name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </TableCell>
                            <DisplayCell
                                label='XP:'
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
                                label='Max Hit Points'
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
                                    label='Max Power Points'
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
                        </TableRow>
                        <TableRow>
                            <DisplayCell
                                label='Age'
                                value={character.age}
                                onChange={(e) =>
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.age,
                                            e.target.value
                                        )
                                    )
                                }
                            />
                            <DisplayCell
                                label='Height'
                                value={character.height}
                                onChange={(e) =>
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.height,
                                            e.target.value
                                        )
                                    )
                                }
                            />
                            <DisplayCell
                                label='Weight'
                                value={character.weight}
                                onChange={(e) =>
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.weight,
                                            e.target.value
                                        )
                                    )
                                }
                            />
                            <DisplayCell
                                label='Eyes'
                                value={character.eyeColor}
                                onChange={(e) =>
                                    dispatch(
                                        updateAction(
                                            CharacterKeys.eyeColor,
                                            e.target.value
                                        )
                                    )
                                }
                            />
                            <DisplayCell
                                label='Hair'
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
                            <TableCell sx={{ borderBottom: 'none' }}>
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
                                                if (!e.target.checked && character.maxPowerPoints > 0) {
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
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>
            <Grid item>
                <ModChipStack
                    mods={character.miscModifiers}
                    onDelete={handleDeleteMod}
                />
            </Grid>
        </Grid>
    );
};
