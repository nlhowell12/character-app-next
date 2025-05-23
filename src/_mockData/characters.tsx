import {
    ArcaneSchool,
    BonusTypes,
    Damage,
    MartialQueue,
    Sizes,
    SpellObject,
} from '../_models';
import {
    AttributeNames,
    Character,
    CharacterClassNames,
    ModifierSource,
    MovementTypes,
    SkillTypes,
    SpecialResourceObject,
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
        statusEffects: [],
        isPsionic: true,
        powerPoints: 3,
        maxPowerPoints: 3,
        currency: {
            cp: 0,
            sp: 0,
            gp: 0,
            pp: 0,
        },
        specialAbilities: [],
        proficiencies: [],
        classes: [
            {
                name: CharacterClassNames.Rogue,
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
                        className: CharacterClassNames.Rogue,
                    },
                    {
                        name: 'Quick to Act +1',
                        description: '',
                        level: 1,
                        className: CharacterClassNames.Rogue,
                    },
                    {
                        name: 'Sneak Attack +1d6',
                        description: '',
                        level: 1,
                        className: CharacterClassNames.Rogue,
                    },
                ],
            },
            {
                name: CharacterClassNames.Oathsworn,
                level: 1,
                BAB: 1,
                primarySave: AttributeNames.Dexterity,
                secondarySave: AttributeNames.Intelligence,
                classSkills: [],
                classAbilities: [],
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
        martialQueue: {} as MartialQueue,
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
                        source: ModifierSource.spell,
                    },
                ],
                equipped: true,
                maxDexBonus: 8,
                spellFailure: 0,
                hardness: 50,
                amount: 1,
                isArmor: true,
                cost: '8gp',
            },
        ],
        miscModifiers: [
            {
                id: '0',
                value: -4,
                type: BonusTypes.Racial,
                attribute: AttributeNames.Strength,
                source: ModifierSource.spell,
            },
            {
                id: '1',
                value: 1,
                type: BonusTypes.Racial,
                defense: true,
                definition: 'Natural Armor',
                source: ModifierSource.spell,
            },
            {
                id: '12',
                value: 5,
                resistance: true,
                damageType: Damage.Cold,
                type: BonusTypes.Racial,
                source: ModifierSource.spell,
            },
            {
                id: '12345',

                value: 1,
                type: BonusTypes.Untyped,
                defense: true,
                source: ModifierSource.spell,
            },
            {
                id: '123456',

                value: 1,
                type: BonusTypes.Untyped,
                defense: true,
                source: ModifierSource.spell,
            },
            {
                id: '1234567',

                value: 1,
                type: BonusTypes.Untyped,
                skill: SkillTypes.Disguise,
                source: ModifierSource.spell,
            },
            {
                id: '12345678',

                value: 1,
                type: BonusTypes.Untyped,
                skill: SkillTypes.Disguise,
                source: ModifierSource.spell,
            },
            {
                id: '123456789',

                value: 4,
                type: BonusTypes.Size,
                skill: SkillTypes.Stealth,
                source: ModifierSource.spell,
            },
            {
                id: '1234567890',

                value: 2,
                type: BonusTypes.Morale,
                damage: true,
                attack: true,
                source: ModifierSource.spell,
            },
            {
                id: '12345678901',

                value: 1,
                type: BonusTypes.Untyped,
                attack: true,
                source: ModifierSource.spell,
            },
            {
                id: '123456789012',

                value: 1,
                type: BonusTypes.Untyped,
                attack: true,
                source: ModifierSource.spell,
            },
            {
                id: '123456',

                value: 0,
                attribute: AttributeNames.Intelligence,
                type: BonusTypes.Untyped,
                damage: true,
                source: ModifierSource.spell,
            },
            {
                id: '1111111',

                value: 1,
                type: BonusTypes.Untyped,
                spellSchool: ArcaneSchool.Abjuration,
                source: ModifierSource.spell,
            },
        ],
        specialResources: {} as SpecialResourceObject,
    },
];
