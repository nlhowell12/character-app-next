'use client'

import { useReducer } from 'react';
import { AttributeDisplay } from './_components/AttributeDisplay';
import { CharacterInfoDisplay } from './_components/CharacterInfoDisplay';
import { characterReducer, initialCharacterState } from '../../_reducer/characterReducer';
import { ClassSelector } from './_components/ClassSelector';

export default function CreateCharacter() {
    const [character, dispatch] = useReducer(
        characterReducer,
        initialCharacterState
    );

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
            <div
                style={{
                    display: 'flex',
                    height: '65vh',
                }}
            >
                <AttributeDisplay character={character} dispatch={dispatch} />
                <ClassSelector character={character} dispatch={dispatch} />
            </div>
        </div>
    );
};