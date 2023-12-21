import { CharacterKeys, AttributeNames, SkillTypes } from '@/_models';
import {
	CharacterReducerActions,
	characterReducer,
	initialCharacterState,
	resetAction,
	updateAction,
	updateAttributeAction,
	updateSkillAction,
} from './characterReducer';

describe('characterReducer', () => {
	it('should update character keys correctly', () => {
		const name = 'Kyrin';
		const newState = characterReducer(
			initialCharacterState,
			updateAction(CharacterKeys.name, name)
		);
		expect(newState.name).toBe(name);
	});
	it('should update attributes correctly', () => {
		const newState = characterReducer(
			initialCharacterState,
			updateAttributeAction(AttributeNames.Strength, 12)
		);
		expect(newState.attributes.Strength.value).toBe(12);
		expect(initialCharacterState.attributes.Wisdom).toBe(
			initialCharacterState.attributes.Wisdom
		);
		expect(initialCharacterState.attributes.Charisma).toBe(
			initialCharacterState.attributes.Charisma
		);
	});
	it('should update skills correctly', () => {
		const newState = characterReducer(
			initialCharacterState,
			updateSkillAction(SkillTypes.Acrobatics, 12)
		);
		expect(newState.skills.Acrobatics).toStrictEqual({ ranks: 12, linkedAttribute: 'Dexterity', name: 'Acrobatics' });
		expect(initialCharacterState.skills.Perform).toBe(
			initialCharacterState.skills.Perform
		);
		expect(initialCharacterState.skills.Perception).toBe(
			initialCharacterState.skills.Perception
		);
	});
	it('should reset to initial', () => {
		const name = 'Kyrin';
		const newState = characterReducer(
			initialCharacterState,
			updateAction(CharacterKeys.name, name)
		);
		const updateState = characterReducer(
			newState,
			updateAttributeAction(AttributeNames.Strength, 12)
		);
		const update2State = characterReducer(
			updateState,
			updateSkillAction(SkillTypes.Acrobatics, 12)
		);
		expect(update2State.attributes.Strength.value).toBe(12);
		expect(update2State.skills.Acrobatics).toStrictEqual({ ranks: 12, linkedAttribute: 'Dexterity', name: 'Acrobatics' });
		expect(update2State.name).toBe(name);
		const finalState = characterReducer(update2State, resetAction());
		expect(finalState).toStrictEqual(initialCharacterState);
	});
	it('should return state if not covered by switch', () => {
		expect(characterReducer(initialCharacterState, {
			type: CharacterReducerActions.DEFAULT,
			payload: {
				key: CharacterKeys.age,
				value: ''
			}})).toStrictEqual(initialCharacterState);
	})
});
