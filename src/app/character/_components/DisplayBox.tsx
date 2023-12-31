import { Modifier } from "@/_models";
import { Tooltip, Typography } from "@mui/material";
import { CardTitles, CardTitlesType } from "./AttributeDisplay";
import { AttributeTooltip } from "./AttributeTooltip";

interface AttributeDisplayProps {
	displayTitle: CardTitlesType;
	displayValue: number;
	modifiers?: Modifier[];
	icon?: any;
}

export const DisplayBox = ({
	modifiers,
	displayTitle,
	displayValue,
	icon,
}: AttributeDisplayProps) => {
	return !!modifiers?.length && displayTitle === CardTitles.Total ? (
		<Tooltip
			title={<AttributeTooltip modifiers={modifiers} />}
			placement='right'
		>
			<div style={{
				textAlign: 'center',
			}}>
				<Typography variant='caption'>{displayTitle}</Typography>
				<Typography variant='body1'>{displayValue}</Typography>
			</div>
		</Tooltip>
	) : (
		<div style={{
			textAlign: 'center',
		}}>
			<div style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<Typography variant='caption'>{displayTitle}</Typography>
				{icon}
			</div>
			<Typography variant='body1'>{displayValue}</Typography>
		</div>
	);
};