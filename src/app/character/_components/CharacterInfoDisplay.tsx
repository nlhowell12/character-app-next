import {
    Alert,
    Button,
    Dialog,
    Grid,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import { DisplayCell } from './DisplayCell';
import { Character, CharacterKeys, Modifier } from '@/_models';
import { CharacterAction, deleteModAction, updateAction } from '@/_reducer/characterReducer';
import { Dispatch, useState } from 'react';
import { ModifierDialog } from '@/app/_components/ModifierDialog';
import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import useCharacterService from '@/app/api/_services/useCharacterService';
import { ModChipStack } from '@/app/_components/ModChipStack';
import { NextResponse } from 'next/server';
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
    const [openModifiers, setOpenModifers] = useState<boolean>(false);
    const { updateCharacter } = useCharacterService();
    const [openSuccess, setOpenSuccess] = useState<boolean>(false);

    const handleAddModifier = (appliedModifier: Modifier) => {
        // set up on close
        dispatch(updateAction(CharacterKeys.miscModifiers, [...character.miscModifiers, appliedModifier]))
    
    };
    const handleDeleteMod = (mod: Modifier) => {
        dispatch(deleteModAction(mod))
    };
    const handleUpdate = async () => {
        const res: Response = await updateCharacter(character);
        if(res.ok){
            setOpenSuccess(true);
        }
    }
    return (
        <Grid container>
            <Grid item xs={12} lg={6}>
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
                                <ModifierDialog
                                    onAdd={handleAddModifier}
                                    open={openModifiers}
                                    onClose={() => setOpenModifers(false)}
                                />
                            </TableCell>
                            <TableCell sx={cellStylingObject}>
                                <Button
                                    variant='outlined'
                                    onClick={handleUpdate}
                                >
                                    <Typography>Save Character</Typography>
                                    <SaveIcon sx={{ marginLeft: '.5rem' }} />
                                </Button>
                                <Snackbar open={openSuccess} autoHideDuration={3000} onClose={() => setOpenSuccess(false)} anchorOrigin={{vertical:'top', horizontal: 'center'}}>
                                <Alert onClose={() => setOpenSuccess(false)} severity="success" sx={{ width: '100%' }}>
                                    Character Saved Successfully!
                                </Alert>
                                </Snackbar>
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
                                isNumber
                                value={character.experience}
                                editable={true}
                                onChange={(e) => dispatch(updateAction(CharacterKeys.experience, Number(e.target.value)))}
						    />
                        </TableRow>
                        <TableRow>
                            <DisplayCell
                                variant='body1'
                                cellTitle='Age:'
                                isNumber
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
            <Grid item xs={12} lg={6}>
                <ModChipStack mods={character.miscModifiers} onDelete={handleDeleteMod}/>
            </Grid>
        </Grid>
    );
};
