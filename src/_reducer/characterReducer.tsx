import { CharacterAttributes, AttributeNames, CharacterClass, CharacterKeys, SkillTypes, Character, Sizes, SkillObject, Modifier } from "@/_models";
import initialSkillsState from "./initialSkillsState";

export enum CharacterReducerActions {
	UPDATE = 'UPDATE',
	UPDATEATTRIBUTE = 'UPDATEATTRIBUTE',
	UPDATESKILL = 'UPDATESKILL',
	RESET = 'RESET',
	DEFAULT = 'DEFAULT'
}

const initialAttributes: CharacterAttributes = {
	[AttributeNames.Strength]: {
		value: 0,
		modifiers: [],
	},
	[AttributeNames.Dexterity]: {
		value: 0,
		modifiers: [],
	},
	[AttributeNames.Constitution]: {
		value: 0,
		modifiers: [],
	},
	[AttributeNames.Intelligence]: {
		value: 0,
		modifiers: [],
	},
	[AttributeNames.Wisdom]: {
		value: 0,
		modifiers: [],
	},
	[AttributeNames.Charisma]: {
		value: 0,
		modifiers: [],
	},
};

type AcceptedUpdateValues = string | number | CharacterClass[] | Modifier[];

export type CharacterAction = {
	type: CharacterReducerActions;
	payload: {
		key: CharacterKeys;
		attribute?: AttributeNames;
		skill?: SkillTypes;
		value: AcceptedUpdateValues;
	};
};

export const updateAction = (
	key: CharacterKeys,
	value: AcceptedUpdateValues
) => {
	return {
		type: CharacterReducerActions.UPDATE,
		payload: {
			key,
			value,
		},
	};
};

export const updateAttributeAction = (
	attribute: AttributeNames,
	value: number
): CharacterAction => {
	return {
		type: CharacterReducerActions.UPDATEATTRIBUTE,
		payload: {
			key: CharacterKeys.attributes,
			value,
			attribute,
		},
	};
};

export const updateSkillAction = (
	skill: SkillTypes,
	value: number
): CharacterAction => {
	return {
		type: CharacterReducerActions.UPDATESKILL,
		payload: {
			key: CharacterKeys.skills,
			value,
			skill,
		},
	};
};

export const resetAction = () => {
	return {
		type: CharacterReducerActions.RESET,
		payload: { key: CharacterKeys.miscModifiers, value: '' },
	};
};

export const initialCharacterState: Character = {
	name: '',
	race: '',
	size: Sizes.Medium,
	subRace: '',
	movementSpeeds: [],
	attributes: initialAttributes,
	classes: [],
	maxHitPoints: 0,
	currentHitPoints: 0,
	nonLethalDamage: 0,
	tempHP: 0,
	age: 0,
	height: '',
	weight: 0,
	eyeColor: '',
	hairColor: '',
	languages: [],
	skills: initialSkillsState,
	equipment: [],
	miscModifiers: [],
	playerName: '',
};

export const characterReducer = (state: Character, action: CharacterAction) => {
	const { payload } = action;
	switch (action.type) {
		case CharacterReducerActions.UPDATE:
			return { ...state, [payload.key]: payload.value };
		case CharacterReducerActions.UPDATEATTRIBUTE:
			if (!!payload.attribute) {
				return {
					...state,
					attributes: {
						...state.attributes,
						[payload.attribute]: {
							value: Number(payload.value),
						},
					},
				};
			}
		case CharacterReducerActions.UPDATESKILL:
			if (!!payload.skill) {
				return {
					...state,
					skills: {
						...state.skills,
						[payload.skill]: {
							...state.skills[payload.skill as keyof SkillObject],
							ranks: payload.value,
						},
					},
				};
			}
		case CharacterReducerActions.RESET:
			return initialCharacterState;
		default:
			return state;
	}
};
