import { mockCharacters } from '@/_mockData/characters';
import * as classUtils from './classUtils';
import { CharacterClass, CharacterClassNames, DivineDomain, StatusEffects } from '@/_models';

describe('Class Utils', () => {
	const mock0 = mockCharacters[0];
	const mockCleric: Partial<CharacterClass> = {
		classAbilities: [
			{className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 1, domain: DivineDomain.Air},
			{className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 3, domain: DivineDomain.Death},
			{className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 2, domain: DivineDomain.Fire},
		]
	};

	it('should get class abilities', () => {
		expect(classUtils.getClassAbilities(mock0).length).toBe(3);
	});
	it('should reduce character speeds', () => {
		/* @ts-ignore */
		expect(classUtils.reduceSpeed(mock0.movementSpeeds)).toStrictEqual([{type: 'Land', speed: 20}, {type: 'Climb', speed: 20}])
		expect(classUtils.reduceSpeed(mock0.movementSpeeds, 'half')).toStrictEqual([{type: 'Land', speed: 10}, {type: 'Climb', speed: 10}])
		expect(classUtils.reduceSpeed(mock0.movementSpeeds, 'quarter')).toStrictEqual([{type: 'Land', speed: 5}, {type: 'Climb', speed: 5}])
	})
	it('should correctly check for half movement', () => {
		expect(classUtils.checkForHalfMovement({...mock0, statusEffects: [StatusEffects.Blinded]})).toStrictEqual([{type: 'Land', speed: 10}, {type: 'Climb', speed: 10}])
		expect(classUtils.checkForHalfMovement(mock0)).toStrictEqual([{type: 'Land', speed: 20}, {type: 'Climb', speed: 20}])
	})
	it('should get the correct initiative score', () => {
		expect(classUtils.getInitiativeScore(mock0)).toBe('+4')
		expect(classUtils.getInitiativeScore({...mock0, attributes: {...mock0.attributes, Dexterity: {value: 10}}})).toBe('0')
		expect(classUtils.getInitiativeScore({...mock0, attributes: {...mock0.attributes, Dexterity: {value: 7}}})).toBe('-1')
	})
	it('should get correct allegiance for cleric domains', () => {
		const mockAllegianceObject = {
			[DivineDomain.Air]: 1,
			[DivineDomain.Earth]: 0,
			[DivineDomain.Fire]: 2,
			[DivineDomain.Water]: 0,
			[DivineDomain.Deception]: 0,
			[DivineDomain.Truth]: 0,
			[DivineDomain.Magic]: 0,
			[DivineDomain.Mind]: 0,
			[DivineDomain.War]: 0,
			[DivineDomain.Peace]: 0,
			[DivineDomain.Life]: 0,
			[DivineDomain.Death]: 3,
			[DivineDomain.Cosmic]: 0
		}
		expect(classUtils.getAllegianceTotal(mockCleric as CharacterClass)).toStrictEqual(mockAllegianceObject)
	})
	it('should sort divine domains by value', () => {
		expect(classUtils.sortDomainAspects(mockCleric as CharacterClass).slice(0, 3)).toStrictEqual(['Death', 'Fire', 'Air'])
	})
});
