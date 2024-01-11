import { Character, CharacterKeys, Magick, Note } from '@/_models';
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
    Table,
    TableCell,
    TableRow,
    Tooltip,
    CardActions,
    Stack,
    Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dispatch, useState } from 'react';
import Add from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import {
    CharacterAction,
    addNoteAction,
    deleteNoteAction,
    updateAction,
    updateNoteAction,
} from '@/_reducer/characterReducer';
import { v4 as uuidv4 } from 'uuid';
import { CancelRounded, CheckCircle, ExpandLess, ExpandMore } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
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

interface LanguageTooltipProps {
    character: Character;
}
const LanguageTooltip = ({ character }: LanguageTooltipProps) => {
    const tableCellStyling = { borderBottom: 'none' };
    return (
        <Table size='small'>
            {character?.languages.map((lang) => {
                return (
                    <TableRow>
                        <TableCell sx={tableCellStyling}>
                            <Typography>{lang}</Typography>
                        </TableCell>
                    </TableRow>
                );
            })}
        </Table>
    );
};

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
                <ListItemAvatar
                    onClick={handleClick}
                    sx={{
                        '&:hover': { opacity: '.6', cursor: 'pointer' },
                    }}
                >
                    <Avatar>{open ? <ExpandLess /> : <ExpandMore />}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={`${note.title}`} />
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
    const [openLang, setOpenLang] = useState(false);
    const [newLang, setNewLang] = useState('');

    const textFieldStyling = {
        marginBottom: '.5rem',
    };

    const handleAddLang = () => {
        dispatch(updateAction(CharacterKeys.languages, [...character.languages, newLang]))
        setOpenLang(false);
        setNewLang('');
    }

    const handleRemoveLang = (lang: string) => {
        dispatch(updateAction(CharacterKeys.languages, character.languages.filter(x => x !== lang)))

    };
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
                    <Dialog open={openLang} onClose={() => setOpenLang(false)}>
                    <Card
                        sx={{
                            padding: '.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <TextField
                            sx={textFieldStyling}
                            value={newLang}
                            onChange={(e) => setNewLang(e.target.value)}
                            label='New Language'
                        />
                            <CardActions sx={{ justifyContent: 'right' }}>
                                <Button onClick={(e) => setOpenLang(false)}>
                                    <CancelRounded />
                                </Button>
                                <Button>
                                    <CheckCircle onClick={() => handleAddLang()} />
                                </Button>
                            </CardActions>
                        </Card>
                        <Stack>
                            {character.languages.map(lang => {
                                return <Chip label={lang} onDelete={() => handleRemoveLang(lang)}/>
                            })}
                        </Stack>
                    </Dialog>
                    <Tooltip title={<LanguageTooltip character={character}/>} followCursor>
                        <ListItem
                            secondaryAction={
                                <IconButton onClick={() => setOpenLang(true)}>
                                    <EditIcon />
                                </IconButton>
                            }
                        >
                            {' '}
                            <ListItemText primary={'Languages'} />
                        </ListItem>
                    </Tooltip>
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
