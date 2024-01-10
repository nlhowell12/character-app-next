import { BonusTypes, Damage, Sizes, SpellObject } from '../_models';
import {
    AttributeNames,
    Character,
    ModifierSource,
    MovementTypes,
    SkillTypes,
} from '../_models/character';
import { MockSkills } from './mockSkills';

export const mockCharacters: Character[] = [
    {
        name: 'Zilos',
        race: 'Dromite',
        subRace: 'Ice Caste',
        size: Sizes.Small,
        heroPoints: 3,
        attributes: {
            [AttributeNames.Strength]: {
                value: 11,
            },
            [AttributeNames.Dexterity]: {
                value: 17,
            },
            [AttributeNames.Constitution]: {
                value: 14,
            },
            [AttributeNames.Intelligence]: {
                value: 15,
            },
            [AttributeNames.Wisdom]: {
                value: 13,
            },
            [AttributeNames.Charisma]: {
                value: 11,
            },
        },
        movementSpeeds: [
            {
                type: MovementTypes.Land,
                speed: 20,
            },
            {
                type: MovementTypes.Climb,
                speed: 20,
            },
        ],
        notes: [],
        isPsionic: true,
        powerPoints: 3,
        maxPowerPoints: 3,
        classes: [
            {
                name: 'Rogue',
                level: 1,
                BAB: 0,
                primarySave: AttributeNames.Dexterity,
                secondarySave: AttributeNames.Intelligence,
                classSkills: [
                    SkillTypes.Acrobatics,
                    SkillTypes.Bluff,
                    SkillTypes.Diplomacy,
                    SkillTypes.Disguise,
                    SkillTypes.EscapeArtist,
                    SkillTypes.KnowledgeLocal,
                    SkillTypes.Perception,
                    SkillTypes.SenseMotive,
                    SkillTypes.SleightOfHand,
                    SkillTypes.Stealth,
                ],
                classAbilities: [
                    {
                        name: 'Lethality - Mien of Despair',
                        description: '',
                        level: 1,
                    },
                    { name: 'Quick to Act +1', description: '', level: 1 },
                    { name: 'Sneak Attack +1d6', description: '', level: 1 },
                ],
            },
            {
                name: 'Oathsworn',
                level: 1,
                BAB: 1,
                primarySave: AttributeNames.Dexterity,
                secondarySave: AttributeNames.Intelligence,
                classSkills: [
                ],
                classAbilities: [
                    
                ],
            },
        ],
        maxHitPoints: 8,
        currentHitPoints: 8,
        nonLethalDamage: 0,
        tempHP: 0,
        age: 17,
        height: `3'2"`,
        weight: 31,
        eyeColor: 'Prismatic',
        hairColor: 'None',
        languages: ['Dromish', 'Ice Caste', 'Thieves Cant', 'Elven', 'Dwarven'],
        playerName: 'Hater',
        skills: MockSkills,
        experience: 0,
        feats: [],
        spellBook: {} as SpellObject,
        equipment: [
            {
                id: '123456',
                name: 'Leather Armor',
                armorCheckPenalty: 0,
                weight: 7,
                modifiers: [
                    {
                        id: '123456',
                        value: 2,
                        type: BonusTypes.Armor,
                        defense: true,
                    },
                ],
                equipped: true,
                maxDexBonus: 8,
                spellFailure: 0,
                hardness: 50,
                amount: 1
            },
        ],
        miscModifiers: [
            {
                id: '123456',
                value: 1,
                type: BonusTypes.Racial,
                defense: true,
                definition: 'Natural Armor',
            },
            {
                id: '123456',
                value: 5,
                resistance: true,
                damageType: Damage.Cold,
                type: BonusTypes.Racial,
            },
            {
                id: '123456',
                definition: ModifierSource.attributeScoreIncrease,
                attribute: AttributeNames.Dexterity,
                type: BonusTypes.Untyped,
                value: 1,
            },
            {
                // added to test negative path, otherwise useless
                id: '123456',
                value: 0,
                definition: ModifierSource.attributeScoreIncrease,
                attribute: AttributeNames.Dexterity,
                type: BonusTypes.Untyped,
            },
            {
                id: '123456',

                value: 1,
                type: BonusTypes.Untyped,
                defense: true,
            },
            {
                id: '123456',

                value: 1,
                type: BonusTypes.Untyped,
                defense: true,
            },
            {
                id: '123456',

                value: 1,
                type: BonusTypes.Untyped,
                skill: SkillTypes.Disguise,
            },
            {
                id: '123456',

                value: 1,
                type: BonusTypes.Untyped,
                skill: SkillTypes.Disguise,
            },
            {
                id: '123456',

                value: 4,
                type: BonusTypes.Size,
                skill: SkillTypes.Stealth,
            },
            {
                id: '123456',

                value: 2,
                type: BonusTypes.Morale,
                damage: true,
                attack: true,
            },
            {
                id: '123456',

                value: 1,
                type: BonusTypes.Untyped,
                attack: true,
            },
            {
                id: '123456',

                value: 1,
                type: BonusTypes.Untyped,
                attack: true,
            },
            {
                id: '123456',

                value: 0,
                attribute: AttributeNames.Intelligence,
                type: BonusTypes.Untyped,
                damage: true,
            },
        ],
    },
];
