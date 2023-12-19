import { AttributeNames, Character } from '@/_models';
import { getTotalAttributeModifier } from '@/_utils/attributeUtils';
import { BonusObject, getTotalDefense, getDefenseBonuses, getResistances } from '@/_utils/defenseUtils';
import { Table, TableBody, TableRow, TableCell, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { DisplayCell } from './DisplayCell';
interface CombatInfoDisplayProps {
	character: Character;
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
} : CombatInfoDisplayProps) => {
	const [currentHitPoints, setCurrentHitPoints] = useState<number>(0);
	const [nonLethalDamage, setNonLethalDamage] = useState<number>(0);
	const [tempHP, setTempHP] = useState<number>(0);
	useEffect(() => {
		if (!!character) {
			setCurrentHitPoints(character.currentHitPoints);
			setNonLethalDamage(character.nonLethalDamage);
			setTempHP(character.tempHP);
		}
	}, [character]);
	const defenses = getTotalDefense(character);

	return (
		<div style={{marginLeft: '1rem'}}>
			<Table>
				<TableBody>
					<TableRow
						sx={{border: 'none'}}
					>
						<DisplayCell
							variant='h6'
							cellTitle='Max Hit Points:'
							value={character.maxHitPoints}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Current Hit Points:'
							value={currentHitPoints}
							editable={true}
							onChange={setCurrentHitPoints}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Non-Lethal Damage:'
							value={nonLethalDamage}
							editable={true}
							onChange={setNonLethalDamage}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Temp HP:'
							value={tempHP}
							editable={true}
							onChange={setTempHP}
						/>
					</TableRow>
					<TableRow
						sx={{border: 'none'}}
					>
						<DisplayCell
							variant='h6'
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
							variant='h6'
							cellTitle='Speed:'
							value={character.movementSpeeds.map(
								(spd) => ` ${spd.type}(${spd.speed}ft)`
							)}
						/>
						<DisplayCell
							variant='h6'
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
