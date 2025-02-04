
import { mockCharacters } from '@/_mockData/characters';
import { AttributeNames, BaseEquipment, BonusTypes, EnergyType, Equipment, Modifier, ModifierSource, StatusEffects } from '@/_models';
import * as defenseUtils from './defenseUtils';
import { getTotalAttributeModifier } from './attributeUtils';
import { cloakOfResistance } from './equipmentUtils.test';

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
			[BonusTypes.Untyped]: 2,
			[BonusTypes.Size]: 1,

		});
		expect(defenseUtils.getDefenseBonuses({...mock0, miscModifiers: [...mock0.miscModifiers, {id: '10',value: 0, attribute: AttributeNames.Wisdom, type: BonusTypes.Enhancement, defense: true, source: ModifierSource.spell}]})).toStrictEqual({
			[BonusTypes.Racial]: 1,
			[BonusTypes.Armor]: 2,
			[BonusTypes.Untyped]: 2,
			[BonusTypes.Enhancement]: getTotalAttributeModifier(mock0, AttributeNames.Wisdom),
			[BonusTypes.Size]: 1,

		});
	});
	it('should get correct maximum dex mod from equipment', () => {
		expect(defenseUtils.getLowestEqDexMod(mock0.equipment)).toBe(8);
		expect(defenseUtils.getLowestEqDexMod([...mock0.equipment, {...mock0.equipment[0], maxDexBonus: 2}])).toBe(2);
	})
	it('should get adjusted adjusted dex mod', () => {
		expect(defenseUtils.getAdjustedMaxDexMod(mock0)).toBe(3)
		expect(defenseUtils.getAdjustedMaxDexMod({...mock0, equipment: [...mock0.equipment, {...mock0.equipment[0], maxDexBonus: 2}]})).toBe(2)
	})
	test('getTotalDefense', () => {
		expect(defenseUtils.getTotalDefense(mock0)).toStrictEqual({
			dsBonus: 16,
			drBonus: 3,
		});
		expect(defenseUtils.getTotalDefense({...mock0, statusEffects: [StatusEffects.Blinded]})).toStrictEqual({
			dsBonus: 11,
			drBonus: 3,
		});
		expect(defenseUtils.getTotalDefense({...mock0, statusEffects: [StatusEffects.Frightened]})).toStrictEqual({
			dsBonus: 13,
			drBonus: 3,
		});
	});
	test('getResistances', () => {
		const equipmentMod = {value: 10, type: BonusTypes.Resistance, resistance: true, damageType: EnergyType.Fire};
		const moddedCloak = {...cloakOfResistance, modifiers: [equipmentMod]} as Equipment;
		const immunityMod = {
			id: '1',
			immunity: true,
			damageType: EnergyType.Acid,
			value: 0,
			type: BonusTypes.Resistance,
			source: ModifierSource.other
		}
		const ringOfFireImmunity = {
			name: 'Ring of Fire Immunity',
			equipped: true,
			modifiers: [immunityMod],
			id: '123',
			amount: 1,
			weight: 0,
			cost: '1'} as BaseEquipment;
		const mock = {...mock0, equipment: [moddedCloak, ringOfFireImmunity]}
		expect(defenseUtils.getResistances(mock)).toStrictEqual({
			Cold: 5,
			Fire: 10,
			Acid: 'Immune'
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
		let mock = mock0;
		expect(defenseUtils.getTotalSaveBonus(mock, AttributeNames.Dexterity)).toBe(7)
		mock = {...mock0, equipment: [cloakOfResistance]}
		expect(defenseUtils.getTotalSaveBonus(mock, AttributeNames.Dexterity)).toBe(12)
		expect(defenseUtils.getTotalSaveBonus(mock, AttributeNames.Strength)).toBe(3)
		expect(defenseUtils.getTotalSaveBonus(mock, AttributeNames.Intelligence)).toBe(11)
	});
});
