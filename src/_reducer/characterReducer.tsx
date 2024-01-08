import { CharacterAttributes, AttributeNames, CharacterClass, CharacterKeys, SkillTypes, Character, Sizes, SkillObject, Modifier, Feat, Equipment, Armor, Weapon, SpellObject, CharacterClassNames, AnyMagickType, Magick, Note } from "@/_models";
import initialSkillsState from "./initialSkillsState";
import * as R from 'ramda';
import { Reducer } from "react";

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
	UPDATE_EQUIPMENT = 'UPDATE_EQUIPMENT',
	LEARN_SPELL = 'LEARN_SPELL',
	PREPARE_SPELL = 'PREPARE_SPELL',
	ADD_NOTE = 'ADD_NOTE',
	UPDATE_NOTE = 'UPDATE_NOTE',
	DELETE_NOTE = 'DELETE_NOTE',
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

type AcceptedUpdateValues = string | number | boolean | CharacterClass[] | Modifier[] | Modifier | Character | Feat[] | Equipment | AnyMagickType | Note;

export type CharacterAction = {
	type: CharacterReducerActions;
	payload: {
		key: CharacterKeys | keyof Equipment | keyof Weapon | keyof Armor;
		updateId?: string;
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

export const updateEquipmentAction = (
	updateId: string,
	value: string | number | Modifier[],
	key: keyof Equipment | keyof Weapon | keyof Armor
) : CharacterAction => {
	return {
		type: CharacterReducerActions.UPDATE_EQUIPMENT,
		payload: {
			updateId,
			key,
			value
		}
	}
};

export const learnSpellAction = (
	value: AnyMagickType,
	className: CharacterClassNames
): CharacterAction => {
	return {
		type: CharacterReducerActions.LEARN_SPELL,
		payload: {
			value,
			key: CharacterKeys.spellBook,
			updateId: className
		}
	}
}

export const prepareSpellAction = (
	value: AnyMagickType,
	className: CharacterClassNames
): CharacterAction => {
	return {
		type: CharacterReducerActions.PREPARE_SPELL,
		payload: {
			value,
			key: CharacterKeys.spellBook,
			updateId: className
		}
	}
}

export const addNoteAction = (value: Note): CharacterAction => {
	return {
		type: CharacterReducerActions.ADD_NOTE,
		payload: {
			value,
			key: CharacterKeys.notes
		}
	}
}

export const updateNoteAction = (value: string, id: string): CharacterAction => {
	return {
		type: CharacterReducerActions.UPDATE_NOTE,
		payload: {
			value,
			key: CharacterKeys.notes,
			updateId: id
		}
	}
}
export const deleteNoteAction = (value: string): CharacterAction => {
	return {
		type: CharacterReducerActions.DELETE_NOTE,
		payload: {
			value,
			key: CharacterKeys.notes,
		}
	}
}

export const resetAction = () => {
	return {
		type: CharacterReducerActions.RESET,
		payload: { key: CharacterKeys.miscModifiers, value: '' },
	};
};

const initialSpellBook:SpellObject = {
	[CharacterClassNames.Cleric]: [],
	[CharacterClassNames.Fighter]: [],
	[CharacterClassNames.Hexblade]: [],
	[CharacterClassNames.Oathsworn]: [],
	[CharacterClassNames.Psion]: [],
	[CharacterClassNames.PsychicWarrior]: [],
	[CharacterClassNames.Shadowcaster]: [],
	[CharacterClassNames.SorcWiz]: [],
}
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
	isPsionic: false,
	powerPoints: 0,
	maxPowerPoints: 0,
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
	spellBook: initialSpellBook,
	notes: [],
	heroPoints: 0
};

export const characterReducer: Reducer<Character, CharacterAction> = (state, action): Character => {
	const { payload } = action;
	const { value, updateId, key, attribute, skill } = payload;
	switch (action.type) {
		case CharacterReducerActions.SET_CHARACTER:
			const newChar = value as Character; 
			return newChar;
		case CharacterReducerActions.UPDATE:
			return { ...state, [payload.key]: payload.value };
		case CharacterReducerActions.UPDATEATTRIBUTE:
			if (!!attribute) {
				return {
					...state,
					attributes: {
						...state.attributes,
						[attribute]: {
							value: Number(payload.value),
						},
					},
				};
			}
		case CharacterReducerActions.UPDATESKILL:
			if (!!skill) {
				return {
					...state,
					skills: {
						...state.skills,
						[skill]: {
							...state.skills[skill as keyof SkillObject],
							ranks: value,
						},
					},
				};
			}
		case CharacterReducerActions.DELETE_MOD:
				if(value){
					const deleteValue = value as Modifier;
					return {
						...state,
						miscModifiers: state.miscModifiers.filter(x => !R.equals(x, deleteValue))
					}
				}
		case CharacterReducerActions.TOGGLE_EQUIPPED:
				if(value){
					const toggleValue = value as Equipment;
					const index = R.findIndex(R.propEq(toggleValue.name, 'name'))(state.equipment);
					const eq = state.equipment[index] as Armor;
					const updatedEq = {...eq, equipped: !eq.equipped}
					return {
						...state,
						equipment: R.update(index, updatedEq, state.equipment)
					}
				}
		case CharacterReducerActions.ADD_EQUIPMENT:
			if(value){
				const addEqValue = value as Equipment;
				return {
					...state,
					equipment: [...state.equipment, addEqValue]
				}
			}
		case CharacterReducerActions.REMOVE_EQUIPMENT:
			if(value){
				const removeEqValue = value as Equipment;
				const filter = (x: Equipment) => x.id !== removeEqValue.id;
				return {
					...state,
					equipment: R.filter(filter, state.equipment)
				}
			}
		case CharacterReducerActions.UPDATE_EQUIPMENT:
			if(updateId){
				const index = R.findIndex(R.propEq(updateId, 'id'))(state.equipment);
				const newObject: Equipment = {...state.equipment[index], [key]: value} as Equipment;
				return {...state, equipment: R.update(index, newObject, state.equipment)}
			}
		case CharacterReducerActions.LEARN_SPELL:
			const spell = value as AnyMagickType;
			const spellAlreadyKnown = R.findIndex(R.propEq(spell.name, 'name'))(state.spellBook[updateId as keyof SpellObject]);
			const className = updateId as keyof SpellObject;
			if(spellAlreadyKnown != -1){
				const filter = (x: AnyMagickType) => x.name !== spell.name;
				return {...state, spellBook: {...state.spellBook, [className]: R.filter(filter, state.spellBook[className])}}
			} else {
				const newSpellAdded = R.append(value, state.spellBook[className])
				return {...state, spellBook: {...state.spellBook, [className]: newSpellAdded}}
			}
		case CharacterReducerActions.PREPARE_SPELL:
			const preparedSpell = value as AnyMagickType;
			const classNamePrepare = updateId as keyof SpellObject;
			const spellIndex = R.findIndex(R.propEq(preparedSpell.name, 'name'))(state.spellBook[updateId as keyof SpellObject]);
			const updateSpell = state.spellBook[classNamePrepare][spellIndex] as Magick;
			const updatedClassArray = R.update(spellIndex, {...updateSpell, prepared: (value as Magick).prepared} as AnyMagickType, state.spellBook[classNamePrepare])
			return {...state, spellBook: {...state.spellBook, [classNamePrepare]: updatedClassArray}}
		case CharacterReducerActions.ADD_NOTE:
			return {...state, notes: R.append(value as Note, state.notes)}
		case CharacterReducerActions.UPDATE_NOTE:
			const noteIndex = R.findIndex(R.propEq(updateId, 'id'))(state.notes);
			const updatedNote = {...state.notes[noteIndex], note: value} as Note;
			return {...state, notes: R.update(noteIndex, updatedNote, state.notes)}
		case CharacterReducerActions.DELETE_NOTE:
			return {...state, notes: R.reject(R.propEq(value, 'id'))(state.notes)}
		case CharacterReducerActions.RESET:
			return initialCharacterState;
		default:
			return state;
	}
};
