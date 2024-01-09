import {
    Alert,
    Button,
    Dialog,
    Grid,
    Snackbar,
    Typography,
} from '@mui/material';
import { DisplayCell } from './DisplayCell';
import { Character, CharacterKeys, Modifier } from '@/_models';
import {
    CharacterAction,
    deleteModAction,
    updateAction,
} from '@/_reducer/characterReducer';
import { Dispatch, SetStateAction, useState } from 'react';
import { ModifierDialog } from '@/app/_components/ModifierDialog';
import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import useCharacterService from '@/app/api/_services/useCharacterService';
import { ModChipStack } from '@/app/_components/ModChipStack';
import { FeatDisplay } from './FeatDisplay';
import { NoteDialog } from './NoteDialog';
import NotesIcon from '@mui/icons-material/Notes';

interface CharacterInfoDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    onEdit: Dispatch<SetStateAction<boolean>>;
}

export const CharacterInfoDisplay = ({
    character,
    dispatch,
    onEdit
}: CharacterInfoDisplayProps) => {
    const [openModifiers, setOpenModifers] = useState<boolean>(false);
    const { updateCharacter } = useCharacterService();
    const [openSuccess, setOpenSuccess] = useState<boolean>(false);
    const [openFeats, setOpenFeats] = useState<boolean>(false);
    const [openNotes, setOpenNotes] = useState<boolean>(false);

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
    const handleUpdate = async () => {
        const res: Response = await updateCharacter(character);
        if (res.ok) {
            setOpenSuccess(true);
        }
    };
    const buttonStlying = {
        margin: '.25rem',
    };
    return (
        <>
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
            <Grid item xs={12} xl={4}>
                <Button
                    variant='outlined'
                    onClick={() => setOpenModifers(true)}
                    sx={buttonStlying}
                >
                    <Typography>Add Modifier</Typography>
                    <Add sx={{ marginLeft: '.5rem' }} />
                </Button>
                <ModifierDialog
                    onAdd={handleAddModifier}
                    open={openModifiers}
                    onClose={() => setOpenModifers(false)}
                />
                <Button
                    variant='outlined'
                    onClick={() => setOpenFeats(true)}
                    sx={buttonStlying}
                >
                    <Typography>View Feats</Typography>
                    <Add sx={{ marginLeft: '.5rem' }} />
                </Button>
                <Dialog open={openFeats} onClose={() => setOpenFeats(false)}>
                    <FeatDisplay feats={character.feats} />
                </Dialog>
                <Button
                    variant='outlined'
                    onClick={() => setOpenNotes(true)}
                    sx={buttonStlying}
                >
                    <Typography>Open Notes</Typography>
                    <NotesIcon sx={{ marginLeft: '.5rem' }} />
                </Button>
                <NoteDialog
                    open={openNotes}
                    character={character}
                    onClose={() => setOpenNotes(false)}
                    dispatch={dispatch}
                />
                <Button
                    variant='outlined'
                    onClick={handleUpdate}
                    sx={buttonStlying}
                >
                    <Typography>Save Character</Typography>
                    <SaveIcon sx={{ marginLeft: '.5rem' }} />
                </Button>
                <Button
                    variant='outlined'
                    onClick={() => onEdit(true)}
                    sx={buttonStlying}
                >
                    <Typography>Edit Character</Typography>
                    <SaveIcon sx={{ marginLeft: '.5rem' }} />
                </Button>
                <Snackbar
                    open={openSuccess}
                    autoHideDuration={3000}
                    onClose={() => setOpenSuccess(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setOpenSuccess(false)}
                        severity='success'
                        sx={{ width: '100%' }}
                    >
                        Character Saved Successfully!
                    </Alert>
                </Snackbar>
            </Grid>

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
                variant='body1'
                cellTitle='Age:'
                isNumber
                value={!!character.age ? character.age : 'N/A'}
            />
            <DisplayCell
                variant='body1'
                cellTitle='Height:'
                value={!!character.height ? character.height : 'N/A'}
            />
            <DisplayCell
                variant='body1'
                cellTitle='Weight:'
                value={!!character.weight ? character.weight : 'N/A'}
            />
            <DisplayCell
                variant='body1'
                cellTitle='Eyes:'
                value={!!character.eyeColor ? character.eyeColor : 'N/A'}
            />
            <DisplayCell
                variant='body1'
                cellTitle='Hair:'
                value={!!character.hairColor ? character.hairColor : 'N/A'}
            />
            <ModChipStack
                mods={character.miscModifiers}
                onDelete={handleDeleteMod}
            />
        </>
    );
};
