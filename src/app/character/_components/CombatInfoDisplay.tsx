import {
    AnyMagickType,
    Character,
    CharacterClass,
    CharacterClassNames,
    CharacterKeys,
    immobilzedStatusEffects,
    SpellCastingClasses,
} from '@/_models';
import {
    BonusObject,
    getTotalDefense,
    getDefenseBonuses,
    getResistances,
    getAdjustedMaxDexMod,
    drBonusTypes,
} from '@/_utils/defenseUtils';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Button,
    Dialog,
    Grid,
    Alert,
    Box,
    Tab,
    Tabs,
    TableHead,
    Card,
} from '@mui/material';
import { Dispatch, useState } from 'react';
import { DisplayCell } from './DisplayCell';
import {
    CharacterAction,
    learnSpellAction,
    martialQueueAction,
    prepareSpellAction,
    updateAction,
} from '@/_reducer/characterReducer';
import MenuBook from '@mui/icons-material/MenuBook';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { SpellTable } from '@/app/_components/SpellTable';
import useSpellService from '@/app/api/_services/useSpellService';
import SpellbookTabsContainer, {
    CustomTabPanel,
} from '@/app/_components/SpellbookTabsContainer';
import {
    filterSpellObjectByCharacter,
    isCharacterPsionic,
} from '@/_utils/spellUtils';
import { SpeedDialog } from './SpeedDialog';
import {
    checkForHalfMovement,
    getAlignedOrisons,
    getInitiativeScore,
    getTotalClassLevels,
    hasMartialClass,
} from '@/_utils/classUtils';
import { getTotalEnergyDrained } from '@/_utils/statusEffectUtils';
import { DomainAspectsTable } from '@/app/_components/DomainAspectsTable';

import useClassAbilityService from '@/app/api/_services/useClassAbilityService';

interface CombatInfoDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

interface AcTooltipProps {
    acBonuses: BonusObject;
    character: Character;
}

