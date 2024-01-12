import { Modifier, StatusEffects, BonusTypes, AttributeNames, Character, SkillTypes } from "@/_models";
import { v4 as uuidv4 } from 'uuid';

const getExhaustedModifiers = (character: Character): Modifier[] => character.statusEffects.includes(StatusEffects.Exhausted) ? [
    {id: uuidv4(), type: BonusTypes.Untyped, value: -6, attribute: AttributeNames.Dexterity, statusEffect: StatusEffects.Exhausted},
    {id: uuidv4(), type: BonusTypes.Untyped, value: -6, attribute: AttributeNames.Strength, statusEffect: StatusEffects.Exhausted},
] : [];

const getEntangledModifiers = (character: Character): Modifier[] => character.statusEffects.includes(StatusEffects.Entangled) ? [
    {id: uuidv4(), type: BonusTypes.Untyped, value: -4, attribute: AttributeNames.Dexterity, statusEffect: StatusEffects.Entangled},
    {id: uuidv4(), type: BonusTypes.Untyped, value: -2, attack: true, statusEffect: StatusEffects.Entangled},
] : [];

const getDazzledModifiers = (character: Character): Modifier[] => character.statusEffects.includes(StatusEffects.Dazzled) ? [
    {id: uuidv4(), type: BonusTypes.Untyped, value: -2, skill: SkillTypes.Perception, statusEffect: StatusEffects.Dazzled},
    {id: uuidv4(), type: BonusTypes.Untyped, value: -2, attack: true, statusEffect: StatusEffects.Entangled},
] : [];

export { getExhaustedModifiers, getEntangledModifiers, getDazzledModifiers };