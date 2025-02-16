import {
    Attribute,
    AttributeNames,
    Character,
    CharacterAttributes,
    CharacterClass,
    CharacterClassNames,
    ClassAbility,
    DivineDomain,
    Feat,
    Movement,
    SpecialResource,
    SpecialResourceType,
    StatusEffects,
} from '@/_models';
import {
    getAttributeModifier,
    getBaseAttributeScore,
    getTotalAttributeModifier,
} from './attributeUtils';
import * as R from 'ramda';

type ClassAbilityObject = {
    [key in CharacterClassNames]: ClassAbility[];
};

export enum DomainAspectFeats {
    ImprovedCounterchannel = 'Improved Counterchannel',
}

export const getAllClassAbilities = (character: Character): ClassAbility[] => {
    const abilities: ClassAbility[][] = [];
    character.classes.forEach((cls) => {
        abilities.push(cls.classAbilities);
    });
    return abilities.flat();
};

export const reduceSpeed = (
    moveSpeeds: Movement[],
    reduction: 'half' | 'quarter'
): Movement[] => {
    const returnMoves: Movement[] = [];
    switch (reduction) {
        case 'half':
            moveSpeeds.forEach((x) => {
                returnMoves.push({ type: x.type, speed: x.speed * 0.5 });
            });
            return returnMoves;
        case 'quarter':
            moveSpeeds.forEach((x) => {
                returnMoves.push({ type: x.type, speed: x.speed * 0.25 });
            });
            return returnMoves;
        default:
            return moveSpeeds;
    }
};

export const checkForHalfMovement = (character: Character): Movement[] => {
    const speedReductionStatusEffects = [
        StatusEffects.Blinded,
        StatusEffects.Exhausted,
        StatusEffects.Slowed,
        StatusEffects.Entangled,
    ];
    return character.statusEffects.some((x) =>
        speedReductionStatusEffects.includes(x)
    )
        ? reduceSpeed(character.movementSpeeds, 'half')
        : character.movementSpeeds;
};

export const getInitiativeScore = (character: Character): string => {
    const attBonus = getTotalAttributeModifier(
        character,
        AttributeNames.Dexterity
    );
    const modValue = character.miscModifiers
        .filter((x) => !!x.initiative)
        .reduce((x, y) => x + y.value, 0);
    const deafened = character.statusEffects.includes(StatusEffects.Deafened)
        ? -4
        : 0;
    const total = attBonus + modValue + deafened;
    return `${total > 0 ? '+' : ''}${total}`;
};

export const hasMartialClass = (character: Character): boolean => {
    const martialClasses = [
        CharacterClassNames.Fighter,
        CharacterClassNames.Hexblade,
        CharacterClassNames.Oathsworn,
        CharacterClassNames.PsychicWarrior,
    ];
    return character.classes.some((x) => martialClasses.includes(x.name));
};

export const getAllegianceTotal = (character: Character) => {
    const allegianceObject: { [key in DivineDomain]: number } = {
        [DivineDomain.Air]: 0,
        [DivineDomain.Earth]: 0,
        [DivineDomain.Fire]: 0,
        [DivineDomain.Water]: 0,
        [DivineDomain.Deception]: 0,
        [DivineDomain.Truth]: 0,
        [DivineDomain.Magic]: 0,
        [DivineDomain.Mind]: 0,
        [DivineDomain.War]: 0,
        [DivineDomain.Peace]: 0,
        [DivineDomain.Life]: 0,
        [DivineDomain.Death]: 0,
        [DivineDomain.Cosmic]: 0,
    };
    const clericClassAbilities = getClassAbilities(character.classes)[
        CharacterClassNames.Cleric
    ];
    if (clericClassAbilities) {
        clericClassAbilities
            .filter((x) => !!x.allegianceValue && !!x.domain)
            .forEach((abl) => {
                /* @ts-ignore */
                allegianceObject[abl.domain] += abl.allegianceValue;
            });
    }
    character.feats.forEach((x) => {
        if (
            x.name === DomainAspectFeats.ImprovedCounterchannel &&
            !!x.selectedOption
        ) {
            allegianceObject[x.selectedOption as DivineDomain] += 1;
        }
    });
    character.classes.forEach((cls) => {
        if (cls.name === CharacterClassNames.Cleric) {
            if (!!cls.turnDomain) {
                allegianceObject[cls.turnDomain] += 3;
            }
            if (!!cls.rebukeDomain) {
                allegianceObject[cls.rebukeDomain] += 2;
            }
            if (!!cls.spontaneousChannelDomain) {
                allegianceObject[cls.spontaneousChannelDomain] += 1;
            }
        }
    });
    return allegianceObject;
};

