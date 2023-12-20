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
    Dialog,
} from '@mui/material';
import { Dispatch, useState } from 'react';
import {
    CharacterAction,
    updateAction,
} from '../../../_reducer/characterReducer';
import { Character, CharacterKeys, Sizes } from '@/_models';
import { Add } from '@mui/icons-material';
import { ModifierDialog } from './ModifierDialog';

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
    padding: '.5rem',
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
    const playerName = 'Hater';
    const [openModifiers, setOpenModifers] = useState<boolean>(false);

    const handleSizeChange = (e: SelectChangeEvent<string>) => {
        const {
            target: { value },
        } = e;
        dispatch(updateAction(CharacterKeys.size, value));
    };

    return (
        <div
            style={{
                width: '75%',
            }}
        >
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
                            value={playerName}
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
                            <Dialog
                                open={openModifiers}
                                onClose={() => setOpenModifers(false)}
                            >
                                <ModifierDialog character={character} dispatch={dispatch}/>
                            </Dialog>
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
                                            <MenuItem key={name} value={name}>
                                                {name}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </TableCell>
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
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
