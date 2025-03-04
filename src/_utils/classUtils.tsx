import {
    AnyMagickType,
    AttributeNames,
    BonusTypes,
    Character,
    CharacterClass,
    CharacterClassNames,
    ClassAbility,
    DivineDomain,
    Feat,
    Modifier,
    ModifierSource,
    MonkTraditions,
    Movement,
    PathOptions,
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
import { v4 as uuidv4 } from 'uuid';
import { ClassAbilityReturnObject } from '@/app/api/_services/useClassAbilityService';
import { Divider } from '@mui/material';

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
            if (!!cls.impCounter) {
                allegianceObject[cls.impCounter] += 1;
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
    const resources: SpecialResource[] = [
        {
            name: SpecialResourceType.AoO,
            value: getAoOCount(character),
        },
    ];
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
                return;
            case CharacterClassNames.Bard:
                const music = SpecialResourceType.BardMusic;
                resources.push({
                    name: music,
                    value: getSpecialResourceValue(x.level, music, feats, 0),
                });
                return;
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
                return;
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
                return;
            case CharacterClassNames.Monk:
                const qi = SpecialResourceType.Qi;
                resources.push({
                    name: qi,
                    value: getSpecialResourceValue(x.level, qi, feats, 0),
                });
                return;
            case CharacterClassNames.Oathsworn:
                const layOnHands = SpecialResourceType.LayOnHands;
                getTotalAttributeModifier(character, AttributeNames.Charisma) >=
                    1 &&
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
                return;

            default:
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

export const getRageModifiers = (character: Character): Modifier[] => {
    const barbClass = getBarbarianClass(character);
    const attBonus = () => {
        if (!!barbClass && barbClass?.level < 11) {
            return 4;
        } else if (barbClass && barbClass.level < 20) {
            return 6;
        } else {
            return 8;
        }
    };
    const chaBonus = () => {
        if (!!barbClass && barbClass?.level < 11) {
            return 2;
        } else if (barbClass && barbClass.level < 20) {
            return 3;
        } else {
            return 4;
        }
    };
    return [
        {
            source: ModifierSource.classAbility,
            id: uuidv4(),
            value: attBonus(),
            type: BonusTypes.Enhancement,
            attribute: AttributeNames.Strength,
            definition: SpecialResourceType.Rage,
        },
        {
            source: ModifierSource.classAbility,
            id: uuidv4(),
            value: attBonus(),
            type: BonusTypes.Enhancement,
            attribute: AttributeNames.Constitution,
            definition: SpecialResourceType.Rage,
        },
        {
            source: ModifierSource.classAbility,
            id: uuidv4(),
            value: chaBonus(),
            type: BonusTypes.Morale,
            attribute: AttributeNames.Charisma,
            definition: SpecialResourceType.Rage,
            save: true,
        },
        {
            source: ModifierSource.classAbility,
            id: uuidv4(),
            value: -2,
            type: BonusTypes.Untyped,
            definition: SpecialResourceType.Rage,
            defense: true,
        },
    ];
};

export const isRaging = (modifiers: Modifier[]) => {
    return modifiers.some((x) => x.definition === SpecialResourceType.Rage);
};

export const getBarbarianClass = (character: Character) => {
    return character.classes.find(
        (x) => x.name === CharacterClassNames.Barbarian
    );
};
export const getRageHpIncrease = (character: Character) => {
    const barbClass = getBarbarianClass(character);

    return !!barbClass ? barbClass.level * 2 : 0;
};

export const getClassAbilityChoices = (
    className: CharacterClassNames,
    classAbilities: ClassAbilityReturnObject,
    ability?: ClassAbility,
    path?: PathOptions
) => {
    switch (className) {
        case CharacterClassNames.Bard:
            if (!!ability && ability.name === 'Bardic Music') {
                return classAbilities.Bard.music.filter(
                    (x) => !x.path || x.path === path
                );
            }
            return undefined;
        case CharacterClassNames.Monk:
            if (!!ability && ability.name === 'Qi Focus') {
                return classAbilities.Monk.filter(
                    (x) =>
                        x.isQiFocus &&
                        (x.path === path || path === MonkTraditions.Hexad)
                );
            }
            return undefined;
        default:
            return undefined;
    }
};

export const getAbilityDescription = (
    ability: ClassAbility,
    classAbilityResponse: ClassAbilityReturnObject
) => {
    const { description, path, name } = ability;
    const alternate = `${name === 'Qi Focus' ? name : ''}`;
    const descriptionString = `${!!path ? `(${path}) ` : ''}${
        description ? description : alternate
    }`;
    switch (ability.name) {
        case 'Bardic Music':
            return (
                <div key={ability.name + ability.level}>
                    <p style={{ marginBottom: '.5rem' }}>{descriptionString}</p>
                    <Divider />
                    <p style={{ marginTop: '.5rem' }}>
                        {
                            classAbilityResponse.Bard.music.find(
                                (x) => x.name === ability.selectedChoice
                            )?.description
                        }
                    </p>
                    {classAbilityResponse.Bard.refrains
                        .filter((x) => x.name === ability.selectedChoice)
                        .map((ref) => {
                            return (
                                <p
                                    key={ref.name + ref.level}
                                    style={{ marginTop: '.5rem' }}
                                >
                                    <strong>{`Refrain (Level ${ref.level}) : `}</strong>
                                    {ref.description}
                                </p>
                            );
                        })}
                </div>
            );
        case 'Lethality':
            return (
                <div key={ability.name + ability.level}>
                    <p style={{ marginBottom: '.5rem' }}>{descriptionString}</p>
                    <Divider />
                    <p style={{ marginTop: '.5rem' }}>
                        {
                            classAbilityResponse.Rogue.find(
                                (x) => x.name === ability.selectedChoice
                            )?.description
                        }
                    </p>
                </div>
            );
        case 'Avowal':
            return (
                <div key={ability.name + ability.level}>
                    <p style={{ marginBottom: '.5rem' }}>{descriptionString}</p>
                    <Divider />
                    <p style={{ marginTop: '.5rem' }}>
                        {
                            classAbilityResponse.Oathsworn.find(
                                (x) => x.name === ability.selectedChoice
                            )?.description
                        }
                    </p>
                </div>
            );
        case 'Qi Focus':
            const selectedChoice = classAbilityResponse.Monk.find(
                (x) => x.description === ability.selectedChoice
            );
            return (
                <div key={ability.description + ability.level}>
                    <p style={{ marginBottom: '.5rem' }}>
                        {descriptionString}: {selectedChoice?.qiCost}
                    </p>
                    <Divider />
                    <p style={{ marginTop: '.5rem' }}>
                        {selectedChoice?.description}
                    </p>
                </div>
            );
        default:
            return descriptionString;
    }
};

export const removeLowerClassAbilites = (classAbilities: ClassAbility[]) => {
    const allowDuplicates = [
        'Qi Focus',
        'Avowal',
        'Favored Enemy',
        'Bardic Music',
        'Lethality',
        'Jack of All Trades',
    ];
    let sortedAbilities = classAbilities.sort((a, b) => {
        return b.level - a.level;
    });
    const parsedAbilities = sortedAbilities.filter((abl) => {
        const otherAbility = classAbilities.findIndex(
            (x) => x.name === abl.name && abl.level !== x.level
        );
        const thisAbility = classAbilities.findIndex(
            (x) => x.name === abl.name && x.level === abl.level
        );
        const thisAbilityFull = classAbilities[thisAbility];
        return (
            thisAbility < otherAbility ||
            otherAbility === -1 ||
            allowDuplicates.includes(abl.name) ||
            (thisAbilityFull.name === 'Qi Strike' &&
                thisAbilityFull.level === 4 &&
                thisAbilityFull.path === MonkTraditions.Hexad)
        );
    });
    return parsedAbilities;
};

export const removeSelectedChoices = (
    ability: ClassAbility,
    classAbilities: ClassAbility[],
    choices: ClassAbility[] | AnyMagickType[]
): (ClassAbility | AnyMagickType)[] => {
    const selections: string[] = [];
    classAbilities.forEach((x) => {
        if (!!x.selectedChoice) {
            selections.push(x.selectedChoice);
        }
    });
    return choices.filter(
        (choice) =>
            choice.description === ability.selectedChoice ||
            (!!choice.name && choice.name === ability.selectedChoice) ||
            (!selections.includes(choice.name) &&
                !selections.includes(choice.description))
    );
};

export const removeSelectedStringChoices = (
    ability: ClassAbility,
    classAbilities: ClassAbility[],
    choices: string[]
): string[] => {
    const multiplesAllowed = [
        'Favored Enemy',
        'Minor Arcana (General)',
        'Moderate Arcana (General)',
        'Major Arcana (General)',
        'High Arcana (General)',
        'Traditional Mastery',
    ];
    const selections: string[] = [];
    classAbilities.forEach((x) => {
        if (!!x.selectedChoice) {
            selections.push(x.selectedChoice);
        }
    });
    return choices.filter(
        (choice) =>
            choice === ability.selectedChoice ||
            !selections.includes(choice) ||
            multiplesAllowed.includes(ability.name)
    );
};
