import {
    AnyMagickType,
    AttributeNames,
    Character,
    CharacterClassNames,
    MagickCategory,
    MartialQueue,
    Mystery,
    Power,
    Prayer,
    Spell,
    SpellObject,
} from '@/_models';
import { getTotalAttributeModifier } from './attributeUtils';

export const filterSpellObjectByCharacter = (
    character: Character,
    spells: SpellObject | MartialQueue,
    martial?: boolean
): SpellObject => {
    const filteredSpellObject: SpellObject = {} as SpellObject;
    Object.keys(spells).forEach((x: string) => {
        const className = x as keyof SpellObject;
        if (character.classes.some((cls) => cls.name === className)) {
            /* @ts-ignore */
            filteredSpellObject[className] = spells[className];
        } else if (
            character.classes.some(
                (cls) =>
                    cls.name === CharacterClassNames.Sorcerer ||
                    cls.name === CharacterClassNames.Wizard
            ) && !martial
        ) {
            filteredSpellObject[CharacterClassNames.SorcWiz] =
                /* @ts-ignore */
                spells[CharacterClassNames.SorcWiz];
        }
    });
    return filteredSpellObject;
};

export const isCharacterPsionic = (character: Character): boolean => {
    return (
        character.isPsionic ||
        character.classes.some(
            (cls) =>
                cls.name === CharacterClassNames.Psion ||
                cls.name === CharacterClassNames.PsychicWarrior
        )
    );
};

export const getSpellDcAttribute = (
    character: Character,
    spell: AnyMagickType,
    useDex?: boolean
): number | undefined => {
    const getManeuverMod = () =>
        getTotalAttributeModifier(
            character,
            useDex ? AttributeNames.Dexterity : AttributeNames.Strength
        );
    switch (spell.class) {
        case CharacterClassNames.Cleric:
        case CharacterClassNames.Oathsworn:
        case CharacterClassNames.PsychicWarrior:
            if (spell.category === MagickCategory.Maneuver) {
                return getManeuverMod();
            }
            return getTotalAttributeModifier(character, AttributeNames.Wisdom);
        case CharacterClassNames.Shadowcaster:
        case CharacterClassNames.Hexblade:
        case CharacterClassNames.SorcWiz:
            if (spell.category === MagickCategory.Maneuver) {
                return getManeuverMod();
            }
            if (
                character.classes.some(
                    (x) => x.name === CharacterClassNames.Wizard
                )
            ) {
                return getTotalAttributeModifier(
                    character,
                    AttributeNames.Intelligence
                );
            }
            return getTotalAttributeModifier(
                character,
                AttributeNames.Charisma
            );
        case CharacterClassNames.Psion:
            return getTotalAttributeModifier(
                character,
                AttributeNames.Intelligence
            );
        case CharacterClassNames.Fighter:
            return getManeuverMod();
    }
};

export const getSpellDc = (
    character: Character,
    spell: AnyMagickType,
    useDex?: boolean
): number => {
    const attribute = getSpellDcAttribute(character, spell, useDex);
    const modsValue = character.miscModifiers.filter(
        (x) =>
            !!x.spellSchool &&
            (x.spellSchool === (spell as Spell).school ||
            x.spellSchool === (spell as Power).discipline ||
            x.spellSchool === (spell as Prayer).domain ||
            x.spellSchool === (spell as Mystery).path)
    ).reduce((x, y) => x + y.value, 0);
    return 10 + (attribute || 0) + spell.level + modsValue;
};
