import {
    ArcaneSchool,
    AttributeNames,
    BarbarianPath,
    BardicTraditions,
    CharacterClass,
    CharacterClassNames,
    ClassAbility,
    DivineDomain,
    GuildPaths,
    MonkTraditions,
    Oaths,
    PathOptions,
    PsionicDiscipline,
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
import { useEffect, useState } from 'react';
import * as R from 'ramda';
import useClassAbilityService from '@/app/api/_services/useClassAbilityService';
import {
    getAbilityDescription,
    getClassAbilityChoices,
    removeLowerClassAbilites,
    removeSelectedChoices,
} from '@/_utils/classUtils';

const formControlStyling = { marginLeft: '.5rem' };

interface SelectionWidgetProps {
    handleSelection: (ability: ClassAbility, selection: string) => void;
    abl: ClassAbility;
    choices?: ClassAbility[];
    value: string;
    classAbilities: ClassAbility[];
}

const ChoiceSelectionWidget = ({
    handleSelection,
    abl,
    choices,
    value,
    classAbilities,
}: SelectionWidgetProps) => {
    if (!!choices && choices.length) {
        if (choices[0].className === CharacterClassNames.Bard) {
            return (
                <Select
                    sx={{ marginLeft: '2rem' }}
                    onChange={(e) => handleSelection(abl, e.target.value)}
                    value={value}
                >
                    {removeSelectedChoices(abl, classAbilities, choices).map(
                        (music) => {
                            return (
                                <MenuItem
                                    key={music.name + music.level}
                                    value={music.name}
                                >
                                    {music.name}
                                </MenuItem>
                            );
                        }
                    )}
                </Select>
            );
        }
        if (choices[0].isQiFocus) {
            return (
                <Select
                    sx={{ marginLeft: '2rem' }}
                    onChange={(e) => handleSelection(abl, e.target.value)}
                    value={value}
                >
                    {removeSelectedChoices(abl, classAbilities, choices).map(
                        (choice) => {
                            return (
                                <MenuItem
                                    key={choice.description}
                                    value={choice.description}
                                >
                                    {choice.description}
                                </MenuItem>
                            );
                        }
                    )}
                </Select>
            );
        }
    }
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: '2rem',
                flexWrap: 'wrap',
            }}
        >
            {abl.choices?.map((x) => {
                return (
                    <Chip
                        key={x}
                        variant={value === x ? undefined : 'outlined'}
                        onClick={() => handleSelection(abl, x)}
                        label={x}
                    />
                );
            })}
        </div>
    );
};

interface ClassAbilityCardProps {
    abl: ClassAbility;
    handleSelection: (ability: ClassAbility, selection: string) => void;
    choices?: ClassAbility[];
    value: string;
    classAbilities: ClassAbility[];
}
const ClassAbilityCard = ({
    abl,
    handleSelection,
    value,
    choices,
    classAbilities,
}: ClassAbilityCardProps) => {
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
                <ChoiceSelectionWidget
                    abl={abl}
                    handleSelection={handleSelection}
                    choices={choices}
                    value={value}
                    classAbilities={classAbilities}
                />
            </div>
        </Card>
    );
};

