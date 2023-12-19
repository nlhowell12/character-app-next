import {
	Card,
	CardContent,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Armor, Character, Weapon } from '../../models';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const useStyles = makeStyles(() => ({
	equipmentDisplayCard: {
		margin: '1rem',
	},
}));
export const EquipmentDisplay: React.FC<{ character: Character }> = ({
	character,
}) => {
	const classes = useStyles();
	const weapons = character.equipment.filter((eq) => !!(eq as Weapon).damage);
	const armor = character.equipment.filter(
		(eq) => !!(eq as Armor).modifiers.some((mod) => !!mod.defense)
	);
	return (
		<>
			<Card className={classes.equipmentDisplayCard}>
				<CardContent>
					<Typography variant='h6'>Weapons</Typography>
				</CardContent>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Damage</TableCell>
							<TableCell align='center'>Two-Handed?</TableCell>
							<TableCell>Critical</TableCell>
						</TableRow>
						{weapons.map((eq) => {
							const weapon = eq as Weapon;
							const critRange =
								weapon.criticalRange < 20 ? `${weapon.criticalRange}-20` : 20;
							return (
								<TableRow key={weapon.name}>
									<TableCell>{weapon.name}</TableCell>
									<TableCell>{weapon.damage}</TableCell>
									<TableCell align='center'>
										{!!weapon.twoHanded ? <CheckCircleOutlineIcon /> : null}
									</TableCell>
									<TableCell>{`${critRange} / x${weapon.criticalMultiplier}`}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
			<Card className={classes.equipmentDisplayCard}>
				<CardContent>
					<Typography variant='h6'>Armor</Typography>
				</CardContent>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Bonus</TableCell>
							<TableCell>Body Slot</TableCell>
							<TableCell align='center'>Equipped</TableCell>
						</TableRow>
						{armor.map((eq) => {
							const armorMod = (eq as Armor).modifiers.find(
								(mod) => mod.defense
							);
							return (
								<TableRow key={eq.name}>
									<TableCell>{eq.name}</TableCell>
									<TableCell>{`${armorMod?.value || 0} (${
										armorMod?.type
									})`}</TableCell>
									<TableCell>{eq.bodySlot}</TableCell>
									<TableCell align='center'>
										{(eq as Armor).equipped ? <CheckCircleOutlineIcon /> : null}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</Card>
		</>
	);
};
