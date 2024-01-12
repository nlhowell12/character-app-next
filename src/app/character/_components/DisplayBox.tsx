import { Modifier, StatusEffects } from "@/_models";
import { TextField, Tooltip, Typography } from "@mui/material";
import { CardTitles, CardTitlesType } from "./AttributeDisplay";
import { AttributeTooltip } from "./AttributeTooltip";

interface AttributeDisplayProps {
	displayTitle: CardTitlesType | StatusEffects;
	displayValue: number;
	modifiers?: Modifier[];
	icon?: any;
	editable?: boolean;
	onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void; 
}

export const DisplayBox = ({
	modifiers,
	displayTitle,
	displayValue,
	icon,
	editable,
	onChange
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
			{!!editable && !!onChange ? (
                <TextField
                    sx={{
                        maxWidth: '4rem',
                    }}
                    value={displayValue}
                    onChange={(e) => !!onChange && onChange(e)}
                />
            ) : (
                <Typography variant='body1'>{displayValue}</Typography>
            )}
		</div>
	);
};