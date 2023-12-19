'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AttributeDisplay } from './AttributeDisplay';
import { CharacterInfoDisplay } from './CharacterInfoDisplay';
import { CombatInfoDisplay } from './CombatInfoDisplay';
import { SkillDisplay } from './SkillDisplay';
import { EquipmentDisplay } from './EquipmentDisplay';
import { mockCharacters } from '@/_mockData/characters';
import { Character } from '@/_models';

export const CharacterPage: React.FC<{}> = () => {
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

	return !!character ? (
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
	) : (
		<div>Character not available :(</div>
	);
};
