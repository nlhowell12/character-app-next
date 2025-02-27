import {
    AttributeNames,
    CharacterClass,
    CharacterClassNames,
    ClassAbility,
    DivineDomain,
    SkillTypes,
} from '@/_models';
import { NumberInput } from '@/app/_components/NumberInput';
import { CancelRounded, CheckCircle } from '@mui/icons-material';
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
    Select,
    SelectChangeEvent,
    Tooltip,
    Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import * as R from 'ramda';
import useClassAbilityService from '@/app/api/_services/useClassAbilityService';

const formControlStyling = { marginLeft: '.5rem' };

interface ClassAbilityCardProps {
    abl: ClassAbility;
    handleSelection: (ability: ClassAbility, selection: string) => void;
    selectedOption: string;
}
const ClassAbilityCard = ({ abl, handleSelection }: ClassAbilityCardProps) => {
    const name = !!abl.allegianceValue ? `${abl.domain} Aspect` : abl.name;
    return (
        <Card sx={{ padding: '0 0 0 .5rem', margin: '0 0 .25rem 0' }}>
            <div style={{ display: 'flex', alignContent: 'center' }}>
                <div style={{ display: 'flex' }}>
                    <div>
                        <Typography
                            variant='caption'
                            align='right'
                        >{`Level: ${abl.level}`}</Typography>
                        <Typography>{name}</Typography>
                    </div>
                    {!!abl.choices?.length && !abl.selectedChoice ? (
                        <div
                            style={{
                                alignContent: 'center',
                                marginLeft: '2rem',
                                color: 'red',
                            }}
                        >
                            Selection is required!
                        </div>
                    ) : null}
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '2rem',
                    }}
                >
                    {abl.choices?.map((x) => {
                        return (
                            <Chip
                                variant={
                                    abl.selectedChoice === x
                                        ? undefined
                                        : 'outlined'
                                }
                                onClick={() => handleSelection(abl, x)}
                                label={x}
                            />
                        );
                    })}
                </div>
            </div>
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
    const { classAbilityResponse } = useClassAbilityService();

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

    useEffect(() => {
        /* @ts-ignore */
        const acquiredAbilities = classAbilityResponse[className].filter(
            (x: ClassAbility) => x.level <= level
        );
        !!acquiredAbilities.length && setClassAbilities(acquiredAbilities);
    }, [level]);
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
    };

    const handleChoiceSelection = (
        ability: ClassAbility,
        selection: string
    ) => {
        const updateIndex = R.findIndex(R.propEq(ability.name, 'name'))(
            classAbilities
        );
        const updatedAbility = {
            ...classAbilities[updateIndex],
            selectedChoice: selection,
        };
        const updatedClassAbilities = R.update(
            updateIndex,
            updatedAbility,
            classAbilities
        );
        setClassAbilities(updatedClassAbilities);
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
        console.log(value);
        if (value.length < 6) {
            setPreferredDomains(value);
        }
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
                {classAbilities
                    .sort((a, b) => a.level - b.level)
                    .map((abl: ClassAbility) => {
                        const name = !!abl.allegianceValue
                            ? `${abl.domain} Aspect`
                            : abl.name;
                        return (
                            <Tooltip title={abl.description} key={name}>
                                <div key={name}>
                                    <ClassAbilityCard
                                        abl={abl}
                                        handleSelection={handleChoiceSelection}
                                        selectedOption={''}
                                    />
                                </div>
                            </Tooltip>
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
