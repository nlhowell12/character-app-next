import {
    Modifier,
    StatusEffects,
    BonusTypes,
    AttributeNames,
    Character,
    SkillTypes,
} from '@/_models';
import { v4 as uuidv4 } from 'uuid';
import { totalAttributeValue } from './attributeUtils';

const getFatiguedModifiers = (character: Character): Modifier[] =>
    character.statusEffects.includes(StatusEffects.Fatigued)
        ? [
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  attribute: AttributeNames.Dexterity,
                  statusEffect: StatusEffects.Fatigued,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  attribute: AttributeNames.Strength,
                  statusEffect: StatusEffects.Fatigued,
              },
          ]
        : [];
const getExhaustedModifiers = (character: Character): Modifier[] =>
    character.statusEffects.includes(StatusEffects.Exhausted)
        ? [
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -6,
                  attribute: AttributeNames.Dexterity,
                  statusEffect: StatusEffects.Exhausted,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -6,
                  attribute: AttributeNames.Strength,
                  statusEffect: StatusEffects.Exhausted,
              },
          ]
        : [];

const getEntangledModifiers = (character: Character): Modifier[] =>
    character.statusEffects.includes(StatusEffects.Entangled)
        ? [
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -4,
                  attribute: AttributeNames.Dexterity,
                  statusEffect: StatusEffects.Entangled,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  attack: true,
                  statusEffect: StatusEffects.Entangled,
              },
          ]
        : [];

const getDazzledModifiers = (character: Character): Modifier[] =>
    character.statusEffects.includes(StatusEffects.Dazzled)
        ? [
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  skill: SkillTypes.Perception,
                  statusEffect: StatusEffects.Dazzled,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  attack: true,
                  statusEffect: StatusEffects.Dazzled,
              },
          ]
        : [];

const getFascinatedModifiers = (
    character: Character,
    skill: SkillTypes
): Modifier[] =>
    character.statusEffects.includes(StatusEffects.Fascinated)
        ? [
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -4,
                  skill,
                  statusEffect: StatusEffects.Fascinated,
              },
          ]
        : [];

const getFearModifiers = (
    character: Character,
    skill?: SkillTypes,
    attribute?: AttributeNames
): Modifier[] => {
    const fearStatuses = [StatusEffects.Shaken, StatusEffects.Frightened, StatusEffects.Panicked];
    return character.statusEffects.some(x => fearStatuses.includes(x))
        ? [
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  skill,
                  statusEffect: StatusEffects.Shaken,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  attack: true,
                  statusEffect: StatusEffects.Shaken,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  save: true,
                  attribute,
                  statusEffect: StatusEffects.Shaken,
              },
          ]
        : [];
}
const getSickenedModifiers = (
    character: Character,
    skill?: SkillTypes,
    attribute?: AttributeNames
): Modifier[] => {
    const fearStatuses = [StatusEffects.Sickened];
    return character.statusEffects.some(x => fearStatuses.includes(x))
        ? [
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  skill,
                  statusEffect: StatusEffects.Sickened,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  attack: true,
                  statusEffect: StatusEffects.Sickened,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  damage: true,
                  statusEffect: StatusEffects.Sickened,
              },
              {
                  id: uuidv4(),
                  type: BonusTypes.Untyped,
                  value: -2,
                  save: true,
                  attribute,
                  statusEffect: StatusEffects.Sickened,
              },
          ]
        : [];
}

export {
    getExhaustedModifiers,
    getEntangledModifiers,
    getDazzledModifiers,
    getFascinatedModifiers,
    getFatiguedModifiers,
    getFearModifiers,
    getSickenedModifiers
};
