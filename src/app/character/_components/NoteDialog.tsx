import { Character, CharacterKeys, Languages, Note } from '@/_models';
import {
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
    TableBody,
    MenuItem,
    Select,
    SelectChangeEvent,
    FormControl,
    FormControlLabel,
    InputLabel,
    Box,
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
import {
    CancelRounded,
    CheckCircle,
    ExpandLess,
    ExpandMore,
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { StatusEffectDialog } from './StatusEffectDialog';
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

interface OtherInfoTooltipProps {
    display: any[];
}
const OtherInfoTooltip = ({ display }: OtherInfoTooltipProps) => {
    const tableCellStyling = { borderBottom: 'none' };
    return (
        <Table size='small'>
            <TableBody>
                {display.map((x) => {
                    return (
                        <TableRow key={x}>
                            <TableCell sx={tableCellStyling}>
                                <Typography>{x}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

interface OtherInfoListItemProps {
    display: any[];
    onEdit: () => void;
    title: string;
}

const OtherInfoListItem = ({
    display,
    onEdit,
    title,
}: OtherInfoListItemProps) => {
    return display.length ? (
        <Tooltip
            title={<OtherInfoTooltip display={display} />}
            followCursor
            placement='left'
        >
            <ListItem
                secondaryAction={
                    <IconButton onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                }
            >
                <ListItemText primary={title} />
            </ListItem>
        </Tooltip>
    ) : (
        <ListItem
            secondaryAction={
                <IconButton onClick={onEdit}>
                    <EditIcon />
                </IconButton>
            }
        >
            <ListItemText primary={title} />
        </ListItem>
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

interface StringArrayDialogProps {
    open: boolean;
    onClose: () => void;
    value: string;
    onChange: (e: any) => void;
    onAdd: () => void;
    onRemove: (x: string) => void;
    display: string[];
    label: string;
}
const StringArrayDialog = ({
    open,
    onClose,
    value,
    onChange,
    onAdd,
    onRemove,
    display,
    label,
}: StringArrayDialogProps) => {
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
                    value={value}
                    onChange={onChange}
                    label={label}
                />
                <CardActions sx={{ justifyContent: 'right' }}>
                    <Button onClick={onClose}>
                        <CancelRounded />
                    </Button>
                    <Button>
                        <CheckCircle onClick={onAdd} />
                    </Button>
                </CardActions>
            </Card>
            <Stack>
                {display.map((x) => {
                    return (
                        <Chip key={x} label={x} onDelete={() => onRemove(x)} />
                    );
                })}
            </Stack>
        </Dialog>
    );
};
interface LanguageDialogProps {
    open: boolean;
    onClose: () => void;
    languages: string[];
    dispatch: Dispatch<CharacterAction>;
}

const LanguageDialog = ({
    open,
    onClose,
    languages,
    dispatch,
}: LanguageDialogProps) => {
    const handleChangeLanguages = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        dispatch(updateAction(CharacterKeys.languages, value));
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
                <FormControl>
                    <InputLabel id='bonus-type-id'>Languages</InputLabel>
                    <Select
                        labelId='language-label'
                        id='languages'
                        label='Languages'
                        multiple
                        value={languages}
                        onChange={handleChangeLanguages}
                        renderValue={(selected) => (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                }}
                            >
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                    >
                        {Object.values(Languages).map((lang) => {
                            return (
                                <MenuItem key={lang} value={lang}>
                                    {lang}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

                <CardActions sx={{ justifyContent: 'right' }}>
                    <Button onClick={onClose}>
                        <CancelRounded />
                    </Button>
                    <Button></Button>
                </CardActions>
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
    const [openProf, setOpenProf] = useState(false);
    const [newProf, setNewProf] = useState('');
    const [openSpec, setOpenSpec] = useState(false);
    const [newSpec, setNewSpec] = useState('');

    const handleAddProf = () => {
        !!newProf &&
            dispatch(
                updateAction(CharacterKeys.proficiencies, [
                    ...character.proficiencies,
                    newProf,
                ])
            );
        setNewProf('');
    };

    const handleRemoveProf = (prof: string) => {
        dispatch(
            updateAction(
                CharacterKeys.proficiencies,
                character.proficiencies.filter((x) => x !== prof)
            )
        );
    };
    const handleAddSpec = () => {
        !!newSpec &&
            dispatch(
                updateAction(CharacterKeys.specialAbilities, [
                    ...character.specialAbilities,
                    newSpec,
                ])
            );
        setNewSpec('');
    };

    const handleRemoveSpec = (abl: string) => {
        dispatch(
            updateAction(
                CharacterKeys.specialAbilities,
                character.specialAbilities.filter((x) => x !== abl)
            )
        );
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth={false}>
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
                            Other Information
                            <Tooltip title='Add Note'>
                                <IconButton
                                    edge='end'
                                    aria-label='add'
                                    onClick={() => setNewNoteOpen(true)}
                                >
                                    <Add />
                                </IconButton>
                            </Tooltip>
                        </ListSubheader>
                    }
                >
                    <LanguageDialog
                        open={openLang}
                        languages={character.languages}
                        onClose={() => setOpenLang(false)}
                        dispatch={dispatch}
                    />
                    <OtherInfoListItem
                        title='Languages'
                        display={character.languages}
                        onEdit={() => setOpenLang(true)}
                    />
                    <StringArrayDialog
                        open={openProf}
                        value={newProf}
                        display={character.proficiencies}
                        onClose={() => setOpenProf(false)}
                        onChange={(e) => setNewProf(e.target.value)}
                        onAdd={handleAddProf}
                        onRemove={handleRemoveProf}
                        label='Add New Proficiency'
                    />
                    <OtherInfoListItem
                        title='Proficiencies'
                        display={character.proficiencies}
                        onEdit={() => setOpenProf(true)}
                    />
                    <StringArrayDialog
                        open={openSpec}
                        value={newSpec}
                        display={character.specialAbilities}
                        onClose={() => setOpenSpec(false)}
                        onChange={(e) => setNewSpec(e.target.value)}
                        onAdd={handleAddSpec}
                        onRemove={handleRemoveSpec}
                        label='Add New Special Ability'
                    />
                    <OtherInfoListItem
                        title='Special Abilities'
                        display={character.specialAbilities}
                        onEdit={() => setOpenSpec(true)}
                    />
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
