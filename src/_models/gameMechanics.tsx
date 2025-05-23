export enum BonusTypes {
    Armor = 'Armor',
    Circumstance = 'Circumstance',
    Competence = 'Competence',
    Dodge = 'Dodge',
    Enhancement = 'Enhancement',
    Insight = 'Insight',
    Morale = 'Morale',
    Paranormal = 'Paranormal',
    Racial = 'Racial',
    Resistance = 'Resistance',
    Shield = 'Shield',
    Size = 'Size',
    Spiritual = 'Spiritual',
    Untyped = 'Untyped',
}

export const stackableBonuses = [BonusTypes.Untyped];

export enum Dice {
    Minimum = '1',
    d2 = 'd2',
    d3 = 'd3',
    d4 = 'd4',
    d6 = 'd6',
    d8 = 'd8',
    d10 = 'd10',
    d12 = 'd12',
    d20 = 'd20',
    d100 = 'd100',
}

export enum EnergyType {
    Fire = 'Fire',
    Cold = 'Cold',
    Electricity = 'Electricity',
    Sonic = 'Sonic',
    Acid = 'Acid',
}

export enum ExtraordinaryDamage {
    Force = 'Force',
    Mystic = 'Mystic',
    Necrotic = 'Necrotic',
    Psychic = 'Psychic',
    Radiant = 'Radiant',
    Untyped = 'Untyped',
    Venom = 'Venom',
    Vile = 'Vile',
}

export enum PhysicalDamage {
    Bludgeoning = 'Bludgeoning',
    Piercing = 'Piercing',
    NonLethal = 'Non Lethal',
    Slashing = 'Slashing',
}

export const Damage = {
    ...EnergyType,
    ...ExtraordinaryDamage,
    ...PhysicalDamage,
};
export type Damage = EnergyType | ExtraordinaryDamage | PhysicalDamage;

export enum Sizes {
    Fine = 'Fine',
    Diminutive = 'Diminutive',
    Tiny = 'Tiny',
    Small = 'Small',
    Medium = 'Medium',
    Large = 'Large',
    Huge = 'Huge',
    Gargantuan = 'Gargantuan',
    Colossal = 'Colossal',
    ColossalPlus = 'Colossal+',
}

type SizeModiferObject = {
    [key in Sizes]: {
        combatModifier: number;
        stealthModifier: number;
    };
};

export const SizeModifiers: SizeModiferObject = {
    Fine: {
        combatModifier: 8,
        stealthModifier: 16,
    },
    Diminutive: {
        combatModifier: 4,
        stealthModifier: 12,
    },
    Tiny: {
        combatModifier: 2,
        stealthModifier: 8,
    },
    Small: {
        combatModifier: 1,
        stealthModifier: 4,
    },
    Medium: {
        combatModifier: 0,
        stealthModifier: 0,
    },
    Large: {
        combatModifier: -1,
        stealthModifier: -4,
    },
    Huge: {
        combatModifier: -2,
        stealthModifier: -8,
    },
    Gargantuan: {
        combatModifier: -4,
        stealthModifier: -12,
    },
    Colossal: {
        combatModifier: -8,
        stealthModifier: -16,
    },
    'Colossal+': {
        combatModifier: -8,
        stealthModifier: -16,
    },
};

export enum AbilityTypes {
    SpellLike = 'Spell-Like',
    PsiLike = 'Psi-Like',
    Extraordinary = 'Extraordinary',
    Supernatural = 'Supernatural',
    Prayer = 'Prayer-Like',
}

export interface CarryingCapacityObject {
    light: number;
    med: number;
    heavy: number;
}

export enum StatusEffects {
    AbilityDamaged = 'Ability Damaged',
    AbilityDrained = 'Ability Drained',
    Blinded = 'Blinded',
    Confused = 'Confused',
    Cowering = 'Cowering',
    Cursed = 'Cursed',
    Dazed = 'Dazed',
    Dazzled = 'Dazzled',
    Deafened = 'Deafened',
    Disabled = 'Disabled',
    Dying = 'Dying',
    Dead = 'Dead',
    EnergyDrained = 'Energy Drained',
    Entangled = 'Entangled',
    Exhausted = 'Exhausted',
    Fascinated = 'Fascinated',
    Fatigued = 'Fatigued',
    FlatFooted = 'Flat Footed',
    Frightened = 'Frightened',
    Grappled = 'Grappled',
    Held = 'Held',
    Helpless = 'Helpless',
    Invisible = 'Invisible',
    Nauseated = 'Nauseated',
    Panicked = 'Panicked',
    Paralyzed = 'Paralyzed',
    Petrified = 'Petrified',
    Pinned = 'Pinned',
    Poisoned = 'Poison',
    Prone = 'Prone',
    Shaken = 'Shaken',
    Sickened = 'Sickened',
    Slowed = 'Slowed',
    Stable = 'Stable',
    Staggered = 'Staggered',
    Stunned = 'Stunned',
    Turned = 'Turned',
    Unconscious = 'Unconscious',
}

export const unableToActStatus = [
    StatusEffects.Dazed,
    StatusEffects.Disabled,
    StatusEffects.Dying,
    StatusEffects.Helpless,
    StatusEffects.Petrified,
    StatusEffects.Stunned,
    StatusEffects.Unconscious,
];

export const immobilzedStatusEffects = [
    StatusEffects.Dying,
    StatusEffects.Stunned,
    StatusEffects.Unconscious,
    StatusEffects.Pinned,
    StatusEffects.Petrified,
    StatusEffects.Paralyzed,
    StatusEffects.Held,
    StatusEffects.Helpless,
    StatusEffects.Grappled,
    StatusEffects.Fascinated,
    StatusEffects.Cowering,
];

export enum Languages {
    Aaluim = 'Aaluim',
    Abyssal = 'Abyssal',
    Aquan = 'Aquan',
    Auran = 'Auran',
    CasteSubLanguage = 'Caste Sub-Language',
    Celestial = 'Celestial',
    Chelimbese = 'Chelimbese',
    Corzali = 'Corzali',
    Daraki = 'Da’raki',
    Draconic = 'Draconic',
    Dromish = 'Dromish',
    Dwarven = 'Dwarven',
    Elven = 'Elven',
    Giantish = 'Giantish',
    Gnomish = 'Gnomish',
    Goblinoid = 'Goblinoid',
    Gnollish = 'Gnollish',
    Ignan = 'Ignan',
    Infernal = 'Infernal',
    KaethalisBodyLanguage = 'Kae’thalis Body Language',
    Kotrin = 'Kotrin',
    Laraduna = 'Laraduna',
    Mulhorandi = 'Mulhorandi',
    Orcish = 'Orcish',
    Rasso = 'Rasso',
    Sapari = 'Sapari',
    Sayzorra = 'Sayzorra',
    SignLanguage = 'Sign Language',
    Sylvan = 'Sylvan',
    Terran = 'Terran',
    ThievesCant = 'Thieves Cant',
    Xephin = 'Xephin',
    Wisplight = 'Wisplight',
    Alaronise = 'Alaronise',
    Aldrakun = 'Aldrakun',
    Calishite = 'Calishite',
    Chessentan = 'Chessentan',
    Cormyrian = 'Cormyrian',
    Kinevalish = 'Kinevalish',
    Lorilithian = 'Lorilithian',
    Ormathian = 'Ormathian',
    Ruathan = 'Ruathan',
    Salzemmite = 'Salzemmite',
    Tashalaran = 'Tashalaran',
    Thayan = 'Thayan',
    Ulutian = 'Ulutian',
}
