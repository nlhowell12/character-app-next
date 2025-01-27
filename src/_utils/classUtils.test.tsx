import { mockCharacters } from '@/_mockData/characters';
import * as classUtils from './classUtils';
import { AttributeNames, Character, CharacterClass, CharacterClassNames, ClassAbility, DivineDomain, Feat, StatusEffects } from '@/_models';
import { DomainAspectFeats } from './classUtils';

describe('Class Utils', () => {
	const mock0 = mockCharacters[0];
	const mockCleric: Partial<CharacterClass> = {
		name: CharacterClassNames.Cleric,
		classAbilities: [
			{name: '', className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 1, domain: DivineDomain.Air},
			{name: '', className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 3, domain: DivineDomain.Death},
			{name: '', className: CharacterClassNames.Cleric, level: 1, description: '', allegianceValue: 2, domain: DivineDomain.Fire},
		],
		rebukeDomain: DivineDomain.Deception,
		turnDomain: DivineDomain.Peace,
		spontaneousChannelDomain: DivineDomain.Life,
		preferredDomains: [DivineDomain.Life]
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
		expect(classUtils.getInitiativeScore(mock0)).toBe('+3')
		expect(classUtils.getInitiativeScore({...mock0, attributes: {...mock0.attributes, Dexterity: {value: 10}}})).toBe('0')
		expect(classUtils.getInitiativeScore({...mock0, attributes: {...mock0.attributes, Dexterity: {value: 7}}})).toBe('-2')
	})
	it('should get correct allegiance for cleric domains', () => {
		const mockAllegianceObject = {
			[DivineDomain.Air]: 1,
			[DivineDomain.Earth]: 0,
			[DivineDomain.Fire]: 3,
			[DivineDomain.Water]: 0,
			[DivineDomain.Deception]: 2,
			[DivineDomain.Truth]: 0,
			[DivineDomain.Magic]: 0,
			[DivineDomain.Mind]: 0,
			[DivineDomain.War]: 0,
			[DivineDomain.Peace]: 3,
			[DivineDomain.Life]: 1,
			[DivineDomain.Death]: 3,
			[DivineDomain.Cosmic]: 0
		}
		expect(classUtils.getAllegianceTotal({...mock0WithCleric, feats: [...mock0.feats, {name: DomainAspectFeats.ImprovedCounterchannel, selectedOption: DivineDomain.Fire, requiredOption: true} as Feat]})).toStrictEqual(mockAllegianceObject)
	})
	it('should sort divine domains by value', () => {
		expect(classUtils.getAlignedDomainAspects(mock0WithCleric)).toStrictEqual([DivineDomain.Death, DivineDomain.Peace, DivineDomain.Deception, DivineDomain.Fire, DivineDomain.Life])
	});
	it('should return orisons related to the allegiant domains', () => {
		const mockOrisonList: ClassAbility[] = [
			{name: '', level: 0, domain: DivineDomain.Fire, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Air, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Death, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.War, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Peace, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Life, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Deception, className: CharacterClassNames.Cleric, description: ''},
		]
		const expectObject = [
			{name: '', level: 0, domain: DivineDomain.Fire, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Death, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Peace, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Life, className: CharacterClassNames.Cleric, description: ''},
			{name: '', level: 0, domain: DivineDomain.Deception, className: CharacterClassNames.Cleric, description: ''},

		]
		expect(classUtils.getAlignedOrisons(mock0WithCleric, mockOrisonList).length).toBe(5);
		expect(classUtils.getAlignedOrisons(mock0WithCleric, mockOrisonList)).toStrictEqual(expectObject);
	});
	it('should correctly determine a hexblades curse DC', () => {
		const hexblade = {...mock0, classes: [...mock0.classes, {name: CharacterClassNames.Hexblade, level: 10}]} as Character;
		const hexblade2 = {...mock0, attributes: {...mock0.attributes, [AttributeNames.Charisma]: {value: 20}}, classes: [...mock0.classes, {name: CharacterClassNames.Hexblade, level: 10}]} as Character;
		const hexblade3 = {...mock0, attributes: {...mock0.attributes, [AttributeNames.Charisma]: {value: 20}}, classes: [...mock0.classes, {name: CharacterClassNames.Hexblade, level: 1}]} as Character;
		expect(classUtils.getHexbladeCurseDC(mock0)).toStrictEqual(null); //Not a hexblade
		expect(classUtils.getHexbladeCurseDC(hexblade)).toBe(16);
		expect(classUtils.getHexbladeCurseDC(hexblade2)).toBe(21);
		expect(classUtils.getHexbladeCurseDC(hexblade3)).toBe(16);
	})
	it('should get total class levels correctly', () => {
		const mock1 = {...mock0, classes: [...mock0.classes, {name: CharacterClassNames.Shadowcaster, level: 23}]} as Character;
		expect(classUtils.getTotalClassLevels(mock0)).toBe(2)
		expect(classUtils.getTotalClassLevels(mock1)).toBe(25)
	})
	it('should find if a character has a martial class', () => {
		const rogue = {...mock0, classes: [mock0.classes[0]]} as Character;
		const hexblade = {...mock0, classes: [...mock0.classes, {name: CharacterClassNames.Hexblade, level: 10}]} as Character;
		const oathsworn = {...mock0, classes: [...mock0.classes, {name: CharacterClassNames.Oathsworn, level: 10}]} as Character;
		const fighter = {...mock0, classes: [...mock0.classes, {name: CharacterClassNames.Fighter, level: 10}]} as Character;
		const psyWar = {...mock0, classes: [...mock0.classes, {name: CharacterClassNames.PsychicWarrior, level: 10}]} as Character;

		expect(classUtils.hasMartialClass(rogue)).toBeFalsy();
		expect(classUtils.hasMartialClass(hexblade)).toBeTruthy()
		expect(classUtils.hasMartialClass(oathsworn)).toBeTruthy()
		expect(classUtils.hasMartialClass(fighter)).toBeTruthy()
		expect(classUtils.hasMartialClass(psyWar)).toBeTruthy()
	})
});
