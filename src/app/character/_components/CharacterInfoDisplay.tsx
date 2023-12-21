import { Button, Dialog, Grid, Stack, Table, TableBody, TableCell, TableRow, Typography, makeStyles } from '@mui/material';
import { DisplayCell } from './DisplayCell';
import { BonusTypes, Character, Modifier, ModifierSource } from '@/_models';
import { CharacterAction, deleteModAction } from '@/_reducer/characterReducer';
import { ModChip } from '@/app/_components/ModChip';
import { Dispatch, useState } from 'react';
import * as R from 'ramda';
import { ModifierDialog } from '@/app/_components/ModifierDialog';
import { Add } from '@mui/icons-material';
interface CharacterInfoDisplayProps {
	character: Character;
	dispatch: Dispatch<CharacterAction>;
}

const cellStylingObject = {
	borderBottom: 'none',
	padding: '0 .5rem .5rem 0',
};

export const CharacterInfoDisplay = ({
	character,
	dispatch
} : CharacterInfoDisplayProps) => {
	const notASI = (x: Modifier) => x.definition !== ModifierSource.attributeScoreIncrease;
	const [openModifiers, setOpenModifers] = useState<boolean>(false);
	return (
		<Grid container>
			<Grid item xs={6}>
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
						 <TableCell sx={cellStylingObject}>
                                <Button
                                    variant='outlined'
                                    onClick={() => setOpenModifers(true)}
                                >
                                    <Typography>Add Modifier</Typography>
                                    <Add />
                                </Button>
                                <Dialog
                                    open={openModifiers}
                                    onClose={() => setOpenModifers(false)}
                                >
                                    <ModifierDialog
                                        character={character}
                                        dispatch={dispatch}
                                    />
                                </Dialog>
                            </TableCell>
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
			<Grid item xs={5}>
                <Stack direction='row' spacing={1} flexWrap='wrap'>
                    {R.filter(notASI, character.miscModifiers).map((mod) => {
                        return <ModChip mod={mod} onDelete={() => dispatch(deleteModAction(mod))}/>;
                    })}
                </Stack>
            </Grid>		
			</Grid>
	);
};
