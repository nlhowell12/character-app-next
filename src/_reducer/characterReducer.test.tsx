import { CharacterKeys, AttributeNames, SkillTypes, Armor, Weapon, Dice, Spell, CharacterClassNames, SpellObject, Magick, Movement, MovementTypes, Maneuver, MartialQueue, Note, DivineDomain, CharacterClass } from '@/_models';
import {
	CharacterReducerActions,
	addEquipmentAction,
	addMovementActions,
	addNoteAction,
	characterReducer,
	deleteModAction,
	deleteNoteAction,
	initialCharacterState,
	learnSpellAction,
	martialQueueAction,
	prepareSpellAction,
	removeEquipmentAction,
	removeMovementAction,
	replaceEquipmentAction,
	resetAction,
	setCharacterAction,
	toggleEquippedAction,
	togglePreferredDomainAction,
	updateAction,
	updateAttributeAction,
	updateClassAbilityAction,
	updateEquipmentAction,
	updateNoteAction,
	updateSkillAction,
} from './characterReducer';
import { mockCharacters } from '@/_mockData/characters';
import * as R from 'ramda';
import { dagger, magicLeather, sword } from '@/_utils/equipmentUtils.test';

describe('characterReducer', () => {
	it('should set state to character', () => {
		const newState = characterReducer(initialCharacterState, setCharacterAction(mockCharacters[0]));
		expect(newState).toStrictEqual(mockCharacters[0])
	});
	it('should update character keys correctly', () => {
		const name = 'Kyrin';
		const newState = characterReducer(
			initialCharacterState,
			updateAction(CharacterKeys.name, name)
		);
		expect(newState.name).toBe(name);
	});
	it('should update attributes correctly', () => {
		const newState = characterReducer(
			initialCharacterState,
			updateAttributeAction(AttributeNames.Strength, 12)
		);
		expect(newState.attributes.Strength.value).toBe(12);
		expect(initialCharacterState.attributes.Wisdom).toBe(
			initialCharacterState.attributes.Wisdom
		);
		expect(initialCharacterState.attributes.Charisma).toBe(
			initialCharacterState.attributes.Charisma
		);
	});
	it('should update skills correctly', () => {
		const newState = characterReducer(
			initialCharacterState,
			updateSkillAction(SkillTypes.Acrobatics, 12)
		);
		expect(newState.skills.Acrobatics).toStrictEqual({ ranks: 12, linkedAttribute: 'Dexterity', name: 'Acrobatics', armorCheckPenalty: true,
		});
		expect(initialCharacterState.skills.Perform).toBe(
			initialCharacterState.skills.Perform
		);
		expect(initialCharacterState.skills.Perception).toBe(
			initialCharacterState.skills.Perception
		);
	});
	it('should add/remove notes correctly', () => {
		const note: Note = {id: '12345', title: 'New Note', note: 'This is a new note.'};
		const newState = characterReducer(
			initialCharacterState,
			addNoteAction(note)
		);
		expect(newState.notes.findIndex(x => x.id === note.id)).toBe(0)
		const updateValue = 'I have updated the note'
		const newState2 = characterReducer(newState, updateNoteAction(updateValue, note.id))
		expect(newState2.notes[0].note).toBe(updateValue)
		const newState3 = characterReducer(newState2, deleteNoteAction(note.id))
		expect(newState3.notes.length).toBe(0);
	})
	it('should update class abilities correctly', () => {
		const newState = characterReducer(
			mockCharacters[0],
			updateClassAbilityAction(CharacterClassNames.Rogue, {description: 'This is a test', name: 'test ability',level: 1, className: CharacterClassNames.Rogue})
		);
		const newState2 = characterReducer(
			newState,
			updateClassAbilityAction(CharacterClassNames.Rogue, {description: 'This is a test', name: 'test ability', level: 1, className: CharacterClassNames.Rogue})
		);
		expect(newState.classes[0].classAbilities.some(x => x.description === 'This is a test'))
		expect(newState2.classes[0].classAbilities.some(x => x.description === 'This is a test')).toBeFalsy()
	})
	it('should equip/unequip items', () => {
		const initStateWithArmor = {...initialCharacterState, equipment: [{name: 'Armor', equipped: false} as Armor]}
		let newState = characterReducer(initStateWithArmor, toggleEquippedAction({name: 'Armor'} as Armor))
		const eqArmor = newState.equipment[0] as Armor;
		expect(eqArmor.equipped).toBeTruthy()
		const nextState = characterReducer(newState, toggleEquippedAction({name: 'Armor'} as Armor))
		const unEqArmor = nextState.equipment[0] as Armor;
		expect(unEqArmor.equipped).toBeFalsy()

	});
	it('should add items to equipment', () => {
		const newWeapon: Weapon = {
			id: '12345',
			name: 'Dagger',
			category: 'Knives', 
			damage: Dice.d4,
			numberOfDice: 1,
		} as Weapon;
		const newState = characterReducer(initialCharacterState, addEquipmentAction(newWeapon))
		expect(R.findIndex(x => x.id === newWeapon.id, newState.equipment)).toBeGreaterThanOrEqual(0)
	});
	it('should should remove items from equipment', () => {
		const newWeapon: Weapon = {
			id: '12345',
			name: 'Dagger',
			category: 'Knives', 
			damage: Dice.d4,
			numberOfDice: 1,
		} as Weapon;
		const newState = characterReducer({...initialCharacterState, equipment: [newWeapon]}, removeEquipmentAction(newWeapon))
		expect(R.findIndex(x => x.id === newWeapon.id, newState.equipment)).toBe(-1)
	});
	it('should update key on specific equipment', () => {
		const updatedHardness = 30;
		const newState = characterReducer({...mockCharacters[0], equipment: [magicLeather, dagger, sword]}, updateEquipmentAction(magicLeather.id, updatedHardness, 'hardness'))
		expect(newState.equipment).toStrictEqual([{...magicLeather, hardness: updatedHardness}, dagger, sword])
	});
	it('should replace equipment correctly', () => {
		const replaceMagicLeather = {...magicLeather, name: 'Magic Leather +1', weight: 1}
		const newState = characterReducer({...mockCharacters[0], equipment: [magicLeather, dagger, sword]}, replaceEquipmentAction(magicLeather.id, replaceMagicLeather))
		expect(newState.equipment).toStrictEqual([replaceMagicLeather, dagger, sword])
	})
	it('should delete mod from character modifiers', () => {
		const modToDelete = mockCharacters[0].miscModifiers[0];
		const newState = characterReducer(mockCharacters[0], deleteModAction(modToDelete))
		expect(newState.miscModifiers.findIndex(x => modToDelete.id === x.id)).toBe(-1)
		expect(newState.miscModifiers.length).toBeGreaterThan(0);
		expect(newState.miscModifiers.length).toBe(mockCharacters[0].miscModifiers.length - 1);
	});
	it('should add and remove a spell to a class spellbook', () => {
		const spellToAdd = {name: 'Magic Missile'} as Spell;
		const martialManeuver = {name: 'Cool shit'} as Maneuver;

		const spellBook: Partial<SpellObject> = {
			[CharacterClassNames.SorcWiz]: [],
			[CharacterClassNames.Fighter]: [martialManeuver],
		};
		const martialQueue: Partial<MartialQueue> = {
			[CharacterClassNames.Fighter]: [martialManeuver],

		}
		{/* @ts-ignore */}
		const newState = characterReducer({...mockCharacters[0], spellBook}, learnSpellAction(spellToAdd, CharacterClassNames.SorcWiz))
		expect(newState.spellBook[CharacterClassNames.SorcWiz]).toStrictEqual([spellToAdd]);
		const newState2 = characterReducer(newState, learnSpellAction(spellToAdd, CharacterClassNames.SorcWiz))
		expect(newState2.spellBook[CharacterClassNames.SorcWiz]).toStrictEqual([]);
		{/* @ts-ignore */}
		const fighterState = characterReducer({...mockCharacters[0], spellBook, martialQueue}, learnSpellAction(martialManeuver, CharacterClassNames.Fighter))
		expect(fighterState.spellBook[CharacterClassNames.Fighter]).toStrictEqual([])
		expect(fighterState.martialQueue[CharacterClassNames.Fighter]).toStrictEqual([])
	})
	it('should add and remove a martial maneuver from the queue', () => {
		const spellToAdd = {name: 'Blade Dance'} as Maneuver;
		const martialQueue: Partial<MartialQueue> = {
			[CharacterClassNames.Fighter]: []
		};
		{/* @ts-ignore */}
		const newState = characterReducer({...mockCharacters[0], martialQueue}, martialQueueAction(spellToAdd, CharacterClassNames.Fighter))
		expect(newState.martialQueue[CharacterClassNames.Fighter]).toStrictEqual([spellToAdd]);
		const newState2 = characterReducer(newState, martialQueueAction(spellToAdd, CharacterClassNames.Fighter))
		expect(newState2.martialQueue[CharacterClassNames.Fighter]).toStrictEqual([]);
	})
	it('should prepare and unprepare a spell', () => {
		const spellToAdd = {name: 'Magic Missile', prepared: 1} as Spell;
		const spellBook: Partial<SpellObject> = {
			[CharacterClassNames.SorcWiz]: [spellToAdd]
		};
		{/* @ts-ignore */}
		const newState = characterReducer({...mockCharacters[0], spellBook}, prepareSpellAction(spellToAdd, CharacterClassNames.SorcWiz))
		const key = CharacterClassNames.SorcWiz as keyof SpellObject
		expect((newState.spellBook[key][0] as Magick).prepared).toBe(1);
	})
	it('should add and remove movement speeds', () => {
		const newMovement: Movement = {
			type: MovementTypes.Fly,
			speed: 60
		};
		const newState = characterReducer(mockCharacters[0], addMovementActions(newMovement));
		expect(newState.movementSpeeds.includes(newMovement)).toBeTruthy()
		const newState2 = characterReducer(newState, removeMovementAction(newMovement));
		expect(newState2.movementSpeeds.includes(newMovement)).toBeFalsy();
	})
	it('should add and remove preferred domains', () => {
		const mock0WithCleric = {...mockCharacters[0], classes: [{name: CharacterClassNames.Cleric} as CharacterClass]};
		const newState = characterReducer(mock0WithCleric, togglePreferredDomainAction(DivineDomain.Fire));
		expect(newState.classes[0].preferredDomains?.includes(DivineDomain.Fire)).toBeTruthy();
		const newState2 = characterReducer(newState, togglePreferredDomainAction(DivineDomain.Fire));
		expect(newState2.classes[0].preferredDomains?.includes(DivineDomain.Fire)).toBeFalsy();

	})
	it('should reset to initial', () => {
		const name = 'Kyrin';
		const newState = characterReducer(
			initialCharacterState,
			updateAction(CharacterKeys.name, name)
		);
		const updateState = characterReducer(
			newState,
			updateAttributeAction(AttributeNames.Strength, 12)
		);
		const update2State = characterReducer(
			updateState,
			updateSkillAction(SkillTypes.Acrobatics, 12)
		);
		expect(update2State.attributes.Strength.value).toBe(12);
		expect(update2State.skills.Acrobatics).toStrictEqual({ ranks: 12, linkedAttribute: 'Dexterity', name: 'Acrobatics', armorCheckPenalty: true });
		expect(update2State.name).toBe(name);
		const finalState = characterReducer(update2State, resetAction());
		expect(finalState).toStrictEqual(initialCharacterState);
	});
	it('should return state if not covered by switch', () => {
		expect(characterReducer(initialCharacterState, {
			type: CharacterReducerActions.DEFAULT,
			payload: {
				key: CharacterKeys.age,
				value: ''
			}})).toStrictEqual(initialCharacterState);
	})
});
