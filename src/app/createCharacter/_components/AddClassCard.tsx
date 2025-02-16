import {
    AttributeNames,
    CharacterClass,
    CharacterClassNames,
    ClassAbility,
    DivineDomain,
    SkillTypes,
} from '@/_models';
import { NumberInput } from '@/app/_components/NumberInput';
import { Add, CancelRounded, CheckCircle } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Checkbox,
    Chip,
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
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import * as R from 'ramda';

interface AddClassAbilityProps {
    addAbility: (ability: ClassAbility) => void;
    updateAbility: (priorAbility: ClassAbility, ability: ClassAbility) => void;
    handleClose: Dispatch<SetStateAction<boolean>>;
    className: CharacterClassNames;
    editAbility?: ClassAbility;
    handleDelete: (abl: ClassAbility) => void;
}

const textFieldStyling = { marginTop: '.5rem' };
const formControlStyling = { marginLeft: '.5rem' };

const AddClassAbility = ({
    handleClose,
    addAbility,
    className,
    editAbility,
    updateAbility,
    handleDelete,
}: AddClassAbilityProps) => {
    const [name, setName] = useState((editAbility && editAbility.name) || '');
    const [level, setLevel] = useState((editAbility && editAbility.level) || 1);
    const [description, setDescription] = useState(
        (editAbility && editAbility.description) || ''
    );
    return (
        <Card variant='outlined'>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    sx={textFieldStyling}
                    value={name}
                    label='Name'
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    sx={textFieldStyling}
                    value={level}
                    label='Level'
                    onChange={(e) => setLevel(Number(e.target.value))}
                />
                <TextField
                    sx={textFieldStyling}
                    value={description}
                    multiline
                    placeholder='Description (optional)...'
                    onChange={(e) => setDescription(e.target.value)}
                />
            </CardContent>
            <CardActions sx={{ justifyContent: 'right' }}>
                {!!editAbility && (
                    <Button
                        onClick={() => handleDelete(editAbility)}
                        color='error'
                    >
                        Delete
                    </Button>
                )}
                <Button onClick={(e) => handleClose(false)}>
                    <Tooltip title='Close'>
                        <CancelRounded />
                    </Tooltip>
                </Button>
                <Tooltip title='Submit'>
                    <Button
                        onClick={() =>
                            !!editAbility
                                ? updateAbility(editAbility, {
                                      name,
                                      level,
                                      description,
                                      className,
                                  })
                                : addAbility({
                                      name,
                                      level,
                                      description,
                                      className,
                                  })
                        }
                    >
                        <CheckCircle />
                    </Button>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

interface ClassAbilityCardProps {
    abl: ClassAbility;
}
const ClassAbilityCard = ({ abl }: ClassAbilityCardProps) => {
    const name = !!abl.allegianceValue ? `${abl.domain} Aspect` : abl.name;
    return (
        <Card sx={{ padding: '0 0 0 .5rem', margin: '0 0 .25rem 0' }}>
            <Typography
                variant='caption'
                align='right'
            >{`Level: ${abl.level}`}</Typography>
            <Typography>{name}</Typography>
        </Card>
    );
};
interface AddClassCardProps {
    onClose: (event: any, reason: any) => void;
    onSubmit: (cls: CharacterClass) => void;
    editClass?: CharacterClass;
}

export const AddClassCard = ({
    onClose,
    onSubmit,
    editClass,
}: AddClassCardProps) => {
    const [className, setClassName] = useState<CharacterClassNames>(
        CharacterClassNames.Barbarian
    );
    const [level, setLevel] = useState<number>(1);
    const [primarySave, setPrimarySave] = useState<AttributeNames>(
        AttributeNames.Strength
    );
    const [secondarySave, setSecondarySave] = useState<AttributeNames>(
        AttributeNames.Strength
    );
    const [BAB, setBAB] = useState<number>(0);
    const [classAbilities, setClassAbilities] = useState<ClassAbility[]>([]);
    const [classSkills, setClassSkills] = useState<string[]>([]);
    const [turnDomain, setTurnDomain] = useState<DivineDomain>(
        DivineDomain.Air
    );
    const [rebukeDomain, setRebukeDomain] = useState<DivineDomain>(
        DivineDomain.Air
    );
    const [sponDomain, setSponDomain] = useState<DivineDomain>(
        DivineDomain.Air
    );
    const [preferredDomains, setPreferredDomains] = useState<DivineDomain[]>(
        []
    );

    const [open, setOpen] = useState<boolean>(false);
    const [editClassAbility, setEditClassAbility] = useState<
        ClassAbility | undefined
    >(undefined);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(!open);
    };

    useEffect(() => {
        if (!!editClass) {
            const {
                name,
                level,
                primarySave,
                secondarySave,
                classAbilities,
                classSkills,
                BAB,
                turnDomain,
                rebukeDomain,
                spontaneousChannelDomain,
                preferredDomains,
            } = editClass;
            setClassName(name as CharacterClassNames);
            setLevel(level);
            setPrimarySave(primarySave);
            setSecondarySave(secondarySave);
            setClassAbilities(classAbilities);
            setClassSkills(classSkills);
            setBAB(BAB);
            !!turnDomain && setTurnDomain(turnDomain);
            !!rebukeDomain && setRebukeDomain(rebukeDomain);
            !!spontaneousChannelDomain &&
                setSponDomain(spontaneousChannelDomain);
            !!preferredDomains && setPreferredDomains(preferredDomains);
        }
    }, [editClass]);

    const handleSubmitClick = () => {
        const cls: CharacterClass = {
            name: className,
            level,
            BAB,
            primarySave,
            secondarySave,
            classAbilities,
            turnDomain:
                className === CharacterClassNames.Cleric
                    ? turnDomain
                    : undefined,
            rebukeDomain:
                className === CharacterClassNames.Cleric
                    ? rebukeDomain
                    : undefined,
            spontaneousChannelDomain:
                className === CharacterClassNames.Cleric
                    ? sponDomain
                    : undefined,
            classSkills: classSkills.map((x) => {
                return x as SkillTypes;
            }),
            preferredDomains:
                className === CharacterClassNames.Cleric
                    ? preferredDomains
                    : undefined,
        };
        onSubmit(cls);
        onClose({}, 'buttonClose');
    };

    const handleAddAbility = (ability: ClassAbility) => {
        setClassAbilities([...classAbilities, ability]);
        setOpen(false);
    };
    const handleUpdateAbility = (
        priorAbility: ClassAbility,
        ability: ClassAbility
    ) => {
        const updateIndex = R.findIndex(R.propEq(priorAbility.name, 'name'))(
            classAbilities
        );
        const updatedClassAbilities = R.update(
            updateIndex,
            ability,
            classAbilities
        );
        setClassAbilities(updatedClassAbilities);
        setEditClassAbility(undefined);
        setOpen(false);
    };
    const triggerAbilityUpdate = (abl: ClassAbility) => {
        setEditClassAbility(abl);
        setOpen(true);
    };
    const handleDeleteClassAbility = (abl: ClassAbility) => {
        const filter = (x: ClassAbility) =>
            x.name === abl.name && x.level === abl.level;
        const updatedClassAbilities = R.reject(filter, classAbilities);
        setClassAbilities(updatedClassAbilities);
        setOpen(false);
    };
    const handleChangeClassSkill = (
        event: SelectChangeEvent<typeof classSkills>
    ) => {
        const {
            target: { value },
        } = event;
        setClassSkills(typeof value === 'string' ? value.split(',') : value);
    };
    const handleDomainPrefChange = (event: any) => {
        const {
            target: { value },
        } = event;
        setPreferredDomains(value);
    };
    const addClassButtonRef = useRef(null);

    return (
        <Card variant='outlined' sx={{ overflow: 'scroll' }}>
            <CardHeader
                title={!!editClass ? 'Update Class' : 'Add New Class'}
            />
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
                        <NumberInput
                            value={level}
                            label='Level'
                            onChange={(e) => setLevel(Number(e.target.value))}
                        />
                        <NumberInput
                            value={BAB}
                            label='Base Attack Bonus'
                            onChange={(e) => setBAB(Number(e.target.value))}
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
                {className === CharacterClassNames.Cleric && (
                    <>
                        <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                            <InputLabel id='turn-label'>Turn Domain</InputLabel>
                            <Select
                                labelId='turn-label'
                                id='turn'
                                label='Turn Domain'
                                value={turnDomain}
                                onChange={(e) =>
                                    setTurnDomain(
                                        e.target.value as DivineDomain
                                    )
                                }
                            >
                                {Object.keys(DivineDomain).map((dom) => {
                                    return (
                                        <MenuItem key={dom} value={dom}>
                                            <ListItemText
                                                primary={
                                                    DivineDomain[
                                                        dom as DivineDomain
                                                    ]
                                                }
                                            />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                            <InputLabel id='rebuke-label'>
                                Rebuke Domain
                            </InputLabel>
                            <Select
                                labelId='rebuke-label'
                                id='rebuke'
                                label='Rebuke Domain'
                                value={rebukeDomain}
                                onChange={(e) =>
                                    setRebukeDomain(
                                        e.target.value as DivineDomain
                                    )
                                }
                            >
                                {Object.keys(DivineDomain).map((dom) => {
                                    return (
                                        <MenuItem key={dom} value={dom}>
                                            <ListItemText
                                                primary={
                                                    DivineDomain[
                                                        dom as DivineDomain
                                                    ]
                                                }
                                            />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                            <InputLabel id='spon-label'>
                                Spontaneous Casting Domain
                            </InputLabel>
                            <Select
                                labelId='spon-label'
                                id='spontCast'
                                label='Spontaneous Casting Domain'
                                value={sponDomain}
                                onChange={(e) =>
                                    setSponDomain(
                                        e.target.value as DivineDomain
                                    )
                                }
                            >
                                {Object.keys(DivineDomain).map((dom) => {
                                    return (
                                        <MenuItem key={dom} value={dom}>
                                            <ListItemText
                                                primary={
                                                    DivineDomain[
                                                        dom as DivineDomain
                                                    ]
                                                }
                                            />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                            <InputLabel id='spon-label'>
                                Select Domain Preference
                            </InputLabel>
                            <Select
                                labelId='spon-label'
                                id='preferredDomains'
                                label='Domain Preferences'
                                value={preferredDomains}
                                onChange={(e) => handleDomainPrefChange(e)}
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
                                multiple
                            >
                                {Object.keys(DivineDomain).map((dom) => {
                                    return (
                                        <MenuItem key={dom} value={dom}>
                                            <ListItemText
                                                primary={
                                                    DivineDomain[
                                                        dom as DivineDomain
                                                    ]
                                                }
                                            />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </>
                )}
                <Button
                    ref={addClassButtonRef}
                    sx={{ margin: '.5rem 0' }}
                    onClick={handleClick}
                >
                    <Typography>Add Class Ability</Typography>
                    <Add />
                </Button>
                <Popover
                    open={open}
                    onClose={() => setOpen(false)}
                    anchorEl={addClassButtonRef.current}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    <AddClassAbility
                        addAbility={handleAddAbility}
                        updateAbility={handleUpdateAbility}
                        editAbility={editClassAbility}
                        handleClose={setOpen}
                        className={className}
                        handleDelete={handleDeleteClassAbility}
                    />
                </Popover>
                {classAbilities
                    .sort((a, b) => a.level - b.level)
                    .map((abl: ClassAbility) => {
                        const name = !!abl.allegianceValue
                            ? `${abl.domain} Aspect`
                            : abl.name;
                        return !!abl.description ? (
                            <Tooltip title={abl.description} key={name}>
                                <div
                                    key={name}
                                    onClick={() => triggerAbilityUpdate(abl)}
                                >
                                    <ClassAbilityCard abl={abl} />
                                </div>
                            </Tooltip>
                        ) : (
                            <div
                                key={name}
                                onClick={() => triggerAbilityUpdate(abl)}
                            >
                                <ClassAbilityCard abl={abl} />
                            </div>
                        );
                    })}
            </CardContent>
            <CardActions sx={{ justifyContent: 'right' }}>
                <Button onClick={(e) => onClose(e, 'buttonClose')}>
                    <CancelRounded />
                </Button>
                <Button>
                    <CheckCircle onClick={() => handleSubmitClick()} />
                </Button>
            </CardActions>
        </Card>
    );
};
