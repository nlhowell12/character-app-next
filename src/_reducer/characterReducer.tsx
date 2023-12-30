import { CharacterAttributes, AttributeNames, CharacterClass, CharacterKeys, SkillTypes, Character, Sizes, SkillObject, Modifier, Feat, Equipment, Armor } from "@/_models";
import initialSkillsState from "./initialSkillsState";
import * as R from 'ramda';

export enum CharacterReducerActions {
	SET_CHARACTER = 'SET_CHARACTER',
	UPDATE = 'UPDATE',
	UPDATEATTRIBUTE = 'UPDATEATTRIBUTE',
	UPDATESKILL = 'UPDATESKILL',
	RESET = 'RESET',
	DELETE_MOD = 'DELETE_MOD',
	TOGGLE_EQUIPPED = 'TOGGLE_EQUIPPED',
	ADD_EQUIPMENT = 'ADD_EQUIPMENT',
	REMOVE_EQUIPMENT = 'REMOVE_EQUIPMENT',
	DEFAULT = 'DEFAULT'
}

const initialAttributes: CharacterAttributes = {
	[AttributeNames.Strength]: {
		value: 0,
	},
	[AttributeNames.Dexterity]: {
		value: 0,
	},
	[AttributeNames.Constitution]: {
		value: 0,
	},
	[AttributeNames.Intelligence]: {
		value: 0,
	},
	[AttributeNames.Wisdom]: {
		value: 0,
	},
	[AttributeNames.Charisma]: {
		value: 0,
	},
};

type AcceptedUpdateValues = string | number | CharacterClass[] | Modifier[] | Modifier | Character | Feat[] | Equipment;

export type CharacterAction = {
	type: CharacterReducerActions;
	payload: {
		key: CharacterKeys;
		attribute?: AttributeNames;
		skill?: SkillTypes;
		value: AcceptedUpdateValues;
	};
};

export const setCharacterAction = (
	value: Character
) => {
	return {
		type: CharacterReducerActions.SET_CHARACTER,
		payload: {
			key: CharacterKeys.name,
			value
		}
	}
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

export const deleteModAction = (
	value: Modifier
) : CharacterAction => {
	return {
		type: CharacterReducerActions.DELETE_MOD,
		payload: {
			key: CharacterKeys.miscModifiers,
			value
		}
	}
};

export const toggleEquippedAction = (
	value: Equipment
) : CharacterAction => {
	return {
		type: CharacterReducerActions.TOGGLE_EQUIPPED,
		payload: {
			key: CharacterKeys.equipment,
			value
		}
	}
};

export const addEquipmentAction = (
	value: Equipment
) : CharacterAction => {
	return {
		type: CharacterReducerActions.ADD_EQUIPMENT,
		payload: {
			key: CharacterKeys.equipment,
			value
		}
	}
};

export const removeEquipmentAction = (
	value: Equipment
) : CharacterAction => {
	return {
		type: CharacterReducerActions.REMOVE_EQUIPMENT,
		payload: {
			key: CharacterKeys.equipment,
			value
		}
	}
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
	experience: 0,
	feats: [],
};

export const characterReducer = (state: Character, action: CharacterAction) => {
	const { payload } = action;
	switch (action.type) {
		case CharacterReducerActions.SET_CHARACTER:
			const value = payload.value as Character; 
			return value;
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
		case CharacterReducerActions.DELETE_MOD:
				if(payload.value){
					const value = payload.value as Modifier;
					return {
						...state,
						miscModifiers: state.miscModifiers.filter(x => !R.equals(x, value))
					}
				}
		case CharacterReducerActions.TOGGLE_EQUIPPED:
				if(payload.value){
					const value = payload.value as Equipment;
					const index = R.findIndex(R.propEq(value.name, 'name'))(state.equipment);
					const eq = state.equipment[index] as Armor;
					const updatedEq = {...eq, equipped: !eq.equipped}
					return {
						...state,
						equipment: R.update(index, updatedEq, state.equipment)
					}
				}
		case CharacterReducerActions.ADD_EQUIPMENT:
			if(payload.value){
				const value = payload.value as Equipment;
				return {
					...state,
					equipment: [...state.equipment, value]
				}
			}
		case CharacterReducerActions.REMOVE_EQUIPMENT:
			if(payload.value){
				const value = payload.value as Equipment;
				const filter = (x: Equipment) => x.id !== value.id;
				return {
					...state,
					equipment: R.filter(filter, state.equipment)
				}
			}
		case CharacterReducerActions.RESET:
			return initialCharacterState;
		default:
			return state;
	}
};
