export enum BonusTypes {
    Armor = 'Armor',
    Circumstance = 'Circumstance',
    Competence = 'Competence',
    Dodge = 'Dodge',
    Enhancement = 'Enhancement',
    Insight = 'Insight',
    Morale = 'Morale',
    NaturalArmor = 'Natural Armor',
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
    d4 = 'd4',
    d6 = 'd6',
    d8 = 'd8',
    d10 = 'd10',
    d12 = 'd12',
    d20 = 'd20',
    d100 = 'd100',
}

export enum EnergyTypes {
    Fire = 'Fire',
    Cold = 'Cold',
    Electricity = 'Electricity',
    Sonic = 'Sonic',
    Acid = 'Acid',
}

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
