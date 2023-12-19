'use client'

import { mockCharacters } from "@/_mockData/characters";
import { Character } from "@/_models";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { AttributeDisplay } from "../_components/AttributeDisplay";
import { CharacterInfoDisplay } from "../_components/CharacterInfoDisplay";
import { CombatInfoDisplay } from "../_components/CombatInfoDisplay";
import { EquipmentDisplay } from "../_components/EquipmentDisplay";
import { SkillDisplay } from "../_components/SkillDisplay";

export default () => {
	const [character, setCharacter] = useState<Character>();
	const params = useParams<{ character: string }>();
	const mockQueriedCharacter = mockCharacters.find(
		(character: Character) => character.name === params.character
	);
	useEffect(() => {
		if (!!mockQueriedCharacter) {
			setCharacter(mockQueriedCharacter);
			document.title = mockQueriedCharacter.name;
		}
	}, [mockQueriedCharacter]);

	return !!character && (
		<div>
			<div style={{
                borderBottom: `1px solid grey`,
                paddingBottom: '.5rem',
                marginBottom: '1rem',
                width: '99%',
            }}>
				<CharacterInfoDisplay character={character} />
			</div>
			<div style={{
                display: 'flex',
                height: '65vh',
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
