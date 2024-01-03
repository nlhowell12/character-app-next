import { Character, CharacterClass, CharacterClassNames, Prayer, Spell, SpellObject } from "@/_models"
import { filterSpellObjectByCharacter } from "./spellUtils";

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
    'Oathsworn': [
        { name: 'Bless' } as Prayer
    ],
    'Sorcerer - Wizard': [
        { name: 'Mage Armor'} as Spell
    ]
} as unknown as SpellObject;

describe('spellUtils', () => {
    it('should return a filtered spell object based on the characters classes', () => {
        const expectedSorc = {
            'Sorcerer - Wizard': [
                { name: 'Mage Armor'}
            ]
        }
        const expectedOath = {
            'Oathsworn': [
                { name: 'Bless' } 
            ]
        }
        expect(filterSpellObjectByCharacter(mockSorc, mockSpellObject)).toStrictEqual(expectedSorc);
        expect(filterSpellObjectByCharacter(mockOath, mockSpellObject)).toStrictEqual(expectedOath);
    })
})