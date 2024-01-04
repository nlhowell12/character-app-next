'use client';

import { Grid } from '@mui/material';
import { CharacterCardList } from './_components/CharacterCardList';
import useCharacterService from './api/_services/useCharacterService';
import { UserSignIn } from './_components/UserSignIn';
import { useContext } from 'react';
import UserContext from './_auth/UserContext';

export default function Home() {
    const { characters } = useCharacterService();
    const { user } = useContext(UserContext);

    return (
        <Grid container>
            {!!characters && <CharacterCardList characters={characters} />}
        </Grid>
    );
}
