import {
    AttributeNames,
    CharacterClass,
    CharacterClassNames,
    ClassAbility,
    SkillTypes,
} from '@/_models';
import { Add, CancelRounded, CheckCircle } from '@mui/icons-material';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    Popover,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

interface AddClassAbilityProps {
    addAbility: (ability: ClassAbility) => void;
    handleClose: Dispatch<SetStateAction<HTMLButtonElement | null | undefined>>;
}

const textFieldStyling = { marginTop: '.5rem' };
const formControlStyling = { marginLeft: '.5rem' };

const AddClassAbility = ({ handleClose, addAbility }: AddClassAbilityProps) => {
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
                <Button onClick={(e) => handleClose(null)}>
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
    onClose: (event: any, reason: any) => void;
    onSubmit: (cls: CharacterClass) => void;
}

export const AddClassCard = ({ onClose, onSubmit }: AddClassCardProps) => {
    const [className, setClassName] = useState<CharacterClassNames>(CharacterClassNames.Barbarian);
    const [level, setLevel] = useState<number>(1);
    const [primarySave, setPrimarySave] = useState<AttributeNames>(
        AttributeNames.Strength
    );
    const [secondarySave, setSecondarySave] = useState<AttributeNames>(
        AttributeNames.Strength
    );
    const [classAbilities, setClassAbilities] = useState<ClassAbility[]>([]);
    const [classSkills, setClassSkills] = useState<string[]>([]);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);

    const handleSubmitClick = () => {
        const cls: CharacterClass = {
            name: className,
            level,
            primarySave,
            secondarySave,
            classAbilities,
            classSkills: classSkills.map(x => {return x as SkillTypes})
        }
        onSubmit(cls);
        onClose({}, 'buttonClose')
    };

    const handleAddAbility = (ability: ClassAbility) => {
        setClassAbilities([...classAbilities, ability]);
        setAnchorEl(null);
    };

    const handleChangeClassSkill = (
        event: SelectChangeEvent<typeof classSkills>
    ) => {
        const {
            target: { value },
        } = event;
        setClassSkills(typeof value === 'string' ? value.split(',') : value);
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
                        <FormControl fullWidth>
                            <InputLabel id='class-label'>Class</InputLabel>
                            <Select
                                labelId='class-label'
                                id='class-select'
                                label='Class'
                                value={className}
                                onChange={(e) =>
                                    setClassName(
                                        e.target.value as CharacterClassNames
                                    )
                                }
                            >
                                {Object.keys(CharacterClassNames)
                                    .filter(
                                        (x) =>
                                            /* @ts-ignore */
                                            CharacterClassNames[x] !==
                                            CharacterClassNames.SorcWiz
                                    )
                                    .map((cls) => {
                                        return (
                                            <MenuItem key={cls} value={cls}>
                                                {cls}
                                            </MenuItem>
                                        );
                                    })}
                            </Select>
                        </FormControl>
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
                                id='primary-save-select'
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
                                        <MenuItem key={att} value={att}>
                                            {att}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl
                            fullWidth
                            sx={{ ...formControlStyling, marginTop: '.5rem' }}
                        >
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
                                        <MenuItem key={att} value={att}>
                                            {att}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                    <InputLabel id='class-skill-label'>Class Skills</InputLabel>
                    <Select
                        labelId='class-skill-label'
                        id='class-skills'
                        label='Class Skills'
                        multiple
                        value={classSkills}
                        onChange={handleChangeClassSkill}
                        renderValue={(selected) =>
                            selected
                                .map((skill) => {
                                    /* @ts-ignore */
                                    return SkillTypes[skill];
                                })
                                .join(', ')
                        }
                    >
                        {Object.keys(SkillTypes).map((skill) => {
                            return (
                                <MenuItem key={skill} value={skill}>
                                    <Checkbox
                                        checked={
                                            classSkills.indexOf(skill) > -1
                                        }
                                    />
                                    {/* @ts-ignore */}
                                    <ListItemText primary={SkillTypes[skill]} />
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
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
                            <Card sx={{padding: '0 0 0 .5rem'}}>
                                <Typography
                                    variant='caption'
                                    align='right'
                                >{`Level: ${abl.level}`}</Typography>
                                <Typography>{abl.name}</Typography>
                            </Card>
                        </Tooltip>
                    ) : (
                        <Card sx={{padding: '0 0 0.5rem'}}>
                            <Typography variant='caption' align='right'>
                                {abl.level}
                            </Typography>
                            <Typography>{abl.name}</Typography>
                        </Card>
                    );
                })}
            </CardContent>
            <CardActions sx={{ justifyContent: 'right' }}>
                <Button onClick={(e) => onClose(e, 'buttonClose')}>
                    <CancelRounded />
                </Button>
                <Button>
                    <CheckCircle onClick={() => handleSubmitClick()}/>
                </Button>
            </CardActions>
        </Card>
    );
};
