import { mockCharacters } from '@/_mockData/characters';
import * as classUtils from './classUtils';
import { CharacterClass, CharacterClassNames, ClassAbility, DivineDomain, Feat, StatusEffects } from '@/_models';

describe('Class Utils', () => {
	const mock0 = mockCharacters[0];
	const mockCleric: Partial<CharacterClass> = {
		name: CharacterClassNames.Cleric,
		classAbilities: [
			{className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 1, domain: DivineDomain.Air},
			{className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 3, domain: DivineDomain.Death},
			{className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 2, domain: DivineDomain.Fire},
		]
	};
	const mock0WithCleric = {...mock0, classes: [...mock0.classes, mockCleric as CharacterClass]};
	it('should get all class abilities', () => {
		expect(classUtils.getAllClassAbilities(mock0).length).toBe(3);
	});
	it('should return class abilities for each class', () => {
		expect(classUtils.getClassAbilities(mock0.classes)).toStrictEqual({
			[CharacterClassNames.Rogue]: mock0.classes[0].classAbilities,
			[CharacterClassNames.Oathsworn]: mock0.classes[1].classAbilities,
		})
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
			[DivineDomain.Fire]: 3,
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
		expect(classUtils.getAllegianceTotal({...mock0WithCleric, feats: [...mock0.feats, {name: 'Improved Counterchannel', selectedOption: DivineDomain.Fire, requiredOption: true} as Feat]})).toStrictEqual(mockAllegianceObject)
	})
	it('should sort divine domains by value', () => {
		expect(classUtils.getAlignedDomainAspects(mock0WithCleric)).toStrictEqual(['Death', 'Fire', 'Air', 'Deception', 'Earth'])
	});
	it('should return orisons related to the allegiant domains', () => {
		const mockOrisonList: ClassAbility[] = [
			{level: 0, domain: DivineDomain.Fire, className: CharacterClassNames.Cleric, description: ''},
			{level: 0, domain: DivineDomain.Air, className: CharacterClassNames.Cleric, description: ''},
			{level: 0, domain: DivineDomain.Death, className: CharacterClassNames.Cleric, description: ''},
			{level: 0, domain: DivineDomain.War, className: CharacterClassNames.Cleric, description: ''},
			{level: 0, domain: DivineDomain.Peace, className: CharacterClassNames.Cleric, description: ''},
		]
		const expectObject = [
			{level: 0, domain: DivineDomain.Fire, className: CharacterClassNames.Cleric, description: ''},
			{level: 0, domain: DivineDomain.Air, className: CharacterClassNames.Cleric, description: ''},
			{level: 0, domain: DivineDomain.Death, className: CharacterClassNames.Cleric, description: ''},
		]
		expect(classUtils.getAlignedOrisons(mock0, mockOrisonList).length).toBe(3);
		expect(classUtils.getAlignedOrisons(mock0, mockOrisonList)).toStrictEqual(expectObject);
	});
});
