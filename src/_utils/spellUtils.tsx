import { AnyMagickType, AttributeNames, Character, CharacterClassNames, MagickCategory, SpellObject } from '@/_models';
import { getTotalAttributeModifier } from './attributeUtils';

export const filterSpellObjectByCharacter = (
    character: Character,
    spells: SpellObject
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
            )
        ) {
            filteredSpellObject[CharacterClassNames.SorcWiz] =
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

export const getSpellDcAttribute = (character: Character, spell: AnyMagickType): number => {
    switch(spell.class) {
        case(CharacterClassNames.Cleric):
        case(CharacterClassNames.Oathsworn):
        case(CharacterClassNames.PsychicWarrior):
            if(spell.category === MagickCategory.Maneuver) {
                return getTotalAttributeModifier(character, AttributeNames.Strength)
            }
            return getTotalAttributeModifier(character, AttributeNames.Wisdom);
        case(CharacterClassNames.Shadowcaster):
        case(CharacterClassNames.Hexblade):
        case(CharacterClassNames.SorcWiz):
            if(spell.category === MagickCategory.Maneuver) {
                return getTotalAttributeModifier(character, AttributeNames.Strength)
            }
            if(character.classes.some(x => x.name === CharacterClassNames.Wizard)){
                return getTotalAttributeModifier(character, AttributeNames.Intelligence)
            }
            return getTotalAttributeModifier(character, AttributeNames.Charisma);
        case(CharacterClassNames.Psion):
            return getTotalAttributeModifier(character, AttributeNames.Intelligence);
        case(CharacterClassNames.Fighter):
            return getTotalAttributeModifier(character, AttributeNames.Strength);
        default:
            return 0
    }
};

export const getSpellDc = (character: Character, spell: AnyMagickType): number => {
    const attribute = getSpellDcAttribute(character, spell);
    return 10 + attribute + spell.level
};
