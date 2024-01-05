'use client';

import { Grid } from '@mui/material';
import { CharacterCardList } from './_components/CharacterCardList';
import useCharacterService from './api/_services/useCharacterService';
import { useEffect } from 'react';

export default function Home() {
    const { characters } = useCharacterService();

    useEffect(() => {
        document.title = 'Rhedrah Character Sheet'
    }, [])
    
    return (
        <Grid container>
            {!!characters && <CharacterCardList characters={characters} />}
        </Grid>
    );
}
