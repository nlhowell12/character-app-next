'use client';

import { Character } from '@/_models';
import { useParams } from 'next/navigation';
import React, { useEffect, useReducer, useState } from 'react';
import {
    characterReducer,
    initialCharacterState,
    setCharacterAction,
} from '@/_reducer/characterReducer';
import useCharacterService from '@/app/api/_services/useCharacterService';
import { CharacterDisplay } from '../_components/CharacterDisplay';
import { EditCharacter } from '@/app/createCharacter/_components/EditCharacter';

export default function CharacterPage() {
    const params = useParams<{ character: string }>();
    const [edit, setEdit] = useState(false);

    const { characters } = useCharacterService();

    const pageCharacter = characters?.find(
        (character: Character) => character.name === params.character
    );
    const [character, dispatch] = useReducer(
        characterReducer,
        initialCharacterState
    );
    
    const handleUpdate = () => {
        setEdit(false);
    };

    useEffect(() => {
        if (!!pageCharacter) {
            dispatch(setCharacterAction(pageCharacter));
            document.title = pageCharacter.name;
        }
    }, [pageCharacter]);

    return !!character ? (
        edit ? (
            <EditCharacter character={character} dispatch={dispatch} onUpdate={handleUpdate}/>
        ) : (
            <CharacterDisplay character={character} dispatch={dispatch} onEdit={setEdit}/>
        )
    ) : null;
}
