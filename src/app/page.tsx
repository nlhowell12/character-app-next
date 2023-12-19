import { Grid } from '@mui/material';
import { CharacterCardList } from './_components/CharacterCardList';
import { mockCharacters } from '@/_mockData/characters';

export default function Home() {
  return (
		<Grid container>
			{!!mockCharacters && <CharacterCardList characters={mockCharacters} />}
		</Grid>
	);
}
