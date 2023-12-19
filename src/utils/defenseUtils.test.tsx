
import { mockCharacters } from '@/_mockData/characters';
import { BonusTypes } from '@/_models';
import * as defenseUtils from './defenseUtils';

describe('Defense Utilities', () => {
	const mock0 = mockCharacters[0];

	test('getMiscAcBonuses', () => {
		const mock0Modifiers = mock0.miscModifiers?.filter((mod) => !!mod.defense);
		expect(defenseUtils.getMiscAcBonuses(mock0)).toStrictEqual(mock0Modifiers);
	});
	test('getEquipmentAcBonuses', () => {
		expect(defenseUtils.getEquipmentAcBonuses(mock0)).toEqual(
			mock0.equipment[0].modifiers
		);
	});
	test('getDefenseBonuses', () => {
		expect(defenseUtils.getDefenseBonuses(mock0)).toStrictEqual({
			[BonusTypes.NaturalArmor]: 1,
			[BonusTypes.Armor]: 2,
		});
	});
	test('getTotalDefense', () => {
		expect(defenseUtils.getTotalDefense(mock0)).toStrictEqual({
			dsBonus: 14,
			drBonus: 3,
		});
	});
	test('getResistances', () => {
		expect(defenseUtils.getResistances(mock0)).toStrictEqual({
			Cold: 5,
		} as defenseUtils.ResistObject);
	});
	test('getProficientSaveBonus', () => {
		expect(defenseUtils.getSaveBonus(true, 20)).toBe(12);
		expect(defenseUtils.getSaveBonus(true, 19)).toBe(11);
		expect(defenseUtils.getSaveBonus(true, 1)).toBe(2);
		expect(defenseUtils.getSaveBonus(false, 1)).toBe(0);
		expect(defenseUtils.getSaveBonus(false, 12)).toBe(4);
		expect(defenseUtils.getSaveBonus(false, 15)).toBe(5);
	});
});
