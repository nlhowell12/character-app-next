'use client';

import { Grid } from '@mui/material';
import { CharacterCardList } from './_components/CharacterCardList';
import useCharacterService from './api/_services/useCharacterService';
import { useContext } from 'react';
import { UserContext } from './layout';
import { UserSignIn } from './_components/UserSignIn';
import useUserService from './api/_services/useUserService';

export default function Home() {
    const { characters } = useCharacterService();
    const user = useContext(UserContext);
	const { loginUser, createUser } = useUserService();
 
    return !user.name ? (
        <UserSignIn handleSignIn={loginUser} handleCreate={createUser}/>
    ) : (
        <Grid container>
            {!!characters && <CharacterCardList characters={characters} />}
        </Grid>
    );
}
