import { Character, CharacterClassNames, SpellObject } from '@/_models';

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
            {
                /* @ts-ignore */
            }
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
