import { BonusTypes, Damage, Sizes } from '../_models';
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
        attributes: {
            [AttributeNames.Strength]: {
                value: 11,
                modifiers: [
                    {
                        value: -4,
                        type: BonusTypes.Racial,
                    },
                ],
            },
            [AttributeNames.Dexterity]: {
                value: 17,
                modifiers: [
                    {
                        value: 2,
                        type: BonusTypes.Racial,
                    },
                ],
            },
            [AttributeNames.Constitution]: {
                value: 14,
                modifiers: [],
            },
            [AttributeNames.Intelligence]: {
                value: 15,
                modifiers: [],
            },
            [AttributeNames.Wisdom]: {
                value: 13,
                modifiers: [],
            },
            [AttributeNames.Charisma]: {
                value: 11,
                modifiers: [],
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
        classes: [
            {
                name: 'Rogue',
                level: 1,
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
        equipment: [
            {
                name: 'Leather Armor',
                armorCheckPenalty: 0,
                weight: 7,
                modifiers: [
                    {
                        value: 2,
                        type: BonusTypes.Armor,
                        defense: true,
                    },
                ],
                equipped: true,
            },
        ],
        miscModifiers: [
            {
                value: 1,
                type: BonusTypes.NaturalArmor,
                defense: true,
            },
            {
                value: 5,
                resistance: true,
                damageType: Damage.Cold,
                type: BonusTypes.Racial,
            },
            {
                definition: ModifierSource.attributeScoreIncrease,
                attribute: AttributeNames.Dexterity,
                type: BonusTypes.Untyped,
                value: 1,
            },
            { // added to test negative path, otherwise useless
                definition: ModifierSource.attributeScoreIncrease,
                attribute: AttributeNames.Dexterity,
                type: BonusTypes.Untyped,
            },
			{
				value: 1,
				type: BonusTypes.Untyped,
				defense: true
			},
			{
				value: 1,
				type: BonusTypes.Untyped,
				defense: true
			},
			{
				value: 1,
				type: BonusTypes.Untyped,
				skill: SkillTypes.Disguise
			},
			{
				value: 1,
				type: BonusTypes.Untyped,
				skill: SkillTypes.Disguise
			},
			{
				value: 4,
				type: BonusTypes.Size,
				skill: SkillTypes.Stealth
			},
        ],
    },
];
