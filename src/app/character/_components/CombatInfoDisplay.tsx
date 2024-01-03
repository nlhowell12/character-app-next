import { AnyMagickType, AttributeNames, Character, CharacterClassNames, CharacterKeys } from '@/_models';
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
import { CharacterAction, learnSpellAction, updateAction } from '@/_reducer/characterReducer';
import MenuBook from '@mui/icons-material/MenuBook';
import { SpellTable } from '@/app/_components/SpellTable';
import useSpellService from '@/app/api/_services/useSpellService';
import SpellbookTabsContainer from '@/app/_components/SpellbookTabsContainer';
import { filterSpellObjectByCharacter } from '@/_utils/spellUtils';

interface CombatInfoDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

interface AcTooltipProps {
    acBonuses: BonusObject;
    character: Character;
}

const AcTooltip = ({ acBonuses, character }: AcTooltipProps) => {
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <TableCell>
                        <Typography>{`Dexterity: ${getTotalAttributeModifier(
                            character,
                            AttributeNames.Dexterity
                        )}`}</Typography>
                    </TableCell>
                </TableRow>
                {Object.entries(acBonuses).map(([key, value]) => {
                    return (
                        <TableRow key={`${key} + ${value}`}>
                            <TableCell>
                                <Typography>{`${key} ${value}`}</Typography>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
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
    const {spells} = useSpellService()
    const handleSpellBookOpen = () => {
        setOpenSpellbook(true);
    };
    const handleLearnSpell = (spell: AnyMagickType, className: CharacterClassNames) => {
        dispatch(learnSpellAction(spell, className))
    }
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
                        <DisplayCell
                            variant='body1'
                            cellTitle='Resist/Immune:'
                            value={Object.entries(
                                getResistances(character)
                            ).map(([key, value]) => `${key} - ${value}`)}
                        />
                        {!!character.spellBook && !!spells &&
						<TableCell sx={cellStylingObject}>
                            <Button
							sx={{padding: '0 .5rem'}}
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
                                    <SpellTable spells={filterSpellObjectByCharacter(character, spells)} characterSpellbook character={character} onChange={handleLearnSpell}/>
                                    <SpellTable spells={filterSpellObjectByCharacter(character, character.spellBook)} characterSpellbook personal character={character}/>
                                </SpellbookTabsContainer>
                            </Dialog>
                        </TableCell>}
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
