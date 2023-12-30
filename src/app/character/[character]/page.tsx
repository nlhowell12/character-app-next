'use client'

import { mockCharacters } from "@/_mockData/characters";
import { Character } from "@/_models";
import { useParams } from "next/navigation";
import React, { useEffect, useReducer } from "react";
import { AttributeDisplay } from "../_components/AttributeDisplay";
import { CharacterInfoDisplay } from "../_components/CharacterInfoDisplay";
import { CombatInfoDisplay } from "../_components/CombatInfoDisplay";
import { EquipmentDisplay } from "../_components/EquipmentDisplay";
import { SkillDisplay } from "../_components/SkillDisplay";
import { characterReducer, initialCharacterState, setCharacterAction } from "@/_reducer/characterReducer";
import useCharacterService from "@/app/api/_services/useCharacterService";

export default function CharacterPage() {
	const params = useParams<{ character: string }>();


	const { characters } = useCharacterService()

	const pageCharacter = characters?.find(
		(character: Character) => character.name === params.character
	);
	const [character, dispatch] = useReducer(
        characterReducer,
        initialCharacterState
    );


	useEffect(() => {
		if (!!pageCharacter) {
			dispatch(setCharacterAction(pageCharacter));
			document.title = pageCharacter.name;
		}
	}, [pageCharacter]);

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
					<CombatInfoDisplay character={character} dispatch={dispatch}/>
					<EquipmentDisplay character={character} dispatch={dispatch}/>
				</div>
				<SkillDisplay character={character} />
			</div>
		</div>
	)
};
