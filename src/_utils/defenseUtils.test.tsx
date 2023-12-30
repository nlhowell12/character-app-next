
import { mockCharacters } from '@/_mockData/characters';
import { AttributeNames, BonusTypes } from '@/_models';
import * as defenseUtils from './defenseUtils';
import { getTotalAttributeModifier } from './attributeUtils';

describe('Defense Utilities', () => {
	const mock0 = mockCharacters[0];

	test('getMiscAcBonuses', () => {
		const mock0Modifiers = mock0.miscModifiers?.filter((mod) => !!mod.defense);
		expect(defenseUtils.getMiscAcBonuses(mock0)).toStrictEqual(mock0Modifiers);
	});
	test('getEquipmentWithAcBonuses', () => {
		expect(defenseUtils.getEquipmentWithAcBonuses(mock0)).toEqual(
			mock0.equipment[0].modifiers
		);
	});
	test('getDefenseBonuses', () => {
		expect(defenseUtils.getDefenseBonuses(mock0)).toStrictEqual({
			[BonusTypes.Racial]: 1,
			[BonusTypes.Armor]: 2,
			[BonusTypes.Untyped]: 2
		});
		expect(defenseUtils.getDefenseBonuses({...mock0, miscModifiers: [...mock0.miscModifiers, {value: 0, attribute: AttributeNames.Wisdom, type: BonusTypes.Enhancement, defense: true}]})).toStrictEqual({
			[BonusTypes.Racial]: 1,
			[BonusTypes.Armor]: 2,
			[BonusTypes.Untyped]: 2,
			[BonusTypes.Enhancement]: getTotalAttributeModifier(mock0, AttributeNames.Wisdom)
		});
	});
	test('getTotalDefense', () => {
		expect(defenseUtils.getTotalDefense(mock0)).toStrictEqual({
			dsBonus: 16,
			drBonus: 3,
		});
	});
	test('getResistances', () => {
		expect(defenseUtils.getResistances(mock0)).toStrictEqual({
			Cold: 5
		} as defenseUtils.ResistObject);
	});
	test('isProficientSave', () => {
		expect(defenseUtils.isProficientSave(mock0.classes[0], AttributeNames.Dexterity)).toBeTruthy()
		expect(defenseUtils.isProficientSave(mock0.classes[0], AttributeNames.Charisma)).toBeFalsy()
	});
	test('getProficientSaveBonus', () => {
		expect(defenseUtils.getSaveBonus(true, 20)).toBe(12);
		expect(defenseUtils.getSaveBonus(true, 19)).toBe(11);
		expect(defenseUtils.getSaveBonus(true, 1)).toBe(2);
		expect(defenseUtils.getSaveBonus(false, 1)).toBe(0);
		expect(defenseUtils.getSaveBonus(false, 12)).toBe(4);
		expect(defenseUtils.getSaveBonus(false, 15)).toBe(5);
	});
	test('getTotalSaveBonus', () => {
		expect(defenseUtils.getTotalSaveBonus(mock0, AttributeNames.Dexterity)).toBe(6)
	});
});
