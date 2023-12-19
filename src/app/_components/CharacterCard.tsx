import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { Character } from '../../_models/character';

interface CharacterCardProps {
	character: Character
};
export const CharacterCard = ({
	character
}: CharacterCardProps) => {
	const openCharacterTab = () => {
		window.open(`/character/${character.name}`);
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
