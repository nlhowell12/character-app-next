import { mockCharacters } from '@/_mockData/characters';
import {
	getArmorCheckPenalties,
	getTotalSkillMod,
	getTotalSkillValue,
} from './skillIUtils';
import { Armor, BaseEquipment, BonusTypes, ModifierSource, SkillTypes } from '@/_models';

export const cloakOfElvenkind: BaseEquipment = {
	equipped: true,
	modifiers: [
		{
			skill: SkillTypes.Stealth,
			value: 8,
			type: BonusTypes.Circumstance,
			id: '123',
			source: ModifierSource.other
		}
	],
	name: 'Cloak of Elvenkind;',
	id: '',
	weight: 0,
	amount: 1,
	cost: '0'
};
describe('Skill Utils', () => {
	const mock0 = mockCharacters[0];
	const magicLeather: Armor = {
		id: '123457',
		name: 'Leather Armor',
		armorCheckPenalty: 2,
		maxDexBonus: 8,
		spellFailure: 0,
		hardness: 50,
		weight: 4,
		isArmor: true,
		amount: 1,
		cost: '',
		modifiers: [],
		equipped: true
	};
	
	test('getTotalSkillValue', () => {
		expect(getTotalSkillValue(mock0, mock0.skills.Acrobatics)).toBe(7);
		expect(getTotalSkillValue({...mock0, equipment: [...mock0.equipment, magicLeather]}, mock0.skills.Acrobatics)).toBe(5);
		expect(getTotalSkillValue({...mock0, equipment: [...mock0.equipment, magicLeather]}, mock0.skills.Intimidate)).toBe(0);
		expect(getTotalSkillValue({...mock0, equipment: [...mock0.equipment, magicLeather]}, mock0.skills.Stealth)).toBe(11);
		const mock = {...mock0, equipment: [cloakOfElvenkind]}
		expect(getTotalSkillValue(mock, mock0.skills.Stealth)).toBe(19);
	});
	test('getArmorCheckPenalties', () => {
		expect(getArmorCheckPenalties(mock0.equipment)).toBe(0);
		expect(getArmorCheckPenalties([...mock0.equipment, magicLeather])).toBe(-2);
	});
	test('getSkillModiifiers', () => {
		expect(getTotalSkillMod(mock0.skills.Stealth, mock0)).toBe(4);
		expect(getTotalSkillMod(mock0.skills.Disguise, mock0)).toBe(2);
	});
});
