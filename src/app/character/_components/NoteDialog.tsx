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
import { useState } from 'react';
import Add from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

interface NoteDialogProps {
    character: Character;
    open: boolean;
    onClose: () => void;
}

interface NoteItemProps {
    note: Note;
}

const NoteItem = ({ note }: NoteItemProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (
        <>
            <ListItem
                onClick={handleClick}
                secondaryAction={
                    <IconButton edge='end' aria-label='delete'>
                        <DeleteIcon />
                    </IconButton>
                }
            >
                <ListItemAvatar>
                    <Avatar>
                        <NotesIcon />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${note.title}`} />
            </ListItem>
            <Collapse in={open} unmountOnExit>
                <TextField value={note.note} />
            </Collapse>
        </>
    );
};
interface AddNoteDialogProps {
    open: boolean;
    onClose: () => void;
}

const AddNoteDialog = ({ open, onClose }: AddNoteDialogProps) => {
    const [note, setNote] = useState('');
    const [title, setTitle] = useState('');

    const reset = () => {
        setNote('');
        setTitle('');
    }
    const handleSave = () => {
        reset()
        onClose()
    };
    const textFieldStyling = {
        marginBottom: '.5rem'
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <Card sx={{padding: '.5rem', display: 'flex', flexDirection: 'column'}}>
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

export const NoteDialog = ({ character, open, onClose }: NoteDialogProps) => {
    const [newNoteOpen, setNewNoteOpen] = useState(false);
    return (
        <Dialog open={open} onClose={onClose}>
            <Card
                sx={{
                    width: '20rem',
                }}
            >
                <AddNoteDialog open={newNoteOpen} onClose={() => setNewNoteOpen(false)}/>
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
                        return <NoteItem note={note} key={note.id} />;
                    })}
                </List>
            </Card>
        </Dialog>
    );
};
