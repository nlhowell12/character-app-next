
import { AttributeNames, BonusTypes, Modifier, ModifierSource } from '@/_models';
import * as abilityUtils from './attributeUtils';
import { mockCharacters } from '@/_mockData/characters';
import { getModifierAttributeBonus } from './attributeUtils';

const mockRacialModifiers: Modifier[] = [
	{
		id: '1234',
		value: 2,
		type: BonusTypes.Racial,
		attribute: AttributeNames.Intelligence,
	},
	{ id: '1111',value: 2, type: BonusTypes.Racial, attribute: AttributeNames.Dexterity },
	{
		id: '12345',
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
		).toBe(0);
	});
	it('should return an attribuate based modifier', () => {
        expect(getModifierAttributeBonus(mockCharacters[0], mockCharacters[0].miscModifiers.filter(x => !!x.attribute && !x.value)[0])).toBe(4)
    })
	test('getBaseAttributeScore', () => {
		expect(
			abilityUtils.getBaseAttributeScore(mock0, AttributeNames.Dexterity)
		).toBe(18);
		expect(
			abilityUtils.getBaseAttributeScore({...mock0, miscModifiers: [{id: '12345678', value: 0, definition: ModifierSource.attributeScoreIncrease, attribute: AttributeNames.Strength, type: BonusTypes.Racial}]}, AttributeNames.Dexterity)
		).toBe(17);
	});
	test('totalAttributeValue', () => {
		expect(
			abilityUtils.totalAttributeValue(mock0, AttributeNames.Dexterity)
		).toBe(18);
	});
	test('getTotalAttributeModifier', () => {
		expect(
			abilityUtils.getTotalAttributeModifier(mock0, AttributeNames.Dexterity)
		).toBe(4);
	});
});
