import { CharacterKeys, AttributeNames, SkillTypes, Armor, Weapon, Dice, Spell, CharacterClassNames, SpellObject, Magick, Movement, MovementTypes, Maneuver, MartialQueue } from '@/_models';
import {
	CharacterReducerActions,
	addEquipmentAction,
	addMovementActions,
	characterReducer,
	deleteModAction,
	initialCharacterState,
	learnSpellAction,
	martialQueueAction,
	prepareSpellAction,
	removeEquipmentAction,
	removeMovementAction,
	resetAction,
	setCharacterAction,
	toggleEquippedAction,
	updateAction,
	updateAttributeAction,
	updateEquipmentAction,
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
		expect(newState.skills.Acrobatics).toStrictEqual({ ranks: 12, linkedAttribute: 'Dexterity', name: 'Acrobatics' });
		expect(initialCharacterState.skills.Perform).toBe(
			initialCharacterState.skills.Perform
		);
		expect(initialCharacterState.skills.Perception).toBe(
			initialCharacterState.skills.Perception
		);
	});
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
	it('should delete mod from character modifiers', () => {
		const modToDelete = mockCharacters[0].miscModifiers[0];
		const newState = characterReducer(mockCharacters[0], deleteModAction(modToDelete))
		expect(newState.miscModifiers.findIndex(x => modToDelete.id === x.id)).toBe(-1)
		expect(newState.miscModifiers.length).toBeGreaterThan(0);
		expect(newState.miscModifiers.length).toBe(mockCharacters[0].miscModifiers.length - 1);
	});
	it('should add and remove a spell to a class spellbook', () => {
		const spellToAdd = {name: 'Magic Missile'} as Spell;
		const spellBook: Partial<SpellObject> = {
			[CharacterClassNames.SorcWiz]: []
		};
		{/* @ts-ignore */}
		const newState = characterReducer({...mockCharacters[0], spellBook}, learnSpellAction(spellToAdd, CharacterClassNames.SorcWiz))
		expect(newState.spellBook[CharacterClassNames.SorcWiz]).toStrictEqual([spellToAdd]);
		const newState2 = characterReducer(newState, learnSpellAction(spellToAdd, CharacterClassNames.SorcWiz))
		expect(newState2.spellBook[CharacterClassNames.SorcWiz]).toStrictEqual([]);
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
		expect(update2State.skills.Acrobatics).toStrictEqual({ ranks: 12, linkedAttribute: 'Dexterity', name: 'Acrobatics' });
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
