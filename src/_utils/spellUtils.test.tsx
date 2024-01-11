import { Character, CharacterClass, CharacterClassNames, MagickCategory, Maneuver, Mystery, Power, Prayer, Spell, SpellObject } from "@/_models"
import { filterSpellObjectByCharacter, getSpellDc, getSpellDcAttribute } from "./spellUtils";
import { mockCharacters } from "@/_mockData/characters";

const mockSorc = {
    classes: [
        {
            name: CharacterClassNames.Sorcerer
        } as CharacterClass
    ]
} as Character;
const mockOath = {
    classes: [
        {
            name: CharacterClassNames.Oathsworn
        } as CharacterClass
    ]
} as Character;

const mockSpellObject = {
    [CharacterClassNames.Cleric]: [
        { name: 'Bless', class: CharacterClassNames.Oathsworn, category: MagickCategory.Divine, level: 1 } as Prayer,
    ],
    [CharacterClassNames.Oathsworn]: [
        { name: 'Bless', class: CharacterClassNames.Oathsworn, category: MagickCategory.Divine, level: 1 } as Prayer,
        { name: 'Maneuver', class: CharacterClassNames.Oathsworn, category: MagickCategory.Maneuver, level: 1 } as Maneuver,
    ],
    [CharacterClassNames.PsychicWarrior]: [
        { name: 'Bless', class: CharacterClassNames.PsychicWarrior, category: MagickCategory.Psionic, level: 1 } as Power,
        { name: 'Maneuver', class: CharacterClassNames.PsychicWarrior, category: MagickCategory.Maneuver, level: 1 } as Maneuver,
    ],
    [CharacterClassNames.Hexblade]: [
        { name: 'Bless', class: CharacterClassNames.PsychicWarrior, category: MagickCategory.Psionic, level: 1 } as Spell,
        { name: 'Maneuver', class: CharacterClassNames.PsychicWarrior, category: MagickCategory.Maneuver, level: 1 } as Maneuver,
    ],
    [CharacterClassNames.Fighter]: [
        { name: 'Maneuver', class: CharacterClassNames.Fighter, category: MagickCategory.Maneuver, level: 1 } as Maneuver,
    ],
    [CharacterClassNames.SorcWiz]: [
        { name: 'Mage Armor', class: CharacterClassNames.SorcWiz, level: 1} as Spell,
    ],
    [CharacterClassNames.Shadowcaster]: [
        { name: 'Mage Armor', class: CharacterClassNames.Shadowcaster, level: 1} as Mystery,
    ],
    [CharacterClassNames.Psion]: [
        { name: 'Mage Armor', class: CharacterClassNames.Psion, level: 1} as Power,
    ],

} as unknown as SpellObject;

describe('spellUtils', () => {
    const mock0 = mockCharacters[0];
    it('should return a filtered spell object based on the characters classes', () => {
        const expectedSorc = {
            'Sorcerer - Wizard': mockSpellObject["Sorcerer - Wizard"]
        }
        const expectedOath = {
            'Oathsworn': mockSpellObject.Oathsworn
        }
        expect(filterSpellObjectByCharacter(mockSorc, mockSpellObject)).toStrictEqual(expectedSorc);
        expect(filterSpellObjectByCharacter(mockOath, mockSpellObject)).toStrictEqual(expectedOath);
    })
    it('should return the correct attribute value based on class', () => {
        expect(getSpellDcAttribute(mock0, mockSpellObject.Oathsworn[0])).toBe(1)
        expect(getSpellDcAttribute(mock0, mockSpellObject.Cleric[0])).toBe(1)
        expect(getSpellDcAttribute(mock0, mockSpellObject.Oathsworn[1])).toBe(-2)
        expect(getSpellDcAttribute(mock0, mockSpellObject.Hexblade[0])).toBe(1)
        expect(getSpellDcAttribute(mock0, mockSpellObject.Hexblade[1])).toBe(-2)
        expect(getSpellDcAttribute(mock0, mockSpellObject.Fighter[0])).toBe(-2)
        expect(getSpellDcAttribute(mock0, mockSpellObject.Psion[0])).toBe(2)
        expect(getSpellDcAttribute(mock0, mockSpellObject["Psychic Warrior"][0])).toBe(1)
        expect(getSpellDcAttribute(mock0, mockSpellObject["Psychic Warrior"][1])).toBe(-2)
        expect(getSpellDcAttribute({...mock0, classes: [{name: CharacterClassNames.Sorcerer}] as CharacterClass[]}, mockSpellObject["Sorcerer - Wizard"][0])).toBe(0)
        expect(getSpellDcAttribute({...mock0, classes: [{name: CharacterClassNames.Wizard}] as CharacterClass[]}, mockSpellObject["Sorcerer - Wizard"][0])).toBe(2)
    })
    it('should return the correct dc for a spell', () => {
        expect(getSpellDc(mock0, mockSpellObject.Oathsworn[0])).toBe(12)
        expect(getSpellDc(mock0, mockSpellObject.Cleric[0])).toBe(12)
        expect(getSpellDc(mock0, mockSpellObject.Oathsworn[1])).toBe(9)
        expect(getSpellDc(mock0, mockSpellObject.Hexblade[0])).toBe(12)
        expect(getSpellDc(mock0, mockSpellObject.Hexblade[1])).toBe(9)
        expect(getSpellDc(mock0, mockSpellObject.Fighter[0])).toBe(9)
        expect(getSpellDc(mock0, mockSpellObject.Psion[0])).toBe(13)
        expect(getSpellDc(mock0, mockSpellObject["Psychic Warrior"][0])).toBe(12)
        expect(getSpellDc(mock0, mockSpellObject["Psychic Warrior"][1])).toBe(9)
        expect(getSpellDc({...mock0, classes: [{name: CharacterClassNames.Sorcerer}] as CharacterClass[]}, mockSpellObject["Sorcerer - Wizard"][0])).toBe(11)
        expect(getSpellDc({...mock0, classes: [{name: CharacterClassNames.Wizard}] as CharacterClass[]}, mockSpellObject["Sorcerer - Wizard"][0])).toBe(13)
    })
})