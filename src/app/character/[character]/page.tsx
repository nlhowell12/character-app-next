'use client'

import { mockCharacters } from "@/_mockData/characters";
import { Character } from "@/_models";
import { useParams } from "next/navigation";
import { useEffect, useReducer } from "react";
import { AttributeDisplay } from "../_components/AttributeDisplay";
import { CharacterInfoDisplay } from "../_components/CharacterInfoDisplay";
import { CombatInfoDisplay } from "../_components/CombatInfoDisplay";
import { EquipmentDisplay } from "../_components/EquipmentDisplay";
import { SkillDisplay } from "../_components/SkillDisplay";
import { characterReducer, initialCharacterState, setCharacterAction } from "@/_reducer/characterReducer";

export default function CharacterPage() {
	const params = useParams<{ character: string }>();
	const mockQueriedCharacter = mockCharacters.find(
		(character: Character) => character.name === params.character
	);
	const [character, dispatch] = useReducer(
        characterReducer,
        initialCharacterState
    );
	useEffect(() => {
		if (!!mockQueriedCharacter) {
			dispatch(setCharacterAction(mockQueriedCharacter));
			document.title = mockQueriedCharacter.name;
		}
	}, [mockQueriedCharacter]);
	return !!character && (
		<div style={{height: '100vh'}}>
			<div style={{
                borderBottom: `1px solid grey`,
                paddingBottom: '.5rem',
                marginBottom: '1rem',
                width: '99%',
            }}>
				<CharacterInfoDisplay character={character} dispatch={dispatch} />
			</div>
			<div style={{
                display: 'flex',
            }}>
				<AttributeDisplay character={character} />
				<div>
					<CombatInfoDisplay character={character} />
					<EquipmentDisplay character={character} />
				</div>
				<SkillDisplay character={character} />
			</div>
		</div>
	)
};
