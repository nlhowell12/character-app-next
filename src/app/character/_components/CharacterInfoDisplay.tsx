import {
    Button,
    Dialog,
    Grid,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { DisplayCell } from './DisplayCell';
import { Character, CharacterKeys, Modifier, ModifierSource } from '@/_models';
import { CharacterAction, deleteModAction, updateAction } from '@/_reducer/characterReducer';
import { ModChip } from '@/app/_components/ModChip';
import { Dispatch, useState } from 'react';
import * as R from 'ramda';
import { ModifierDialog } from '@/app/_components/ModifierDialog';
import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import useCharacterService from '@/app/api/_services/useCharacterService';
import { v4 as uuidv4 } from 'uuid';
interface CharacterInfoDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

const cellStylingObject = {
    borderBottom: 'none',
    padding: '0 .5rem .5rem 0',
};

export const CharacterInfoDisplay = ({
    character,
    dispatch,
}: CharacterInfoDisplayProps) => {
    const notASI = (x: Modifier) =>
        x.definition !== ModifierSource.attributeScoreIncrease;
    const [openModifiers, setOpenModifers] = useState<boolean>(false);
    const { updateCharacter } = useCharacterService();
    return (
        <Grid container>
            <Grid item xs={6}>
                <Table>
                    <TableBody>
                        <TableRow sx={{ border: 'none' }}>
                            <DisplayCell
                                variant='body1'
                                cellTitle='Name:'
                                value={character.name}
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Player:'
                                value={character.playerName || 'N/A'}
                            />
                            <TableCell sx={cellStylingObject}>
                                <Button
                                    variant='outlined'
                                    onClick={() => setOpenModifers(true)}
                                >
                                    <Typography>Add Modifier</Typography>
                                    <Add sx={{ marginLeft: '.5rem' }} />
                                </Button>
                                <Dialog
                                    open={openModifiers}
                                    onClose={() => setOpenModifers(false)}
                                >
                                    <ModifierDialog
                                        character={character}
                                        dispatch={dispatch}
                                    />
                                </Dialog>
                            </TableCell>
                            <TableCell sx={cellStylingObject}>
                                <Button
                                    variant='outlined'
                                    onClick={() => updateCharacter(character)}
                                >
                                    <Typography>Save Character</Typography>
                                    <SaveIcon sx={{ marginLeft: '.5rem' }} />
                                </Button>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <DisplayCell
                                variant='body1'
                                cellTitle='Classes:'
                                value={character.classes.map(
                                    (cls) => `${cls.name} ${cls.level} `
                                )}
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Race:'
                                value={character.race}
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Subrace:'
                                value={character.subRace}
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Size:'
                                value={character.size}
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='XP:'
                                value={character.experience}
                                editable={true}
                                onChange={(e) => dispatch(updateAction(CharacterKeys.experience, Number(e.target.value)))}
						    />
                        </TableRow>
                        <TableRow>
                            <DisplayCell
                                variant='body1'
                                cellTitle='Age:'
                                value={!!character.age ? character.age : 'N/A'}
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Height:'
                                value={
                                    !!character.height
                                        ? character.height
                                        : 'N/A'
                                }
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Weight:'
                                value={
                                    !!character.weight
                                        ? character.weight
                                        : 'N/A'
                                }
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Eyes:'
                                value={
                                    !!character.eyeColor
                                        ? character.eyeColor
                                        : 'N/A'
                                }
                            />
                            <DisplayCell
                                variant='body1'
                                cellTitle='Hair:'
                                value={
                                    !!character.hairColor
                                        ? character.hairColor
                                        : 'N/A'
                                }
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>
            <Grid item xs={5}>
                <Stack direction='row' spacing={1} flexWrap='wrap'>
                    {R.filter(notASI, character.miscModifiers).map((mod) => {
                        return (
                            <ModChip
                                key={`${mod.type}-${mod.id || uuidv4()}`}
                                mod={mod}
                                onDelete={() => dispatch(deleteModAction(mod))}
                            />
                        );
                    })}
                </Stack>
            </Grid>
        </Grid>
    );
};
