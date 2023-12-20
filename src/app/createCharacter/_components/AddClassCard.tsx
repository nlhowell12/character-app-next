import { AttributeNames, ClassAbility } from '@/_models';
import { Add, CancelRounded, CheckCircle } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControl,
    InputLabel,
    MenuItem,
    Popover,
    Select,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';

interface AddClassAbilityProps {
    addAbility: (ability: ClassAbility) => void;
    handleClose: Dispatch<SetStateAction<HTMLButtonElement | null | undefined>>;
}

const textFieldStyling = { marginTop: '.5rem' };
const formControlStyling = { marginTop: '.5rem', marginLeft: '.5rem' };

const AddClassAbility: React.FC<AddClassAbilityProps> = ({
    handleClose,
    addAbility,
}) => {
    const [name, setName] = useState('');
    const [level, setLevel] = useState(1);
    const [description, setDescription] = useState('');

    return (
        <Card variant='outlined'>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    sx={textFieldStyling}
                    label='Name'
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    sx={textFieldStyling}
                    label='Level'
                    onChange={(e) => setLevel(Number(e.target.value))}
                />
                <TextField
                    sx={textFieldStyling}
                    multiline
                    placeholder='Description (optional)...'
                    onChange={(e) => setDescription(e.target.value)}
                />
            </CardContent>
            <CardActions sx={{ justifyContent: 'right' }}>
                <Button onClick={() => handleClose(null)}>
                    <CancelRounded />
                </Button>
                <Button
                    onClick={() => addAbility({ name, level, description })}
                >
                    <CheckCircle />
                </Button>
            </CardActions>
        </Card>
    );
};

interface AddClassCardProps {
    onClose: Dispatch<SetStateAction<HTMLButtonElement | null | undefined>>;
}

export const AddClassCard: React.FC<AddClassCardProps> = ({ onClose }) => {
    const [className, setClassName] = useState('');
    const [level, setLevel] = useState<number>(1);
    const [primarySave, setPrimarySave] = useState<AttributeNames>(
        AttributeNames.Strength
    );
    const [secondarySave, setSecondarySave] = useState<AttributeNames>(
        AttributeNames.Strength
    );
    const [classAbilities, setClassAbilities] = useState<ClassAbility[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);

    const handleAddAbility = (ability: ClassAbility) => {
        setClassAbilities([...classAbilities, ability]);
        setAnchorEl(null);
    };

    return (
        <Card variant='outlined'>
            <CardHeader title='Add New Class' />
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <TextField
                            sx={textFieldStyling}
                            variant='outlined'
                            label='Class Name'
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                        <TextField
                            sx={textFieldStyling}
                            variant='outlined'
                            label='Level'
                            value={level}
                            onChange={(e) => setLevel(Number(e.target.value))}
                        />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <FormControl fullWidth sx={formControlStyling}>
                            <InputLabel id='primary-save-label'>
                                Primary Save
                            </InputLabel>
                            <Select
                                labelId='primary-save-label'
                                id='demo-simple-select'
                                value={primarySave}
                                label='Primary Save'
                                onChange={(e) =>
                                    setPrimarySave(
                                        e.target.value as AttributeNames
                                    )
                                }
                            >
                                {Object.keys(AttributeNames).map((att) => {
                                    return (
                                        <MenuItem value={att}>{att}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={formControlStyling}>
                            <InputLabel id='secondary-save-label'>
                                Secondary Save
                            </InputLabel>
                            <Select
                                labelId='secondary-save-label'
                                id='secondary-save'
                                value={secondarySave}
                                label='Secondary Save'
                                onChange={(e) =>
                                    setSecondarySave(
                                        e.target.value as AttributeNames
                                    )
                                }
                            >
                                {Object.keys(AttributeNames).map((att) => {
                                    return (
                                        <MenuItem value={att}>{att}</MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <Button sx={{ margin: '.5rem 0' }} onClick={handleClick}>
                    <Typography>Add Class Ability</Typography>
                    <Add />
                </Button>
                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <AddClassAbility
                        addAbility={handleAddAbility}
                        handleClose={setAnchorEl}
                    />
                </Popover>
                {classAbilities.map((abl) => {
                    return !!abl.description ? (
                        <Tooltip title={abl.description}>
                            <Card>
                                <Typography
                                    variant='caption'
                                    align='right'
                                >{`Level: ${abl.level}`}</Typography>
                                <Typography>{abl.name}</Typography>
                            </Card>
                        </Tooltip>
                    ) : (
                        <Card>
                            <Typography variant='caption' align='right'>
                                {abl.level}
                            </Typography>
                            <Typography>{abl.name}</Typography>
                        </Card>
                    );
                })}
            </CardContent>
            <CardActions sx={{ justifyContent: 'right' }}>
                <Button onClick={() => onClose(null)}>
                    <CancelRounded />
                </Button>
                <Button>
                    <CheckCircle />
                </Button>
            </CardActions>
        </Card>
    );
};