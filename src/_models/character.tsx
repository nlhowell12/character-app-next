import {
    ArcaneSchool,
    DivineDomain,
    MartialQueue,
    PsionicDiscipline,
    ShadowPath,
    SpellObject,
} from '.';
import { Equipment } from './equipment';
import {
    AbilityTypes,
    BonusTypes,
    Damage,
    Dice,
    Sizes,
    StatusEffects,
} from './gameMechanics';

export enum AttributeNames {
    Strength = 'Strength',
    Dexterity = 'Dexterity',
    Constitution = 'Constitution',
    Wisdom = 'Wisdom',
    Intelligence = 'Intelligence',
    Charisma = 'Charisma',
}

export enum SkillTypes {
    Acrobatics = 'Acrobatics',
    Athletics = 'Athletics',
    Bluff = 'Bluff',
    Concentration = 'Concentration',
    Diplomacy = 'Diplomacy',
    Disguise = 'Disguise',
    EscapeArtist = 'Escape Artist',
    Heal = 'Heal',
    Intimidate = 'Intimidate',
    KnowledgeArcana = 'Knowledge: Arcana',
    KnowledgeDungeoneering = 'Knowledge: Dungeoneering',
    KnowledgeHistory = 'Knowledge: History',
    KnowledgeLocal = 'Knowledge: Local',
    KnowledgeNature = 'Knowledge: Nature',
    KnowledgeNobilityRoyalty = 'Knowledge: Nobility & Royalty',
    KnowledgePsionics = 'Knowledge: Psionics',
    Magecraft = 'Magecraft',
    Perception = 'Perception',
    Perform = 'Perform',
    Ride = 'Ride',
    SenseMotive = 'Sense Motive',
    SleightOfHand = 'Sleight of Hand',
    SpeakLanguage = 'Speak Language',
    Stealth = 'Stealth',
}

export enum RaceNames {
    Dromite = 'Dromite',
    Dwarf = 'Dwarf',
    Elf = 'Elf',
    Gnome = 'Gnome',
    HalfElf = 'Half-Elf',
    Halfing = 'Halfling',
    HalfOrc = 'Half-Orc',
    Hobgoblin = 'Hobgoblin',
    Human = 'Human',
    Xeph = 'Xeph',
}

export enum Languages {
    Dromish = 'Dromish',
    DromiteCasteLanguage = 'Dromite Sub-Caste Language',
    Dwarven = 'Dwarven',
    Elven = 'Elven',
    KaeThaelisBodyLanguage = "Kae'thalis Body Language",
    Sylvan = 'Sylvan',
    Gnomish = 'Gnomish',
    Hinnish = 'Hinnish',
    Orcish = 'Orcish',
    Goblinoid = 'Goblinoid',
    Xephin = 'Xephin',
}

export enum CharacterClassNames {
    Barbarian = 'Barbarian',
    Bard = 'Bard',
    Cleric = 'Cleric',
    Fighter = 'Fighter',
    Hexblade = 'Hexblade',
    Monk = 'Monk',
    Oathsworn = 'Oathsworn',
    Psion = 'Psion',
    PsychicWarrior = 'Psychic Warrior',
    Rogue = 'Rogue',
    Shadowcaster = 'Shadowcaster',
    Sorcerer = 'Sorcerer',
    Wizard = 'Wizard',
    SorcWiz = 'Sorcerer - Wizard',
}

export type Attribute = {
    value: number;
    racialBonus?: number;
};

export type CharacterAttributes = { [key in AttributeNames]: Attribute };

export enum CharacterKeys {
    name = 'name',
    race = 'race',
    size = 'size',
    subRace = 'subRace',
    attributes = 'attributes',
    classes = 'classes',
    maxHitPoints = 'maxHitPoints',
    currentHitPoints = 'currentHitPoints',
    nonLethalDamage = 'nonLethalDamage',
    tempHP = 'tempHP',
    age = 'age',
    height = 'height',
    weight = 'weight',
    eyeColor = 'eyeColor',
    hairColor = 'hairColor',
    languages = 'languages',
    specialAbilities = 'specialAbilities',
    proficiencies = 'proficiencies',
    skills = 'skills',
    equipment = 'equipment',
    currency = 'currency',
    miscModifiers = 'miscModifiers',
    playerName = 'playerName',
    experience = 'experience',
    feats = 'feats',
    spellBook = 'spellBook',
    martialQueue = 'martialQueue',
    notes = 'notes',
    powerPoints = 'powerPoints',
    maxPowerPoints = 'maxPowerPoints',
    isPsionic = 'isPsionic',
    heroPoints = 'heroPoints',
    movementSpeeds = 'movementSpeeds',
    statusEffects = 'statusEffects',
    specialResources = 'specialResources',
}

export interface Currency {
    cp: number;
    sp: number;
    gp: number;
    pp: number;
}

