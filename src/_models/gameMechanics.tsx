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

export const Damage = {...EnergyType, ...ExtraordinaryDamage, ...PhysicalDamage};
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

export enum AbilityTypes {
    SpellLike = 'Spell-Like',
    PsiLike = 'Psi-Like',
    Extraordinary = 'Extraordinary',
    Supernatural = 'Supernatural',
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
    Unconscious = 'Unconscious'
}