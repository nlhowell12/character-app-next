import { BonusTypes, Modifier, Character, AttributeNames } from '@/_models';
import { totalAttributeValue, getBaseAttributeScore, getTotalAttributeModifier, getAttributeBonuses, getAllAttributeModifiers } from '@/_utils/attributeUtils';
import { getTotalSaveBonus, isProficientSave } from '@/_utils/defenseUtils';
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
import { DisplayBox } from './DisplayBox';

export enum CardTitles {
	Total = 'Total',
	Base = 'Base',
	Modifier = 'Modifier',
	Save = 'Save',
	Racial = 'Racial'
}

export type CardTitlesType = BonusTypes | CardTitles;
interface AttributeRowProps
{
	character: Character;
	attribute: AttributeNames;
	modifiers: Modifier[];
}
const AttributeRow = ({ character, attribute, modifiers } : AttributeRowProps) => {
	const totalValue = totalAttributeValue(character, attribute);
	return (
		<TableRow sx={{
			alignItems: 'center',
			width: '100%',
		}}>
			<TableCell>
				<Typography sx={{
					display: 'flex',
					flexGrow: 1,
				}} variant='body1'>
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
					displayTitle={CardTitles.Racial}
					displayValue={character.attributes[attribute].racialBonus || 0}
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

interface AttributeDisplay {
	character: Character
}
export const AttributeDisplay = ({
	character,
} : AttributeDisplay) => {
	const { attributes } = character;
	return (
		<Card sx={{
			width: 'fit-content',
			height: 'fit-content',
		}}>
			<Table sx={{
				width: '100%',
				border: '1px solid gray',
			}}>
				<TableBody>
					{Object.keys(attributes).map((attribute) => {
						const typedAtt = attribute as AttributeNames;
                        const modifiers = getAllAttributeModifiers(character, typedAtt);
						return (
							<AttributeRow
								key={typedAtt}
								character={character}
								attribute={typedAtt}
								modifiers={getAttributeBonuses(typedAtt, modifiers)}
							></AttributeRow>
						);
					})}
				</TableBody>
			</Table>
		</Card>
	);
};
