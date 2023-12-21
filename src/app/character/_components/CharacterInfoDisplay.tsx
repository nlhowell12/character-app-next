import { Grid, Table, TableBody, TableRow, makeStyles } from '@mui/material';
import { DisplayCell } from './DisplayCell';
import { Character } from '@/_models';

interface CharacterInfoDisplayProps {
	character: Character;
}

export const CharacterInfoDisplay = ({
	character,
} : CharacterInfoDisplayProps) => {
	return (
		<Grid xs={6}>
			<Table>
				<TableBody>
					<TableRow
						sx={{border: 'none'}}
					>
						<DisplayCell
							variant='h6'
							cellTitle='Name:'
							value={character.name}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Player:'
							value={character.playerName || 'N/A'}
						/>
					</TableRow>
					<TableRow>
						<DisplayCell
							variant='h6'
							cellTitle='Classes:'
							value={character.classes.map(
								(cls) => `${cls.name} ${cls.level} `
							)}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Race:'
							value={character.race}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Size:'
							value={character.size}
						/>
					</TableRow>
					<TableRow>
						<DisplayCell
							variant='h6'
							cellTitle='Age:'
							value={!!character.age ? character.age : 'N/A'}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Height:'
							value={!!character.height ? character.height : 'N/A'}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Weight:'
							value={!!character.weight ? character.weight : 'N/A'}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Eyes:'
							value={!!character.eyeColor ? character.eyeColor : 'N/A'}
						/>
						<DisplayCell
							variant='h6'
							cellTitle='Hair:'
							value={!!character.hairColor ? character.hairColor : 'N/A'}
						/>
					</TableRow>
				</TableBody>
			</Table>
		</Grid>
	);
};
