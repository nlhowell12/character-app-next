
import { AttributeNames, BonusTypes, Modifier, ModifierSource } from '@/_models';
import * as abilityUtils from './attributeUtils';
import { mockCharacters } from '@/_mockData/characters';

const mockRacialModifiers: Modifier[] = [
	{
		value: 2,
		type: BonusTypes.Racial,
		attribute: AttributeNames.Intelligence,
	},
	{ value: 2, type: BonusTypes.Racial, attribute: AttributeNames.Dexterity },
	{
		value: -2,
		type: BonusTypes.Racial,
		attribute: AttributeNames.Constitution,
	},
];

describe('Attribute utils', () => {
	const mock0 = mockCharacters[0];

	test('getAttributeModifier', () => {
		expect(abilityUtils.getAttributeModifier(12)).toBe(1);
		expect(abilityUtils.getAttributeModifier(11)).toBe(0);
		expect(abilityUtils.getAttributeModifier(8)).toBe(-1);
	});
	test('getAttributeBonuses', () => {
		expect(
			abilityUtils.getAttributeBonuses(
				AttributeNames.Dexterity,
				mockRacialModifiers
			).length
		).toBe(1);
		expect(
			abilityUtils.getAttributeBonuses(
				AttributeNames.Dexterity,
				mockRacialModifiers
			)[0].attribute
		).toBe(AttributeNames.Dexterity);
	});
	test('getAllAttributeModifiers', () => {
		expect(
			abilityUtils.getAllAttributeModifiers(mock0, AttributeNames.Strength)
				.length
		).toBe(1);
		expect(
			abilityUtils.getAllAttributeModifiers(mock0, AttributeNames.Dexterity)
				.length
		).toBe(1);
	});
	test('getBaseAttributeScore', () => {
		expect(
			abilityUtils.getBaseAttributeScore(mock0, AttributeNames.Dexterity)
		).toBe(18);
		expect(
			abilityUtils.getBaseAttributeScore({...mock0, miscModifiers: [{definition: ModifierSource.attributeScoreIncrease, attribute: AttributeNames.Strength, type: BonusTypes.Racial}]}, AttributeNames.Dexterity)
		).toBe(17);
	});
	test('totalAttributeValue', () => {
		expect(
			abilityUtils.totalAttributeValue(mock0, AttributeNames.Dexterity)
		).toBe(20);
	});
	test('getTotalAttributeModifier', () => {
		expect(
			abilityUtils.getTotalAttributeModifier(mock0, AttributeNames.Dexterity)
		).toBe(5);
	});
});
