import { mockCharacters } from '@/_mockData/characters';
import * as classUtils from './classUtils';
import { StatusEffects } from '@/_models';

describe('Class Utils', () => {
	const mock0 = mockCharacters[0];
	it('should get class abilities', () => {
		expect(classUtils.getClassAbilities(mock0).length).toBe(3);
	});
	it('should reduce character speeds', () => {
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
});
