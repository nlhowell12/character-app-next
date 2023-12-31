import { AttributeNames, Character, CharacterKeys } from '@/_models';
import { getTotalAttributeModifier } from '@/_utils/attributeUtils';
import { BonusObject, getTotalDefense, getDefenseBonuses, getResistances } from '@/_utils/defenseUtils';
import { Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { Dispatch } from 'react';
import { DisplayCell } from './DisplayCell';
import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
interface CombatInfoDisplayProps {
	character: Character;
	dispatch: Dispatch<CharacterAction>;
}

interface AcTooltipProps {
	acBonuses: BonusObject;
	character: Character;
};

const AcTooltip = ({
	acBonuses,
	character,
} : AcTooltipProps) => {
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

export const CombatInfoDisplay = ({
	character,
	dispatch
} : CombatInfoDisplayProps) => {
	const defenses = getTotalDefense(character);

	return (
		<div>
			<Table>
				<TableBody>
					<TableRow
						sx={{border: 'none'}}
					>
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
							onChange={(e) => dispatch(updateAction(CharacterKeys.currentHitPoints, Number(e.target.value)))}
						/>
						<DisplayCell
							variant='body1'
							cellTitle='Non-Lethal Damage:'
							value={character.nonLethalDamage}
							editable={true}
							isNumber
							onChange={(e) => dispatch(updateAction(CharacterKeys.nonLethalDamage, Number(e.target.value)))}
						/>
						<DisplayCell
							variant='body1'
							cellTitle='Temp HP:'
							value={character.tempHP}
							editable={true}
							isNumber
							onChange={(e) => dispatch(updateAction(CharacterKeys.tempHP, Number(e.target.value)))}
						/>
					</TableRow>
					<TableRow
						sx={{border: 'none'}}
					>
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
							value={Object.entries(getResistances(character)).map(
								([key, value]) => `${key} - ${value}`
							)}
						/>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	);
};