const tooltipCellStyling = {
    border: 'none',
};
const AcTooltip = ({ acBonuses, character }: AcTooltipProps) => {
    const drBonuses = Object.entries(acBonuses).filter(([key, _]) => {
        return drBonusTypes.some((x) => x === key);
    });
    const dsBonuses = Object.entries(acBonuses).filter(([key, _]) => {
        return !drBonusTypes.some((x) => x === key);
    });
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell sx={tooltipCellStyling}>
                        <Typography>{`Dexterity: ${getAdjustedMaxDexMod(
                            character
                        )}`}</Typography>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>Defense Score</TableCell>
                </TableRow>
                {dsBonuses.map(([key, value]) => {
                    return (
                        <TableRow key={`${key} + ${value}`}>
                            <TableCell sx={tooltipCellStyling}>
                                <Typography>{`${key} ${value}`}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
                <TableRow>
                    <TableCell>Damage Reduction</TableCell>
                </TableRow>
                {drBonuses.map(([key, value]) => {
                    return (
                        <TableRow key={`${key} + ${value}`}>
                            <TableCell sx={tooltipCellStyling}>
                                <Typography>{`${key} ${value}`}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

interface ResistImmuneTooltipProps {
    character: Character;
}
const ResistImmuneTooltip = ({ character }: ResistImmuneTooltipProps) => {
    const resistances = getResistances(character);
    return !!Object.keys(resistances).length ? (
        <Table>
            <TableBody>
                {Object.entries(getResistances(character)).map(
                    ([key, value]) => (
                        <TableRow key={`${key} + ${value}`}>
                            <TableCell sx={tooltipCellStyling}>
                                <Typography>{`${key} ${value}`}</Typography>
                            </TableCell>
                        </TableRow>
                    )
                )}
            </TableBody>
        </Table>
    ) : undefined;
};
const cellStylingObject = {
    borderBottom: 'none',
    height: 'fit-content',
    margin: '.25rem 0 .5rem .5rem',
};

export const CombatInfoDisplay = ({
    character,
    dispatch,
}: CombatInfoDisplayProps) => {
    const defenses = getTotalDefense(character);
    const [openSpellbook, setOpenSpellbook] = useState<boolean>(false);
    const [openSpeed, setOpenSpeed] = useState(false);
    const [openDomainAspect, setOpenDomainAspect] = useState(false);
    const [domainTabValue, setDomainTabValue] = useState<number>(0);

    const { spells, spellTables } = useSpellService();
    const { classAbilityResponse } = useClassAbilityService();

    const handleSpellBookOpen = () => {
        setOpenSpellbook(true);
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setDomainTabValue(newValue);
    };

    const handleDomainAspectOpen = () => {
        setOpenDomainAspect(true);
    };

    const handleLearnSpell = (
        spell: AnyMagickType,
        className: CharacterClassNames
    ) => {
        dispatch(learnSpellAction(spell, className));
    };

    const handlePrepareSpell = (
        spell: AnyMagickType,
        className: CharacterClassNames,
        martial?: boolean
    ) => {
        if (martial) {
            dispatch(martialQueueAction(spell, className));
        } else {
            dispatch(prepareSpellAction(spell, className));
        }
    };

    const hasSpellCastingClass = () => {
        return character.classes.some((r) =>
            Object.values(SpellCastingClasses).includes(
                r.name as CharacterClassNames
            )
        );
    };
    const adjustedMovement = checkForHalfMovement(character);

    const cannotMove = character.statusEffects.some((x) =>
        immobilzedStatusEffects.includes(x)
    );
    const clericClass: CharacterClass | undefined = character.classes.find(
        (x) => x.name === CharacterClassNames.Cleric
    );

    const adjustedMaxPowerPoints = () => {
        const psionClass = character.classes.find(
            (x) => x.name === CharacterClassNames.Psion
        );
        const psyWarClass = character.classes.find(
            (x) => x.name === CharacterClassNames.PsychicWarrior
        );
        const psionPP =
            !!psionClass && !!spellTables
                ? /* @ts-ignore */
                  spellTables?.Psion.find((x) => x.level === psionClass.level)
                      .perDay
                : 0;
        const psyWarPP =
            !!psyWarClass && !!spellTables
                ? /* @ts-ignore */
                  spellTables?.['Psychic Warrior'].find(
                      (x) => x.level === psyWarClass.level
                  ).perDay
                : 0;

        const innatePP = !!character.isPsionic
            ? 3 + Math.floor((getTotalClassLevels(character) / 4) * 3)
            : 0;
        /* @ts-ignore */
        return character.maxPowerPoints + psionPP + psyWarPP + innatePP;
    };
    return (
        <>
            <DisplayCell
                variant='body1'
                cellTitle='Max Hit Points:'
                value={
                    Number(character.maxHitPoints) -
                    getTotalEnergyDrained(character) * 5
                }
            />
            <DisplayCell
                variant='body1'
                cellTitle='Current Hit Points:'
                value={character.currentHitPoints}
                editable
                isNumber
                tooltip={<ResistImmuneTooltip character={character} />}
                onChange={(e) =>
                    dispatch(
                        updateAction(
                            CharacterKeys.currentHitPoints,
                            Number(e.target.value)
                        )
                    )
                }
            />
            <DisplayCell
                variant='body1'
                cellTitle='Non-Lethal Damage:'
                value={character.nonLethalDamage}
                editable
                isNumber
                onChange={(e) =>
                    dispatch(
                        updateAction(
                            CharacterKeys.nonLethalDamage,
                            Number(e.target.value)
                        )
                    )
                }
            />
            <DisplayCell
                variant='body1'
                cellTitle='Temp HP:'
                value={character.tempHP}
                editable
                isNumber
                onChange={(e) =>
                    dispatch(
                        updateAction(
                            CharacterKeys.tempHP,
                            Number(e.target.value)
                        )
                    )
                }
            />
            <DisplayCell
                variant='body1'
                cellTitle='DS (DR):'
                value={`${defenses.dsBonus} (${defenses.drBonus})`}
                tooltip={
                    <AcTooltip
                        acBonuses={getDefenseBonuses(character)}
                        character={character}
                    />
                }
            />
            {!cannotMove ? (
                <DisplayCell
                    variant='body1'
                    cellTitle='Speed:'
                    value={adjustedMovement.map(
                        (spd) => ` ${spd.type}(${spd.speed}ft)`
                    )}
                    onClick={() => setOpenSpeed(true)}
                    editable
                />
            ) : (
                <Grid item xs={4}>
                    <Alert severity='error'>
                        You are prevented from moving!
                    </Alert>
                </Grid>
            )}

            <SpeedDialog
                dispatch={dispatch}
                character={character}
                open={openSpeed}
                onClose={() => setOpenSpeed(false)}
            />
            <DisplayCell
                variant='body1'
                cellTitle='Hero Points:'
                value={character.heroPoints}
                editable={true}
                isNumber
                onChange={(e) =>
                    dispatch(
                        updateAction(
                            CharacterKeys.heroPoints,
                            Number(e.target.value)
                        )
                    )
                }
            />
            {isCharacterPsionic(character) && (
                <DisplayCell
                    variant='body1'
                    cellTitle={`Power Points (max ${adjustedMaxPowerPoints()}):`}
                    value={character.powerPoints}
                    editable={true}
                    isNumber
                    onChange={(e) =>
                        dispatch(
                            updateAction(
                                CharacterKeys.powerPoints,
                                Number(e.target.value)
                            )
                        )
                    }
                />
            )}
            <DisplayCell
                variant='body1'
                cellTitle='Initiative:'
                value={getInitiativeScore(character)}
            />

            {!!character.spellBook &&
                !!spells &&
                !!spellTables &&
                hasSpellCastingClass() && (
                    <Grid item xs={4} sx={cellStylingObject}>
                        <Button
                            sx={{ padding: '0 .5rem' }}
                            variant='outlined'
                            onClick={handleSpellBookOpen}
                        >
                            <Typography>Spell Book</Typography>
                            <MenuBook sx={{ marginLeft: '.5rem' }} />
                        </Button>
                        <Dialog
                            open={openSpellbook}
                            onClose={() => setOpenSpellbook(false)}
                            fullWidth
                            maxWidth='lg'
                            keepMounted
                        >
                            <SpellbookTabsContainer>
                                <SpellTable
                                    spells={filterSpellObjectByCharacter(
                                        character,
                                        spells
                                    )}
                                    characterSpellbook
                                    character={character}
                                    onChange={handleLearnSpell}
                                    spellTables={spellTables}
                                />
                                <SpellTable
                                    spells={filterSpellObjectByCharacter(
                                        character,
                                        character.spellBook
                                    )}
                                    characterSpellbook
                                    personal
                                    character={character}
                                    onChange={handlePrepareSpell}
                                    spellTables={spellTables}
                                />
                                {hasMartialClass(character) && (
                                    <SpellTable
                                        spells={filterSpellObjectByCharacter(
                                            character,
                                            character.martialQueue,
                                            true
                                        )}
                                        characterSpellbook
                                        personal
                                        character={character}
                                        onChange={handlePrepareSpell}
                                        spellTables={spellTables}
                                    />
                                )}
                            </SpellbookTabsContainer>
                        </Dialog>
                    </Grid>
                )}
            {!!clericClass && (
                <Grid item xs={4} sx={cellStylingObject}>
                    <Button
                        sx={{ padding: '0 .5rem' }}
                        variant='outlined'
                        onClick={handleDomainAspectOpen}
                    >
                        <Typography>Domain Aspects</Typography>
                        <AutoAwesomeIcon sx={{ marginLeft: '.5rem' }} />
                    </Button>
                    <Dialog
                        open={openDomainAspect}
                        onClose={() => setOpenDomainAspect(false)}
                        fullWidth
                        maxWidth='lg'
                        keepMounted
                    >
                        <Box sx={{ width: '100%' }}>
                            <Box
                                sx={{ borderBottom: 1, borderColor: 'divider' }}
                            >
                                <Tabs
                                    value={domainTabValue}
                                    onChange={handleTabChange}
                                >
                                    <Tab label='Domain Aspects' />
                                    <Tab label='Orisons' />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={domainTabValue} index={0}>
                                <DomainAspectsTable
                                    character={character}
                                    dispatch={dispatch}
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={domainTabValue} index={1}>
                                <Card>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Domain</TableCell>
                                                <TableCell>
                                                    Description
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        {!!classAbilityResponse && (
                                            <TableBody>
                                                {getAlignedOrisons(
                                                    character,
                                                    classAbilityResponse.Cleric
                                                        .orisons
                                                ).map((ori) => {
                                                    return (
                                                        <TableRow
                                                            key={ori.domain}
                                                        >
                                                            <TableCell>
                                                                {ori.domain}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Typography whiteSpace='pre-line'>
                                                                    {
                                                                        ori.description
                                                                    }
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        )}
                                    </Table>
                                </Card>
                            </CustomTabPanel>
                        </Box>
                    </Dialog>
                </Grid>
            )}
        </>
    );
};
