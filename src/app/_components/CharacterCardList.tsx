'use client'

import { Character } from '../../_models/character';
import { Card, Grid, Typography } from '@mui/material';
import { CharacterCard } from './CharacterCard';
import PersonAddAlt from '@mui/icons-material/PersonAddAlt';
import { useRouter } from 'next/navigation';

interface CharacterCardListProps {
	characters: Character[]
};

export const CharacterCardList = ({
	characters,
}: CharacterCardListProps) => {
	const router = useRouter();
	return (
		<Grid
			container
			direction='column'
			xl={12}
		>
			<Grid item>
				<Typography variant='h5'>Your Characters</Typography>
			</Grid>
			<Grid container xl={6}>
				{characters.map((character) => {
					return <CharacterCard key={character.name} character={character} />;
				})}
				<Card
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						padding: '0 1rem',
						margin: '1rem 0 0',
						'&:hover': { opacity: '.6', cursor: 'pointer' },
					}}
					onClick={() => router.push('/newCharacter')}
				>
					<Typography variant='h5' align='center'>
						New Character
					</Typography>
					<PersonAddAlt fontSize='large' />
				</Card>
			</Grid>
		</Grid>
	);
};
