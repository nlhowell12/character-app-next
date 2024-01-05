import {
    AnyMagickType,
    AttributeNames,
    Character,
    CharacterClassNames,
    CharacterKeys,
    SpellCastingClasses,
} from '@/_models';
import { getTotalAttributeModifier } from '@/_utils/attributeUtils';
import {
    BonusObject,
    getTotalDefense,
    getDefenseBonuses,
    getResistances,
} from '@/_utils/defenseUtils';
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Button,
    Dialog,
} from '@mui/material';
import { Dispatch, useState } from 'react';
import { DisplayCell } from './DisplayCell';
import {
    CharacterAction,
    learnSpellAction,
    prepareSpellAction,
    updateAction,
} from '@/_reducer/characterReducer';
import MenuBook from '@mui/icons-material/MenuBook';
import { SpellTable } from '@/app/_components/SpellTable';
import useSpellService from '@/app/api/_services/useSpellService';
import SpellbookTabsContainer from '@/app/_components/SpellbookTabsContainer';
import { filterSpellObjectByCharacter, isCharacterPsionic } from '@/_utils/spellUtils';
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
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell sx={tooltipCellStyling}>
                        <Typography>{`Dexterity: ${getTotalAttributeModifier(
                            character,
                            AttributeNames.Dexterity
                        )}`}</Typography>
                    </TableCell>
                </TableRow>
                {Object.entries(acBonuses).map(([key, value]) => {
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
    padding: '0 .5rem .5rem 0',
};

export const CombatInfoDisplay = ({
    character,
    dispatch,
}: CombatInfoDisplayProps) => {
    const defenses = getTotalDefense(character);
    const [openSpellbook, setOpenSpellbook] = useState<boolean>(false);
    const { spells } = useSpellService();
    const handleSpellBookOpen = () => {
        setOpenSpellbook(true);
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
    ) => {
        dispatch(prepareSpellAction(spell, className));
    };
    const hasSpellCastingClass = () => {
        return character.classes.some((r) =>
            Object.values(SpellCastingClasses).includes(r.name as CharacterClassNames)
        );
    };
    return (
        <div>
            <Table>
                <TableBody>
                    <TableRow sx={{ border: 'none' }}>
                        <DisplayCell
                            variant='body1'
                            cellTitle='Max Hit Points:'
                            value={character.maxHitPoints}
                        />
                        <DisplayCell
                            variant='body1'
                            cellTitle='Current Hit Points:'
                            value={character.currentHitPoints}
                            editable={true}
                            isNumber
                            tooltip={
                                <ResistImmuneTooltip character={character} />
                            }
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
                            editable={true}
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
                            editable={true}
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
                    </TableRow>
                    <TableRow sx={{ border: 'none' }}>
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
                        <DisplayCell
                            variant='body1'
                            cellTitle='Speed:'
                            value={character.movementSpeeds.map(
                                (spd) => ` ${spd.type}(${spd.speed}ft)`
                            )}
                        />
                        {!!character.maxPowerPoints && isCharacterPsionic(character) && (
                            <DisplayCell
                                variant='body1'
                                cellTitle='Power Points:'
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
                        {!!character.spellBook &&
                            !!spells &&
                            hasSpellCastingClass() && (
                                <TableCell sx={cellStylingObject}>
                                    <Button
                                        sx={{ padding: '0 .5rem' }}
                                        variant='outlined'
                                        onClick={handleSpellBookOpen}
                                    >
                                        <Typography>Spell Book</Typography>
                                        <MenuBook
                                            sx={{ marginLeft: '.5rem' }}
                                        />
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
                                            />
                                        </SpellbookTabsContainer>
                                    </Dialog>
                                </TableCell>
                            )}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
