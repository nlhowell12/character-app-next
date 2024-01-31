import {
    Alert,
    Button,
    Card,
    CardActions,
    CardHeader,
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
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { ModifierDialog } from '@/app/_components/ModifierDialog';
import { Add } from '@mui/icons-material';
import SaveIcon from '@mui/icons-material/Save';
import useCharacterService from '@/app/api/_services/useCharacterService';
import { ModChipStack } from '@/app/_components/ModChipStack';
import { NoteDialog } from './NoteDialog';
import NotesIcon from '@mui/icons-material/Notes';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useRouter } from 'next/navigation';
import UserContext from '@/app/_auth/UserContext';
import { FeatTable } from '@/app/_components/FeatTable';

interface CharacterInfoDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    onEdit: Dispatch<SetStateAction<boolean>>;
}

export const CharacterInfoDisplay = ({
    character,
    dispatch,
    onEdit,
}: CharacterInfoDisplayProps) => {
    const [openModifiers, setOpenModifers] = useState<boolean>(false);
    const { updateCharacter, deleteCharacter } = useCharacterService();
    const [openSuccess, setOpenSuccess] = useState<boolean>(false);
    const [openFeats, setOpenFeats] = useState<boolean>(false);
    const [openNotes, setOpenNotes] = useState<boolean>(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
    const {user} = useContext(UserContext);
    
    const router = useRouter();

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
    const handleDelete = async () => {
        const res: Response = await deleteCharacter(character);
        if (res.ok) {
            setOpenSuccess(true);
            router.push('/')
        }
    };
    const buttonStlying = {
        margin: '.25rem',
    };
    const userAdminPrivelages = !!user && (user.isDm || user.name === character.playerName);
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
                    <FeatTable feats={character.feats} />
                </Dialog>
                <Button
                    variant='outlined'
                    onClick={() => setOpenNotes(true)}
                    sx={buttonStlying}
                >
                    <Typography>Other Info</Typography>
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
                    onClick={() => onEdit(true)}
                    sx={buttonStlying}
                    disabled={!userAdminPrivelages}
                >
                    <Typography>Edit Character</Typography>
                    <EditIcon sx={{ marginLeft: '.5rem' }} />
                </Button>
                <Button
                    variant='outlined'
                    onClick={handleUpdate}
                    sx={buttonStlying}
                    disabled={!userAdminPrivelages}
                >
                    <Typography>Save Character</Typography>
                    <SaveIcon sx={{ marginLeft: '.5rem' }} />
                </Button>
                {userAdminPrivelages &&
                <>
                <Button
                    variant='outlined'
                    onClick={() => setOpenDeleteDialog(true)}
                    sx={buttonStlying}
                    color='error'
                >
                    <Typography>Delete Character</Typography>
                    <DeleteForeverIcon sx={{ marginLeft: '.5rem' }} />
                </Button>
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <Card>
                        <CardHeader title='This will permanently delete this character, it cannot be recovered!'/>
                        <CardActions sx={{justifyContent: 'flex-end'}}>
                            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                            <Button color='error' onClick={handleDelete}>Delete</Button>
                        </CardActions>
                    </Card>
                </Dialog>
                </>
                }
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
