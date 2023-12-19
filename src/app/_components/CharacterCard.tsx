import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { Character } from '../../_models/character';
import { useRouter } from 'next/navigation';

export const CharacterCard: React.FC<{ character: Character }> = ({
	character,
}) => {
	const router = useRouter();
	const openCharacterTab = () => {
		window.open(`/characters/${character.name}`);
	};
	return (
		<Grid item key={character.name}>
			<Card 
				onClick={() => openCharacterTab()} 
				sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						padding: '0 1rem',
						margin: '1rem 0 0',
						'&:hover': { opacity: '.6', cursor: 'pointer' },
					}}>
				<CardHeader title={character.name} />
				<CardContent>
					<Typography>{`Race: ${character.race}`}</Typography>
					{character.classes?.map((cl) => {
						return (
							<Typography key={cl.name}>{`${cl.name} ${cl.level}`}</Typography>
						);
					})}
				</CardContent>
			</Card>
		</Grid>
	);
};