export const sortDomainAspects = (character: Character) => {
    const allegianceTotals = getAllegianceTotal(character);
    const diff = (a: DivineDomain, b: DivineDomain) => {
        if (allegianceTotals[a] > allegianceTotals[b]) {
            return -1;
        } else if (allegianceTotals[a] < allegianceTotals[b]) {
            return 1;
        }
        const cleric = character.classes.filter(
            (x) => x.name === CharacterClassNames.Cleric
        )[0];
        const preferredDomainA = cleric.preferredDomains?.includes(a);
        const preferredDomainB = cleric.preferredDomains?.includes(b);
        if (preferredDomainA && !preferredDomainB) {
            return -1;
        } else if (!preferredDomainA && preferredDomainB) {
            return 1;
        }
        return 0;
    };
    return R.sort(diff, Object.keys(DivineDomain) as DivineDomain[]);
};

export const getAlignedDomainAspects = (character: Character) => {
    return sortDomainAspects(character).slice(0, 5);
};

export const getAlignedOrisons = (
    character: Character,
    abilities: ClassAbility[]
) => {
    const orisons = abilities.filter(
        (x) =>
            !!x.domain &&
            x.level === 0 &&
            x.className === CharacterClassNames.Cleric
    );
    const alignedDomains = getAlignedDomainAspects(character);
    return orisons.filter(
        (abl) => !!abl.domain && alignedDomains.includes(abl.domain)
    );
};

export const getClassAbilities = (
    classes: CharacterClass[]
): Partial<ClassAbilityObject> => {
    type ClassAbilityObject = {
        [key in CharacterClassNames]: ClassAbility[];
    };
    let classAbilityObject: Partial<ClassAbilityObject> = {};
    classes.forEach((cls) => {
        if (cls.name === CharacterClassNames.Cleric) {
            classAbilityObject[cls.name] = [...cls.classAbilities];
        } else {
            classAbilityObject[cls.name] = cls.classAbilities;
        }
    });
    return classAbilityObject;
};

export const getTotalClassLevels = (character: Character) => {
    return character.classes.reduce(
        (x: number, y: CharacterClass) => x + y.level,
        0
    );
};

export const getHexbladeCurseDC = (character: Character) => {
    const isHexblade = character.classes.some(
        (x) => x.name === CharacterClassNames.Hexblade
    );
    const charismaMod = getAttributeModifier(
        getBaseAttributeScore(character, AttributeNames.Charisma)
    );
    const characterLevel = getTotalClassLevels(character);
    const hexbladeDC = Math.floor(10 + characterLevel / 2 + charismaMod);
    return isHexblade ? hexbladeDC : null;
};