const getPathOptions = (className: CharacterClassNames) => {
    switch (className) {
        case CharacterClassNames.Barbarian:
            return Object.values(BarbarianPath);
        case CharacterClassNames.Bard:
            return Object.values(BardicTraditions);
        case CharacterClassNames.Monk:
            return Object.values(MonkTraditions);
        case CharacterClassNames.Oathsworn:
            return Object.values(Oaths);
        case CharacterClassNames.Rogue:
            return Object.values(GuildPaths);
        default:
            return [];
    }
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
    const [impCounter, setImpCounter] = useState<DivineDomain>(
        DivineDomain.Air
    );
    const [chosenSchool, setChosenSchool] = useState<ArcaneSchool | 'General'>(
        'General'
    );
    const [chosenDiscipline, setChosenDiscipline] = useState<PsionicDiscipline>(
        PsionicDiscipline.Clairsentience
    );

    /* @ts-ignore */
    const [chosenPath, setPath] = useState<PathOptions | ''>('');
    const [secondPath, setSecondPath] = useState<GuildPaths | undefined>(
        undefined
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
                path,
                secondGuildPath,
                impCounter,
                school,
                discipline,
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
            !!impCounter && setImpCounter(impCounter);
            setPath(path || '');
            !!secondGuildPath && setSecondPath(secondPath);
            !!school && setChosenSchool(school);
            !!discipline && setChosenDiscipline(discipline);
        }
    }, [editClass]);
    const getAbilities = () => {
        switch (className) {
            case CharacterClassNames.Bard:
                return classAbilityResponse[
                    CharacterClassNames.Bard
                ].abilities.filter((x: ClassAbility) => x.level <= level);
            case CharacterClassNames.Cleric:
                const clericAbilities =
                    classAbilityResponse[CharacterClassNames.Cleric].abilities;
                const sponCasting = clericAbilities.filter(
                    (x) =>
                        x.name === 'Spontaneous Channeling' &&
                        x.domain === sponDomain
                );
                const turn = clericAbilities.filter(
                    (x) => x.name === 'Turn' && x.domain === turnDomain
                );
                const rebuke = clericAbilities.filter(
                    (x) => x.name === 'Rebuke' && x.domain === rebukeDomain
                );
                const impCounterFeat = clericAbilities.filter(
                    (x) =>
                        x.name === 'Improved Counterchannel' &&
                        x.domain === impCounter
                );
                const counterMagick =
                    level >= 5
                        ? [
                              clericAbilities.find(
                                  (x) => x.name === 'Countermagick'
                              ),
                          ]
                        : [];
                return [
                    ...impCounterFeat,
                    ...sponCasting,
                    ...turn,
                    ...rebuke,
                    ...counterMagick,
                ];
            default:
                /* @ts-ignore */
                return classAbilityResponse[className].filter(
                    (x: ClassAbility) => x.level <= level
                );
        }
    };

    const updateAbilities = () => {
        const acquiredAbilities = getAbilities();
        let updatedList: ClassAbility[] = [
            ...classAbilities.filter((x) => x.className === className),
        ];
        acquiredAbilities
            .filter((x: ClassAbility) => !x.path || x.path === chosenPath)
            .filter(
                (x: ClassAbility) =>
                    (!x.school && !x.name.includes('General')) ||
                    x.school === chosenSchool ||
                    (chosenSchool === 'General' && !x.school)
            )
            .filter(
                (x: ClassAbility) =>
                    !x.discipline || x.discipline === chosenDiscipline
            )
            .forEach((abl: ClassAbility) => {
                const abilityIndex = R.findIndex(
                    (x: ClassAbility) =>
                        x.name === abl.name && x.level === abl.level
                )(updatedList);
                if (!updatedList.length) {
                    updatedList.push(abl);
                } else if (level >= updatedList[updatedList.length - 1].level) {
                    if (abilityIndex === -1) {
                        updatedList.push(abl);
                    }
                } else {
                    updatedList = R.reject(
                        (x: ClassAbility) => x.level > level,
                        updatedList
                    );
                }
            });
        if (
            (level < 5 && className === CharacterClassNames.Bard) ||
            (level < 3 && className === CharacterClassNames.Rogue)
        ) {
            !!editClass?.path && setPath('');
        }
        !!updatedList.length &&
            setClassAbilities(removeLowerClassAbilites(updatedList));
    };

    useEffect(() => {
        if (
            className === CharacterClassNames.Barbarian &&
            !!classAbilityResponse.Barbarian.length
        ) {
            setClassAbilities(
                classAbilityResponse.Barbarian.filter((x) => x.level <= level)
            );
        }
    }, [classAbilityResponse.Barbarian.length]);

    useEffect(() => {
        setPath('');
    }, [className]);
    useEffect(() => {
        updateAbilities();
    }, [
        level,
        chosenPath,
        secondPath,
        sponDomain,
        turnDomain,
        rebukeDomain,
        impCounter,
        className,
        chosenDiscipline,
        chosenSchool,
    ]);

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
            impCounter:
                className === CharacterClassNames.Cleric
                    ? impCounter
                    : undefined,
            path: !!chosenPath ? chosenPath : undefined,
        };
        onSubmit(cls);
        onClose({}, 'buttonClose');
    };

    const handleChoiceSelection = (
        ability: ClassAbility,
        selection: string
    ) => {
        const updateIndex = classAbilities.findIndex(
            (x) => x.name === ability.name && x.level === ability.level
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
    const handleSecondChoiceSelection = (
        ability: ClassAbility,
        selection: string
    ) => {
        const updateIndex = classAbilities.findIndex(
            (x) => x.name === ability.name && x.level === ability.level
        );
        const updatedAbility = {
            ...classAbilities[updateIndex],
            secondSelectedChoice: selection,
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
        if (value.length < 6) {
            setPreferredDomains(value);
        }
    };
    const shouldShowPathSelection =
        (className === CharacterClassNames.Bard && level >= 5) ||
        (className === CharacterClassNames.Rogue && level >= 3) ||
        className === CharacterClassNames.Barbarian ||
        className === CharacterClassNames.Oathsworn ||
        className === CharacterClassNames.Monk;
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
                                {Object.values(CharacterClassNames)
                                    .filter(
                                        (x) =>
                                            /* @ts-ignore */
                                            x !== CharacterClassNames.SorcWiz
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
                            minZero
                        />
                        <NumberInput
                            value={BAB}
                            label='Base Attack Bonus'
                            onChange={(e) => setBAB(Number(e.target.value))}
                            minZero
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
                            <InputLabel id='turn-label'>
                                Improved Counterchannel
                            </InputLabel>
                            <Select
                                labelId='imp-counter-label'
                                id='impCounter'
                                label='Improved Counterchannel'
                                value={impCounter}
                                onChange={(e) =>
                                    setImpCounter(
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
                {shouldShowPathSelection && (
                    <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                        <InputLabel id='spon-label'>
                            Class Path Selection
                        </InputLabel>
                        <Select
                            labelId='spon-label'
                            id='classPathSelect'
                            label='Class Path Selection'
                            value={chosenPath}
                            onChange={(e) =>
                                setPath(e.target.value as PathOptions)
                            }
                        >
                            {getPathOptions(className).map((path) => {
                                return (
                                    <MenuItem key={path} value={path}>
                                        <ListItemText primary={path} />
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                )}
                {className === CharacterClassNames.Rogue && level >= 10 && (
                    <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                        <InputLabel id='spon-label'>
                            Second Guild Path Selection
                        </InputLabel>
                        <Select
                            labelId='spon-label'
                            id='secondPathSelect'
                            label='Second Guild Path Selection'
                            value={secondPath}
                            onChange={(e) =>
                                setSecondPath(e.target.value as GuildPaths)
                            }
                        >
                            {Object.values(GuildPaths).map((path) => {
                                return (
                                    <MenuItem key={path} value={path}>
                                        <ListItemText primary={path} />
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                )}
                {className === CharacterClassNames.Wizard && (
                    <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                        <InputLabel id='spon-label'>Specialization</InputLabel>
                        <Select
                            labelId='specialization-label'
                            id='SpecializationSelect'
                            label='Specialization'
                            value={chosenSchool}
                            onChange={(e) =>
                                setChosenSchool(e.target.value as ArcaneSchool)
                            }
                        >
                            <MenuItem value={'General'}>General</MenuItem>
                            {Object.values(ArcaneSchool).map((school) => {
                                return (
                                    <MenuItem key={school} value={school}>
                                        <ListItemText primary={school} />
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                )}
                {(className === CharacterClassNames.Psion ||
                    className === CharacterClassNames.PsychicWarrior) && (
                    <FormControl fullWidth sx={{ marginTop: '.5rem' }}>
                        <InputLabel id='spon-label'>Discipline</InputLabel>
                        <Select
                            labelId='specialization-label'
                            id='SpecializationSelect'
                            label='Discipline'
                            value={chosenDiscipline}
                            onChange={(e) =>
                                setChosenDiscipline(
                                    e.target.value as PsionicDiscipline
                                )
                            }
                        >
                            {Object.values(PsionicDiscipline).map((disc) => {
                                return (
                                    <MenuItem key={disc} value={disc}>
                                        <ListItemText primary={disc} />
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                )}
                {classAbilities
                    .sort((a, b) => a.level - b.level)
                    .filter((x) => !x.path || x.path === chosenPath)
                    .map((abl: ClassAbility) => {
                        const name = !!abl.allegianceValue
                            ? `${abl.domain} Aspect`
                            : abl.name;
                        if (
                            !!chosenPath &&
                            abl.name === 'Avowal' &&
                            !!classAbilityResponse.Oathsworn.length
                        ) {
                            abl.choices = classAbilityResponse.Oathsworn.filter(
                                (x) =>
                                    x.isAvowalChoices && x.path === chosenPath
                            )[0].choices;
                        }
                        return (
                            <>
                                <Tooltip
                                    title={getAbilityDescription(
                                        abl,
                                        classAbilityResponse
                                    )}
                                    key={name + abl.level}
                                    followCursor
                                >
                                    <div key={name + abl.level + abl.level}>
                                        <ClassAbilityCard
                                            abl={abl}
                                            value={
                                                !!abl.selectedChoice
                                                    ? abl.selectedChoice
                                                    : ''
                                            }
                                            handleSelection={
                                                handleChoiceSelection
                                            }
                                            choices={getClassAbilityChoices(
                                                className,
                                                classAbilityResponse,
                                                abl,
                                                !!chosenPath
                                                    ? chosenPath
                                                    : undefined
                                            )}
                                            classAbilities={classAbilities}
                                        />
                                    </div>
                                </Tooltip>
                                {abl.name === 'Favored Enemy' &&
                                    abl.level > 1 && (
                                        <Tooltip
                                            title={getAbilityDescription(
                                                abl,
                                                classAbilityResponse
                                            )}
                                            key={name + abl.level + 2}
                                            followCursor
                                        >
                                            <div
                                                key={
                                                    name +
                                                    abl.level +
                                                    abl.level +
                                                    2
                                                }
                                            >
                                                <ClassAbilityCard
                                                    abl={abl}
                                                    value={
                                                        !!abl.secondSelectedChoice
                                                            ? abl.secondSelectedChoice
                                                            : ''
                                                    }
                                                    handleSelection={
                                                        handleSecondChoiceSelection
                                                    }
                                                    choices={getClassAbilityChoices(
                                                        className,
                                                        classAbilityResponse,
                                                        abl,
                                                        !!chosenPath
                                                            ? chosenPath
                                                            : undefined
                                                    )}
                                                    classAbilities={
                                                        classAbilities
                                                    }
                                                />
                                            </div>
                                        </Tooltip>
                                    )}
                            </>
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
