import {
    CharacterAttributes,
    AttributeNames,
    CharacterClass,
    CharacterKeys,
    SkillTypes,
    Character,
    Sizes,
    SkillObject,
    Modifier,
    Feat,
    Equipment,
    Armor,
    Weapon,
    SpellObject,
    CharacterClassNames,
    AnyMagickType,
    Magick,
    Note,
    Movement,
    Currency,
    MartialQueue,
    Maneuver,
    ClassAbility,
} from '@/_models';
import initialSkillsState from './initialSkillsState';
import * as R from 'ramda';
import { Reducer } from 'react';

export enum CharacterReducerActions {
    SET_CHARACTER = 'SET_CHARACTER',
    UPDATE = 'UPDATE',
    UPDATEATTRIBUTE = 'UPDATEATTRIBUTE',
    UPDATESKILL = 'UPDATESKILL',
    UPDATECLASSABILITIES = 'UPDATECLASSABILITIES',
    RESET = 'RESET',
    DELETE_MOD = 'DELETE_MOD',
    TOGGLE_EQUIPPED = 'TOGGLE_EQUIPPED',
    ADD_EQUIPMENT = 'ADD_EQUIPMENT',
    REMOVE_EQUIPMENT = 'REMOVE_EQUIPMENT',
    UPDATE_EQUIPMENT = 'UPDATE_EQUIPMENT',
    REPLACE_EQUIPMENT = 'REPLACE_EQUIPMENT',
    LEARN_SPELL = 'LEARN_SPELL',
    PREPARE_SPELL = 'PREPARE_SPELL',
    MARTIAL_QUEUE = 'MARTIAL_QUEUE',
    ADD_NOTE = 'ADD_NOTE',
    UPDATE_NOTE = 'UPDATE_NOTE',
    DELETE_NOTE = 'DELETE_NOTE',
    ADD_MOVEMENT = 'ADD_MOVEMENT',
    REMOVE_MOVEMENT = 'REMOVE_MOVEMENT',
    DEFAULT = 'DEFAULT',
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

type AcceptedUpdateValues =
    | string
    | string[]
    | number
    | boolean
    | CharacterClass[]
    | Modifier[]
    | Modifier
    | Character
    | Feat[]
    | Equipment
    | AnyMagickType
    | Note
    | Movement
    | Currency
    | ClassAbility;

export type CharacterAction = {
    type: CharacterReducerActions;
    payload: {
        key: CharacterKeys | keyof Equipment | keyof Weapon | keyof Armor;
        updateId?: string;
        attribute?: AttributeNames;
        className?: CharacterClassNames;
        skill?: SkillTypes;
        value: AcceptedUpdateValues;
    };
};

export const setCharacterAction = (value: Character) => {
    return {
        type: CharacterReducerActions.SET_CHARACTER,
        payload: {
            key: CharacterKeys.name,
            value,
        },
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

export const updateClassAbilityAction = (
    className: CharacterClassNames,
    value: ClassAbility
): CharacterAction => {
    return {
        type: CharacterReducerActions.UPDATECLASSABILITIES,
        payload: {
            key: CharacterKeys.classes,
            className,
            value,
        },
    };
};

export const deleteModAction = (value: Modifier): CharacterAction => {
    return {
        type: CharacterReducerActions.DELETE_MOD,
        payload: {
            key: CharacterKeys.miscModifiers,
            value,
        },
    };
};

export const toggleEquippedAction = (value: Equipment): CharacterAction => {
    return {
        type: CharacterReducerActions.TOGGLE_EQUIPPED,
        payload: {
            key: CharacterKeys.equipment,
            value,
        },
    };
};

export const addEquipmentAction = (value: Equipment): CharacterAction => {
    return {
        type: CharacterReducerActions.ADD_EQUIPMENT,
        payload: {
            key: CharacterKeys.equipment,
            value,
        },
    };
};

export const removeEquipmentAction = (value: Equipment): CharacterAction => {
    return {
        type: CharacterReducerActions.REMOVE_EQUIPMENT,
        payload: {
            key: CharacterKeys.equipment,
            value,
        },
    };
};

export const updateEquipmentAction = (
    updateId: string,
    value: string | number | Modifier[],
    key: keyof Equipment | keyof Weapon | keyof Armor
): CharacterAction => {
    return {
        type: CharacterReducerActions.UPDATE_EQUIPMENT,
        payload: {
            updateId,
            key,
            value,
        },
    };
};

export const replaceEquipmentAction = (
    updateId: string,
    value: Equipment
): CharacterAction => {
    return {
        type: CharacterReducerActions.REPLACE_EQUIPMENT,
        payload: {
            key: CharacterKeys.equipment,
            updateId,
            value,
        },
    };
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
            updateId: className,
        },
    };
};

export const prepareSpellAction = (
    value: AnyMagickType,
    className: CharacterClassNames
): CharacterAction => {
    return {
        type: CharacterReducerActions.PREPARE_SPELL,
        payload: {
            value,
            key: CharacterKeys.spellBook,
            updateId: className,
        },
    };
};
export const martialQueueAction = (
    value: AnyMagickType,
    className: CharacterClassNames
): CharacterAction => {
    return {
        type: CharacterReducerActions.MARTIAL_QUEUE,
        payload: {
            value,
            key: CharacterKeys.martialQueue,
            updateId: className,
        },
    };
};

export const addNoteAction = (value: Note): CharacterAction => {
    return {
        type: CharacterReducerActions.ADD_NOTE,
        payload: {
            value,
            key: CharacterKeys.notes,
        },
    };
};

export const updateNoteAction = (
    value: string,
    id: string
): CharacterAction => {
    return {
        type: CharacterReducerActions.UPDATE_NOTE,
        payload: {
            value,
            key: CharacterKeys.notes,
            updateId: id,
        },
    };
};
export const deleteNoteAction = (value: string): CharacterAction => {
    return {
        type: CharacterReducerActions.DELETE_NOTE,
        payload: {
            value,
            key: CharacterKeys.notes,
        },
    };
};
export const addMovementActions = (value: Movement): CharacterAction => {
    return {
        type: CharacterReducerActions.ADD_MOVEMENT,
        payload: {
            value,
            key: CharacterKeys.movementSpeeds,
        },
    };
};

export const removeMovementAction = (value: Movement): CharacterAction => {
    return {
        type: CharacterReducerActions.REMOVE_MOVEMENT,
        payload: {
            value,
            key: CharacterKeys.movementSpeeds,
        },
    };
};

export const resetAction = () => {
    return {
        type: CharacterReducerActions.RESET,
        payload: { key: CharacterKeys.miscModifiers, value: '' },
    };
};

const initialSpellBook: SpellObject = {
    [CharacterClassNames.Cleric]: [],
    [CharacterClassNames.Fighter]: [],
    [CharacterClassNames.Hexblade]: [],
    [CharacterClassNames.Oathsworn]: [],
    [CharacterClassNames.Psion]: [],
    [CharacterClassNames.PsychicWarrior]: [],
    [CharacterClassNames.Shadowcaster]: [],
    [CharacterClassNames.SorcWiz]: [],
};
const initialMartialQueue: MartialQueue = {
    [CharacterClassNames.Fighter]: [],
    [CharacterClassNames.Hexblade]: [],
    [CharacterClassNames.Oathsworn]: [],
    [CharacterClassNames.PsychicWarrior]: [],
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
    proficiencies: [],
    skills: initialSkillsState,
    equipment: [],
    currency: {
        cp: 0,
        sp: 0,
        gp: 0,
        pp: 0,
    },
    miscModifiers: [],
    playerName: '',
    experience: 0,
    feats: [],
    specialAbilities: [],
    spellBook: initialSpellBook,
    martialQueue: initialMartialQueue,
    notes: [],
    heroPoints: 0,
    statusEffects: []
};

export const characterReducer: Reducer<Character, CharacterAction> = (
    state,
    action
): Character => {
    const { payload } = action;
    const { value, updateId, key, attribute, skill, className } = payload;
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
        case CharacterReducerActions.UPDATECLASSABILITIES:
            const updateAbility = value as ClassAbility;
            if(!!className){
                const characterClass = R.find(R.propEq(className, 'name'))(state.classes) as CharacterClass;
                const characterClassIndex = R.findIndex(R.propEq(className, 'name'))(state.classes)
                const classAbilityIndex = !!characterClass && R.findIndex(R.propEq(updateAbility.description, 'description'))(characterClass.classAbilities);
                if(!!classAbilityIndex && classAbilityIndex > -1){
                    const updateAbilities: ClassAbility[] = R.reject(R.propEq(updateAbility.description, 'description'))(characterClass.classAbilities);
                    return {
                        ...state,
                        classes: R.update(characterClassIndex, {...state.classes[characterClassIndex], classAbilities: updateAbilities}, state.classes)
                    }
                } else {
                    const updateAbilities: ClassAbility[] = [...characterClass.classAbilities, updateAbility];
                    return {
                        ...state,
                        classes: R.update(characterClassIndex, {...state.classes[characterClassIndex], classAbilities: updateAbilities}, state.classes)
                    }
                }
            }
        case CharacterReducerActions.DELETE_MOD:
            if (value) {
                const deleteValue = value as Modifier;
                return {
                    ...state,
                    miscModifiers: state.miscModifiers.filter(
                        (x) => !R.equals(x, deleteValue)
                    ),
                };
            }
        case CharacterReducerActions.TOGGLE_EQUIPPED:
            if (value) {
                const toggleValue = value as Equipment;
                const index = R.findIndex(R.propEq(toggleValue.name, 'name'))(
                    state.equipment
                );
                const eq = state.equipment[index] as Armor;
                const updatedEq = { ...eq, equipped: !eq.equipped };
                return {
                    ...state,
                    equipment: R.update(index, updatedEq, state.equipment),
                };
            }
        case CharacterReducerActions.ADD_EQUIPMENT:
            if (value) {
                const addEqValue = value as Equipment;
                return {
                    ...state,
                    equipment: [...state.equipment, addEqValue],
                };
            }
        case CharacterReducerActions.REMOVE_EQUIPMENT:
            if (value) {
                const removeEqValue = value as Equipment;
                const filter = (x: Equipment) => x.id !== removeEqValue.id;
                return {
                    ...state,
                    equipment: R.filter(filter, state.equipment),
                };
            }
        case CharacterReducerActions.UPDATE_EQUIPMENT:
            if (updateId) {
                const index = R.findIndex(R.propEq(updateId, 'id'))(
                    state.equipment
                );
                const newObject: Equipment = {
                    ...state.equipment[index],
                    [key]: value,
                } as Equipment;
                return {
                    ...state,
                    equipment: R.update(index, newObject, state.equipment),
                };
            }
        case CharacterReducerActions.REPLACE_EQUIPMENT:
            if (updateId) {
                const index = R.findIndex(R.propEq(updateId, 'id'))(
                    state.equipment
                );
                const replaceEq = value as Equipment;
                return {
                    ...state,
                    equipment: R.update(index, replaceEq, state.equipment),
                };
            }
            return { ...state };
        case CharacterReducerActions.LEARN_SPELL:
            const spell = value as AnyMagickType;
            const spellAlreadyKnown = R.findIndex(R.propEq(spell.name, 'name'))(
                state.spellBook[updateId as keyof SpellObject]
            );
            const spellClassName = updateId as keyof SpellObject;
            if (spellAlreadyKnown != -1) {
                const filter = (x: AnyMagickType) => x.name !== spell.name;
                return {
                    ...state,
                    spellBook: {
                        ...state.spellBook,
                        [spellClassName]: R.filter(
                            filter,
                            state.spellBook[spellClassName]
                        ),
                    },
                    martialQueue: Object.keys(state.martialQueue).includes(spellClassName) ? {
                        ...state.martialQueue,
                        [spellClassName]: R.filter(
                            filter,
                            state.martialQueue[className as keyof MartialQueue]
                        ),
                    } : state.martialQueue
                };
            } else {
                const newSpellAdded = R.append(
                    value,
                    state.spellBook[spellClassName]
                );
                return {
                    ...state,
                    spellBook: {
                        ...state.spellBook,
                        [spellClassName]: newSpellAdded,
                    },
                };
            }
        case CharacterReducerActions.PREPARE_SPELL:
            const preparedSpell = value as AnyMagickType;
            const classNamePrepare = updateId as keyof SpellObject;
            const spellIndex = R.findIndex(
                R.propEq(preparedSpell.name, 'name')
            )(state.spellBook[updateId as keyof SpellObject]);
            const updateSpell = state.spellBook[classNamePrepare][
                spellIndex
            ] as Magick;
            const updatedClassArray = R.update(
                spellIndex,
                {
                    ...updateSpell,
                    prepared: (value as Magick).prepared,
                } as AnyMagickType,
                state.spellBook[classNamePrepare]
            );
            return {
                ...state,
                spellBook: {
                    ...state.spellBook,
                    [classNamePrepare]: updatedClassArray,
                },
            };
        case CharacterReducerActions.MARTIAL_QUEUE:
            const maneuver = value as Maneuver;
            const martialClass = updateId as keyof MartialQueue;
            const maneuverIndex = R.findIndex(
                R.propEq(maneuver.name, 'name')
            )(state.martialQueue[martialClass]);
            const filter = (x: Maneuver) => x.name !== maneuver.name
            if(maneuverIndex !== -1){
                return {...state, martialQueue: {...state.martialQueue, [martialClass]: R.filter(filter, state.martialQueue[martialClass])}}
            }
            return {...state, martialQueue: {...state.martialQueue, [martialClass]: [...state.martialQueue[martialClass], maneuver]}}
        case CharacterReducerActions.ADD_NOTE:
            return { ...state, notes: R.append(value as Note, state.notes) };
        case CharacterReducerActions.UPDATE_NOTE:
            const noteIndex = R.findIndex(R.propEq(updateId, 'id'))(
                state.notes
            );
            const updatedNote = {
                ...state.notes[noteIndex],
                note: value,
            } as Note;
            return {
                ...state,
                notes: R.update(noteIndex, updatedNote, state.notes),
            };
        case CharacterReducerActions.DELETE_NOTE:
            return {
                ...state,
                notes: R.reject(R.propEq(value, 'id'))(state.notes),
            };
        case CharacterReducerActions.ADD_MOVEMENT:
            return {
                ...state,
                movementSpeeds: R.append(
                    value as Movement,
                    state.movementSpeeds
                ),
            };
        case CharacterReducerActions.REMOVE_MOVEMENT:
            const removeSpeed = value as Movement;
            const speedFilter = (x: Movement) =>
                x.speed === removeSpeed.speed && x.type === removeSpeed.type;
            return {
                ...state,
                movementSpeeds: R.reject(speedFilter, state.movementSpeeds),
            };
        case CharacterReducerActions.RESET:
            return initialCharacterState;
        default:
            return state;
    }
};
