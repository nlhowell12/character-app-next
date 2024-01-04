'use client'

import { useContext, useEffect, useReducer } from 'react';
import { AttributeDisplay } from './_components/AttributeDisplay';
import { CharacterInfoDisplay } from './_components/CharacterInfoDisplay';
import { characterReducer, initialCharacterState, updateAction } from '../../_reducer/characterReducer';
import { ClassSelector } from './_components/ClassSelector';
import { SkillDisplay } from './_components/SkillDisplay';
import { Grid } from '@mui/material';
import { CharacterKeys } from '@/_models';
import { FeatSelector } from './_components/FeatSelector';
import UserContext from '../_auth/UserContext';

export default function CreateCharacter() {
    const [character, dispatch] = useReducer(
        characterReducer,
        initialCharacterState
    );
    const { user } = useContext(UserContext);

    useEffect(() => {
        if(!!user){
            dispatch(updateAction(CharacterKeys.playerName, user?.name))
        }
    }, [user])
    
    return (
        <div>
            <div
                style={{
                    borderBottom: `1px solid grey`,
                    paddingBottom: '.5rem',
                    marginBottom: '1rem',
                    width: '99%',
                }}
            >
                <CharacterInfoDisplay
                    character={character}
                    dispatch={dispatch}
                />
            </div>
            <Grid container
                style={{
                    display: 'flex',
                    height: '65vh',
                }}
            >
                <Grid item xs={'auto'}>
                    <AttributeDisplay character={character} dispatch={dispatch} />
                </Grid>
                <Grid item xs={4} display='flex'>
                    <ClassSelector character={character} dispatch={dispatch} />
                    <FeatSelector character={character} dispatch={dispatch} />
                </Grid>
                <Grid item xs={2}>
                    <SkillDisplay character={character} dispatch={dispatch}/>
                </Grid>
            </Grid>
        </div>
    );
};
