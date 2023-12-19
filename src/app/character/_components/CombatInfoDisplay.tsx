import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { AttributeNames, Character } from '../../models';
import {
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import { DisplayCell } from './DisplayCell';
import {
	BonusObject,
	getDefenseBonuses,
	getResistances,
	getTotalDefense,
} from '../../utils/defenseUtils';
import { getTotalAttributeModifier } from '../../utils/attributeUtils';

const useStyles = makeStyles((theme) => ({
	table: {},
	tableRow: {
		border: 'none',
	},
	tableCell: {},
	cellRoot: {
		padding: '0 .5rem 0 0',
	},
	displayCard: {
		padding: '.5rem',
	},
	tableContainer: {
		marginLeft: '1rem',
	},
	tableRowRoot: {
		borderBottom: 'none',
	},
}));

interface CombatInfoDisplayProps {
	character: Character;
}

const AcTooltip: React.FC<{ acBonuses: BonusObject; character: Character }> = ({
	acBonuses,
	character,
}) => {
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

export const CombatInfoDisplay: React.FC<CombatInfoDisplayProps> = ({
	character,
}) => {
	const classes = useStyles();
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
		<div className={classes.tableContainer}>
			<Table className={classes.table}>
				<TableBody>
					<TableRow
						classes={{ root: classes.tableRowRoot }}
						className={classes.tableRow}
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
						classes={{ root: classes.tableRowRoot }}
						className={classes.tableRow}
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
