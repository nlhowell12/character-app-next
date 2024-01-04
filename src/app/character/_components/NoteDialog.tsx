import { Character, Note } from '@/_models';
import {
    Grid,
    Typography,
    List,
    ListItem,
    IconButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Collapse,
    TextField,
    Dialog,
    Card,
    ListSubheader,
    Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotesIcon from '@mui/icons-material/Notes';
import { Dispatch, useState } from 'react';
import Add from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
    CharacterAction,
    addNoteAction,
    deleteNoteAction,
    updateNoteAction,
} from '@/_reducer/characterReducer';
import { v4 as uuidv4 } from 'uuid';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

interface NoteDialogProps {
    character: Character;
    open: boolean;
    onClose: () => void;
    dispatch: Dispatch<CharacterAction>;
}

interface NoteItemProps {
    note: Note;
    dispatch: Dispatch<CharacterAction>;
}

const NoteItem = ({ note, dispatch }: NoteItemProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <ListItem
                secondaryAction={
                    <IconButton
                        edge='end'
                        aria-label='delete'
                        onClick={() => dispatch(deleteNoteAction(note.id))}
                    >
                        <DeleteIcon />
                    </IconButton>
                }
            >
                <ListItemAvatar onClick={handleClick}>
                    <Avatar>
                        <NotesIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${note.title}`} />
                <IconButton onClick={handleClick}>
                    {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </ListItem>
            <Collapse in={open} unmountOnExit>
                <TextField
                    fullWidth
                    value={note.note}
                    onChange={(e) =>
                        dispatch(updateNoteAction(e.target.value, note.id))
                    }
                />
            </Collapse>
        </>
    );
};
interface AddNoteDialogProps {
    open: boolean;
    onClose: () => void;
    dispatch: Dispatch<CharacterAction>;
}

const AddNoteDialog = ({ open, onClose, dispatch }: AddNoteDialogProps) => {
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');

    const reset = () => {
        setNote('');
        setTitle('');
    };
    const handleSave = () => {
        dispatch(addNoteAction({ id: uuidv4(), title, note }));
        reset();
        onClose();
    };
    const textFieldStyling = {
        marginBottom: '.5rem',
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <Card
                sx={{
                    padding: '.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <TextField
                    sx={textFieldStyling}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    label='Title'
                />
                <TextField
                    sx={textFieldStyling}
                    multiline
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    label='Note'
                />
                <Button variant='outlined' onClick={handleSave}>
                    <Typography>Save Note</Typography>
                    <SaveIcon sx={{ marginLeft: '.5rem' }} />
                </Button>
            </Card>
        </Dialog>
    );
};

export const NoteDialog = ({
    character,
    open,
    onClose,
    dispatch,
}: NoteDialogProps) => {
    const [newNoteOpen, setNewNoteOpen] = useState(false);
    return (
        <Dialog open={open} onClose={onClose}>
            <Card
                sx={{
                    width: '20rem',
                }}
            >
                <AddNoteDialog
                    open={newNoteOpen}
                    onClose={() => setNewNoteOpen(false)}
                    dispatch={dispatch}
                />
                <List
                    dense
                    subheader={
                        <ListSubheader
                            component='div'
                            id='nested-list-subheader'
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            Notes
                            <IconButton
                                edge='end'
                                aria-label='add'
                                onClick={() => setNewNoteOpen(true)}
                            >
                                <Add />
                            </IconButton>
                        </ListSubheader>
                    }
                >
                    {character.notes?.map((note: Note) => {
                        return (
                            <NoteItem
                                note={note}
                                key={note.id}
                                dispatch={dispatch}
                            />
                        );
                    })}
                </List>
            </Card>
        </Dialog>
    );
};
