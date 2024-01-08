'use client'

import { useContext, useEffect, useReducer } from 'react';
import { characterReducer, initialCharacterState, updateAction } from '../../_reducer/characterReducer';
import { CharacterKeys } from '@/_models';
import UserContext from '../_auth/UserContext';
import { EditCharacter } from './_components/EditCharacter';

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
		<EditCharacter character={character} dispatch={dispatch}/>
    );
};
