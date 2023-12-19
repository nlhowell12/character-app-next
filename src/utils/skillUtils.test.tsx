import { mockCharacters } from '@/_mockData/characters';
import {
	getArmorCheckPenalties,
	getSkillModifiers,
	getSkillSynergies,
	getTotalSkillValue,
} from './skillIUtils';

describe('Skill Utils', () => {
	const mock0 = mockCharacters[0];
	test('getTotalSkillValue', () => {
		expect(getTotalSkillValue(mock0, mock0.skills.Acrobatics)).toBe(8);
	});
	test('getArmorCheckPenalties', () => {
		expect(getArmorCheckPenalties(mock0.equipment)).toBe(0);
	});
	//     test('getSkillSynergies', () => {
	//         expect(getSkillSynergies(mock0.skills.Diplomacy, mock0)).toBe(2);
	//     });
	//     test('getSkillModiifiers', () => {
	//         expect(getSkillModifiers(mock0.skills.Acrobatics, mock0)).toBe(3);
	// });
});
