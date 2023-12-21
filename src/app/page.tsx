'use client'

import { Grid } from '@mui/material';
import { CharacterCardList } from './_components/CharacterCardList';
// import { mockCharacters as characters } from '@/_mockData/characters';
import useCharacterService from './api/_services/useCharacterService';

export default function Home() {
	const { characters } = useCharacterService()
  return (
		<Grid container>
			{!!characters && <CharacterCardList characters={characters} />}
		</Grid>
	);
}