export interface Note {
    id: string;
    title: string;
    note: string;
}
export interface Character {
    name: string;
    race: string;
    size: Sizes;
    movementSpeeds: Movement[];
    subRace: string;
    attributes: CharacterAttributes;
    classes: CharacterClass[];
    maxHitPoints: number;
    currentHitPoints: number;
    nonLethalDamage: number;
    isPsionic: boolean;
    powerPoints: number;
    maxPowerPoints: number;
    tempHP: number;
    age: number;
    height: string;
    weight: number;
    eyeColor: string;
    hairColor: string;
    languages: string[];
    specialAbilities: string[];
    currency: Currency;
    proficiencies: string[];
    skills: SkillObject;
    equipment: Equipment[];
    miscModifiers: Modifier[];
    playerName: string;
    experience: number;
    feats: Feat[];
    spellBook: SpellObject;
    martialQueue: MartialQueue;
    notes: Note[];
    heroPoints: number;
    statusEffects: StatusEffects[];
    specialResources: SpecialResourceObject;
}
export type SkillObject = {
    [key in SkillTypes]: RankedSkill;
};

export type SpecialResourceObject = {
    [key in SpecialResourceType]: number;
};

export enum MovementTypes {
    Land = 'Land',
    Fly = 'Fly',
    Burrow = 'Burrow',
    Swim = 'Swim',
    Climb = 'Climb',
}
export interface Movement {
    type: MovementTypes;
    speed: number;
}

export interface ClassAbility {
    name: string;
    level: number;
    className: Omit<CharacterClassNames, CharacterClassNames.SorcWiz>;
    description: string;
    allegianceValue?: number;
    domain?: DivineDomain;
    school?: ArcaneSchool;
}

export interface ArchetypeAbility {
    description: string;
    level: number;
}

export interface Archetype {
    name: string;
    abilities: ArchetypeAbility[];
}

export interface CharacterClass {
    name: CharacterClassNames;
    primarySave: AttributeNames;
    classSkills: SkillTypes[];
    classAbilities: ClassAbility[];
    level: number;
    secondarySave: AttributeNames;
    BAB: number;
    turnDomain?: DivineDomain;
    rebukeDomain?: DivineDomain;
    spontaneousChannelDomain?: DivineDomain;
    preferredDomains?: DivineDomain[];
}

export enum ModifierSource {
    trait = 'Trait',
    synergy = 'Synergy',
    classAbility = 'Class Ability',
    otherAbility = 'Other Ability',
    spell = 'Spell',
    feat = 'Feat',
    other = 'Other',
    statusEffect = 'Status Effect',
}
export interface Modifier {
    value: number;
    definition?: string;
    skill?: SkillTypes;
    allSkills?: boolean;
    allSaves?: boolean;
    attribute?: AttributeNames;
    attack?: boolean;
    damage?: boolean;
    save?: boolean;
    defense?: boolean;
    type: BonusTypes;
    abilityType?: AbilityTypes;
    resistance?: boolean;
    immunity?: boolean;
    initiative?: boolean;
    damageType?: Damage;
    damageDice?: Dice;
    numberOfDice?: number;
    fromEquipment?: boolean;
    statusEffect?: StatusEffects;
    spellSchool?: ArcaneSchool | PsionicDiscipline | DivineDomain | ShadowPath;
    id: string;
    source: ModifierSource;
}

export enum FeatCategory {
    Channeling = 'Channeling',
    Combative = 'Combative',
    Composition = 'Composition',
    General = 'General',
    Metamagick = 'Metamagick',
    Psionic = 'Psionic',
    Racial = 'Racial',
    ShadowEssence = 'Shadow Essence',
    Spellcasting = 'Spellcasting',
}
export interface Feat {
    prerequisites?: string;
    name: string;
    definition: string;
    category: string;
    stackable: boolean;
    requiredOption: boolean;
    selectedOption?: string;
    source?: string;
}

interface SkillSynergy {
    linkedSkill: SkillTypes;
    requiredRanks: number;
    value: number;
}

export interface Skill {
    name: SkillTypes;
    linkedAttribute: AttributeNames;
    armorCheckPenalty?: boolean;
    synergies?: SkillSynergy[];
}

export interface RankedSkill extends Skill {
    ranks: number;
    modifiers?: Modifier[];
}

export enum SpecialResourceType {
    AoO = 'Attack of Opportunity',
    Rage = 'Rage',
    BardMusic = 'Bardic Music',
    Turn = 'Turn',
    Rebuke = 'Rebuke',
    LayOnHands = 'Lay on Hands',
    HexCurse = 'Hexblade Curse',
    LuckPool = 'Luck Pool',
    Qi = 'Qi',
    StunningFist = 'Stunning Fist',
}
export interface SpecialResource {
    name: SpecialResourceType;
    value: number;
}
