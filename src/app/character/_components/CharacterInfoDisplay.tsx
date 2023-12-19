import { Table, TableBody, TableRow } from '@mui/material';
import React from 'react';
import { Character } from '../../models';
import { makeStyles } from '@mui/styles';
import { DisplayCell } from './DisplayCell';

interface CharacterInfoDisplayProps {
	character: Character;
}

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
		width: '75%',
	},
	tableRowRoot: {
		borderBottom: 'none',
	},
}));

export const CharacterInfoDisplay: React.FC<CharacterInfoDisplayProps> = ({
	character,
}) => {
	const classes = useStyles();
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
		</div>
	);
};
