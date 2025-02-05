import { Character, ClassAbility } from '@/_models';

import {
	Card,
	Table,
	TableBody,
	TableCell,
	TableRow,
	Tooltip,
	Typography,
    useTheme,
} from '@mui/material';
import { getAllClassAbilities, getHexbladeCurseDC } from '@/_utils/classUtils';

export enum CardTitles {
	Total = 'Total',
	Base = 'Base',
	Modifier = 'Modifier',
	Save = 'Save',
}

interface AbilityRowProps
{
	ability: ClassAbility;
}
const AbilityRow = ({ ability } : AbilityRowProps) => {
	return (
        <Tooltip title={ability.description} placement='right'>
            <TableRow sx={{
                alignItems: 'center',
                width: '100%',
            }}>
                <TableCell>
                    <Typography sx={{
                        display: 'flex',
                        flexGrow: 1,
                    }} variant='body1'>
                        {ability.className}
                    </Typography>
                </TableCell>
                <TableCell>
                    {ability.level}
                </TableCell>
                <TableCell>
                    {ability.name}
                </TableCell>
            </TableRow>
        </Tooltip>
		
	);
};

interface ClassAbilityDisplayProps {
	character: Character
}
export const ClassAbilityDisplay = ({
	character,
} : ClassAbilityDisplayProps) => {
	const abilities = getAllClassAbilities(character);
    const theme = useTheme();
	const hexbladeDC = getHexbladeCurseDC(character);
	return (
		<Card sx={{
			width: '100%',
			height: 'fit-content',
            [theme.breakpoints.up('xl')]: {
                marginTop: '1.5rem',
            },
		}}>
			<Table sx={{
				width: '100%',
				border: '1px solid gray',
			}}>
				<TableBody>
					{!!hexbladeDC && 
					<TableRow>
						<TableCell><Typography>Hexblade Curse DC</Typography></TableCell>
						<TableCell><Typography>{hexbladeDC}</Typography></TableCell>
					</TableRow>}
					{abilities.sort((a, b) => a.level - b.level).map((ability) => {
						return (
							<AbilityRow key={ability.className + ability.description} ability={ability}/>
						);
					})}
				</TableBody>
			</Table>
		</Card>
	);
};
