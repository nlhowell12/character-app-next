import { CheckCircle } from '@mui/icons-material';
import {
	Card,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import {
	AttributeNames,
	BonusTypes,
	Character,
	CharacterAttributes,
	Modifier,
} from '../../models';
import {
	getAttributeBonuses,
	getBaseAttributeScore,
	getTotalAttributeModifier,
	totalAttributeValue,
} from '../../utils/attributeUtils';
import { getTotalSaveBonus, isProficientSave } from '../../utils/defenseUtils';

const useStyles = makeStyles((theme) => ({
	attributeDisplay: {
		width: 'fit-content',
		height: 'fit-content',
		minWidth: '37rem',
	},
	cardContent: {
		width: '100%',
		border: '1px solid gray',
	},
	attrRow: {
		height: '3rem',
		alignItems: 'center',
		display: 'flex',
		width: '100%',
	},
	attrTitle: {
		padding: '0 1rem',
		display: 'flex',
		flexGrow: 1,
	},
	displayBox: {
		textAlign: 'center',
	},
	displayTitle: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
}));

enum CardTitles {
	Total = 'Total',
	Base = 'Base',
	Modifier = 'Modifier',
	Save = 'Save',
}

type CardTitlesType = BonusTypes | CardTitles;

const AttributeTooltip: React.FC<{ modifiers: Modifier[] }> = ({
	modifiers,
}) => {
	return (
		<Table>
			<TableBody>
				<TableRow>
					{modifiers.map((mod) => {
						return (
							<TableCell key={mod.type + mod.value}>
								<DisplayBox
									displayTitle={mod.type}
									displayValue={mod.value || 0}
									modifiers={modifiers}
								/>
							</TableCell>
						);
					})}
				</TableRow>
			</TableBody>
		</Table>
	);
};

interface AttributeDisplayProps {
	displayTitle: CardTitlesType;
	displayValue: number;
	modifiers?: Modifier[];
	icon?: any;
}

const DisplayBox: React.FC<AttributeDisplayProps> = ({
	modifiers,
	displayTitle,
	displayValue,
	icon,
}) => {
	const classes = useStyles();
	return !!modifiers?.length && displayTitle === CardTitles.Total ? (
		<Tooltip
			title={<AttributeTooltip modifiers={modifiers} />}
			placement='right'
		>
			<div className={classes.displayBox}>
				<Typography variant='caption'>{displayTitle}</Typography>
				<Typography variant='h4'>{displayValue}</Typography>
			</div>
		</Tooltip>
	) : (
		<div className={classes.displayBox}>
			<div className={classes.displayTitle}>
				<Typography variant='caption'>{displayTitle}</Typography>
				{icon}
			</div>
			<Typography variant='h4'>{displayValue}</Typography>
		</div>
	);
};

const AttributeRow: React.FC<{
	character: Character;
	attributes: CharacterAttributes;
	attribute: AttributeNames;
	modifiers: Modifier[];
}> = ({ character, attribute, modifiers }) => {
	const classes = useStyles();
	const totalValue = totalAttributeValue(character, attribute);
	return (
		<TableRow className={classes.attrRow}>
			<TableCell>
				<Typography className={classes.attrTitle} variant='h5'>
					{attribute}
				</Typography>
			</TableCell>
			<TableCell>
				<DisplayBox
					displayTitle={CardTitles.Base}
					displayValue={getBaseAttributeScore(character, attribute)}
				/>
			</TableCell>
			<TableCell>
				<DisplayBox
					displayTitle={CardTitles.Modifier}
					displayValue={getTotalAttributeModifier(character, attribute)}
				/>
			</TableCell>
			<TableCell>
				<DisplayBox
					displayTitle={CardTitles.Total}
					displayValue={totalValue}
					modifiers={modifiers}
				/>
			</TableCell>
			<TableCell>
				<DisplayBox
					displayTitle={CardTitles.Save}
					displayValue={getTotalSaveBonus(
						character,
						attribute as AttributeNames
					)}
					icon={
						character.classes.some((cls) =>
							isProficientSave(cls, attribute as AttributeNames)
						) ? (
							<Tooltip title='Proficient'>
								<CheckCircle sx={{ marginLeft: '.25rem', color: 'green' }} />
							</Tooltip>
						) : null
					}
				/>
			</TableCell>
		</TableRow>
	);
};

export const AttributeDisplay: React.FC<{ character: Character }> = ({
	character,
}) => {
	const classes = useStyles();
	const { attributes } = character;
	return (
		<Card className={classes.attributeDisplay}>
			<Table className={classes.cardContent}>
				<TableBody>
					{Object.keys(attributes).map((attribute) => {
						const typedAtt = attribute as AttributeNames;
						const modifiers = character.attributes[typedAtt].modifiers;
						return (
							<AttributeRow
								key={typedAtt}
								character={character}
								attribute={typedAtt}
								attributes={attributes}
								modifiers={getAttributeBonuses(typedAtt, modifiers)}
							></AttributeRow>
						);
					})}
				</TableBody>
			</Table>
		</Card>
	);
};
