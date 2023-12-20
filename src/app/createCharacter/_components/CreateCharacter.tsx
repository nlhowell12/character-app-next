import React, { useReducer } from 'react';
import { AttributeDisplay } from './AttributeDisplay';
import { CharacterInfoDisplay } from './CharacterInfoDisplay';
import { characterReducer, initialCharacterState } from '../../../_reducer/characterReducer';
import { ClassSelector } from './ClassSelector';

export const CreateCharacter = () => {
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
