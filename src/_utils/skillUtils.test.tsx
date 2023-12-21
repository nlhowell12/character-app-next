import { mockCharacters } from '@/_mockData/characters';
import {
	getArmorCheckPenalties,
	getSkillModifiers,
	getTotalSkillValue,
} from './skillIUtils';

describe('Skill Utils', () => {
	const mock0 = mockCharacters[0];
	test('getTotalSkillValue', () => {
		expect(getTotalSkillValue(mock0, mock0.skills.Acrobatics)).toBe(9);
		expect(getTotalSkillValue({...mock0, equipment: [...mock0.equipment, {name: 'Shield', armorCheckPenalty: -2, weight: 8, modifiers: [], equipped: true}]}, mock0.skills.Acrobatics)).toBe(7);
		expect(getTotalSkillValue({...mock0, equipment: [...mock0.equipment, {name: 'Shield', armorCheckPenalty: -2, weight: 8, modifiers: [], equipped: true}]}, mock0.skills.Intimidate)).toBe(0);
	});
	test('getArmorCheckPenalties', () => {
		expect(getArmorCheckPenalties(mock0.equipment)).toBe(0);
		expect(getArmorCheckPenalties([...mock0.equipment, {name: 'Shield', armorCheckPenalty: -2, weight: 8, modifiers: [], equipped: true}])).toBe(-2);
	});
	test('getSkillModiifiers', () => {
		expect(getSkillModifiers(mock0.skills.Stealth, mock0)).toBe(4);
		expect(getSkillModifiers(mock0.skills.Disguise, mock0)).toBe(2);
	});
});