export const getSpecialResources = (
    character: Character
): SpecialResource[] => {
    const resources: SpecialResource[] = [];
    const { classes, feats } = character;
    const stun = SpecialResourceType.StunningFist;
    if (feats.filter((x) => x.name === 'Stunning Fist').length) {
        resources.push({
            name: stun,
            value: getSpecialResourceValue(
                getTotalClassLevels(character),
                stun,
                feats,
                0
            ),
        });
    }
    classes.map((x) => {
        const chaMod = getTotalAttributeModifier(
            character,
            AttributeNames.Charisma
        );
        switch (x.name) {
            case CharacterClassNames.Barbarian:
                const rage = SpecialResourceType.Rage;
                resources.push({
                    name: rage,
                    value: getSpecialResourceValue(x.level, rage, feats, 0),
                });
            case CharacterClassNames.Bard:
                const music = SpecialResourceType.BardMusic;
                resources.push({
                    name: music,
                    value: getSpecialResourceValue(x.level, music, feats, 0),
                });
            case CharacterClassNames.Cleric:
                const turn = SpecialResourceType.Turn;
                const rebuke = SpecialResourceType.Rebuke;

                resources.push({
                    name: turn,
                    value: getSpecialResourceValue(0, turn, feats, chaMod),
                });
                resources.push({
                    name: rebuke,
                    value: getSpecialResourceValue(0, turn, feats, chaMod),
                });
            case CharacterClassNames.Hexblade:
                const hex = SpecialResourceType.HexCurse;
                const luck = SpecialResourceType.LuckPool;
                resources.push({
                    name: hex,
                    value: getSpecialResourceValue(x.level, hex, feats, 0),
                });
                x.level >= 3 &&
                    resources.push({
                        name: luck,
                        value: getSpecialResourceValue(0, luck, feats, 0),
                    });
            case CharacterClassNames.Monk:
                const qi = SpecialResourceType.Qi;
                resources.push({
                    name: qi,
                    value: getSpecialResourceValue(x.level, qi, feats, 0),
                });
            case CharacterClassNames.Oathsworn:
                const layOnHands = SpecialResourceType.LayOnHands;
                resources.push({
                    name: layOnHands,
                    value: getSpecialResourceValue(
                        x.level,
                        layOnHands,
                        feats,
                        chaMod
                    ),
                });
                resources.push({
                    name: SpecialResourceType.Turn,
                    value: oathTurnCount(x.level, feats),
                });
            default:
                resources.push({
                    name: SpecialResourceType.AoO,
                    value: getAoOCount(character),
                });
                return;
        }
    });
    return resources;
};

export const getSpecialResourceValue = (
    level: number,
    resource: SpecialResourceType,
    feats: Feat[],
    attributeMod: number
): number => {
    switch (resource) {
        case SpecialResourceType.Rage:
            return getRageCount(level);
        case SpecialResourceType.BardMusic:
            return getBardicMusicCount(level, feats);
        case SpecialResourceType.Turn:
            return getTurnCount(feats, attributeMod);
        case SpecialResourceType.Rebuke:
            return getTurnCount(feats, attributeMod);
        case SpecialResourceType.HexCurse:
            return getHexCurseCount(level);
        case SpecialResourceType.HexCurse:
            return getLuckCount();
        case SpecialResourceType.StunningFist:
            return getStunningFistCount(level, feats);
        case SpecialResourceType.Qi:
            return getQiValue(level);
        case SpecialResourceType.LayOnHands:
            return getLayOnHandsCount(level, attributeMod);
        default:
            return 0;
    }
};

const getRageCount = (level: number) => {
    return Math.floor(level / 4) + 1;
};

const getBardicMusicCount = (level: number, feats: Feat[]) => {
    const bonus =
        feats.filter((x) => x.name === 'Extra Performance').length * 2;
    return 3 + level + bonus;
};

const getAoOCount = (character: Character) => {
    return (
        character.feats.filter((x) => x.name === 'Combat Reflexes').length + 1
    );
};

const getTurnCount = (feats: Feat[], chaMod: number) => {
    const extTurn = feats.filter((x) => x.name === 'Extra Turning').length * 4;
    return 3 + chaMod + extTurn;
};

const getHexCurseCount = (level: number) => {
    return Math.floor(level / 4) + 1;
};

const getLuckCount = () => {
    return 0;
};

const getStunningFistCount = (level: number, feats: Feat[]) => {
    const extraStun =
        feats.filter((x) => x.name === 'Extra Stunning').length * 2;
    return Math.ceil(level / 4) + extraStun;
};
const getQiValue = (level: number) => {
    switch (level) {
        case 4:
            return level / 4;
        case 5:
            return Math.floor(level / 4) + 1;
        case 6:
            return Math.floor(level / 4) + 2;
        case 7:
            return Math.ceil(level / 4) + 4;
        case 8:
            return level;
        case 9:
        case 10:
            return level + 1;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            return level + (level - 10);
        case 16:
        case 17:
            return level + 5;
        case 18:
        case 19:
        case 20:
            return level + (level - 12);
        default:
            return 0;
    }
};

const getLayOnHandsCount = (level: number, chaMod: number) => {
    const total = level * chaMod;
    return !!total ? total : 0;
};

const oathTurnCount = (level: number, feats: Feat[]) => {
    const extTurn = feats.filter((x) => x.name === 'Extra Turning').length * 4;
    return level + 3 + extTurn;
};
