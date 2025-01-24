import { AttributeNames, Character, CharacterClass, CharacterClassNames, ClassAbility, DivineDomain, Movement, StatusEffects } from "@/_models";
import { getAttributeModifier, getBaseAttributeScore, getTotalAttributeModifier } from "./attributeUtils";
import * as R from 'ramda';

type ClassAbilityObject =  {
	[key in CharacterClassNames]: ClassAbility[]
};

export enum DomainAspectFeats {
	ImprovedCounterchannel = 'Improved Counterchannel'
};

export const getAllClassAbilities = (character: Character): ClassAbility[] => {
	const abilities: ClassAbility[][] = [];
	character.classes.forEach((cls) => {
		abilities.push(cls.classAbilities);
	});
	return abilities.flat();
};

export const reduceSpeed = (moveSpeeds: Movement[], reduction: 'half' | 'quarter'): Movement[] => {
	const returnMoves: Movement[] = [];
	switch(reduction){
		case 'half':
			moveSpeeds.forEach(x => {
				returnMoves.push({type: x.type, speed: x.speed * .5})
			})
			return returnMoves
		case 'quarter':
			moveSpeeds.forEach(x => {
				returnMoves.push({type: x.type, speed: x.speed * .25})
			})
			return returnMoves
		default:
			return moveSpeeds;
	}
}

export const checkForHalfMovement = (character: Character): Movement[] => {
	const speedReductionStatusEffects = [StatusEffects.Blinded, StatusEffects.Exhausted, StatusEffects.Slowed, StatusEffects.Entangled]
    return character.statusEffects.some(x => speedReductionStatusEffects.includes(x)) ? reduceSpeed(character.movementSpeeds, 'half') : character.movementSpeeds;
}

export const getInitiativeScore = (character: Character): string => {
	const attBonus = getTotalAttributeModifier(character, AttributeNames.Dexterity);
	const modValue = character.miscModifiers.filter(x => !!x.initiative).reduce((x,y) => x + y.value, 0);
	const deafened = character.statusEffects.includes(StatusEffects.Deafened) ? -4 : 0
	const total = attBonus + modValue + deafened;
    return `${total > 0 ? '+': ''}${total}`;
};

export const hasMartialClass = (character: Character): boolean => {
	const martialClasses = [CharacterClassNames.Fighter, CharacterClassNames.Hexblade, CharacterClassNames.Oathsworn, CharacterClassNames.PsychicWarrior];
	return character.classes.some(x => martialClasses.includes(x.name));
};

export const getAllegianceTotal = (character: Character) => {
	const allegianceObject: {[key in DivineDomain]: number} = {
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
		[DivineDomain.Cosmic]: 0
	};
	const clericClassAbilities = getClassAbilities(character.classes)[CharacterClassNames.Cleric];
	if(clericClassAbilities){
		clericClassAbilities.filter(x => !!x.allegianceValue && !!x.domain).forEach(abl => {
			/* @ts-ignore */
			allegianceObject[abl.domain] += abl.allegianceValue
		});
	}
	character.feats.forEach(x => {
		if(x.name === DomainAspectFeats.ImprovedCounterchannel && !!x.selectedOption){
			allegianceObject[x.selectedOption as DivineDomain] += 1
		}
	})
	character.classes.forEach(cls => {
		if(cls.name === CharacterClassNames.Cleric){
			if(!!cls.turnDomain){
				allegianceObject[cls.turnDomain] += 3;
			}
			if(!!cls.rebukeDomain){
				allegianceObject[cls.rebukeDomain] += 2;
			}
			if(!!cls.spontaneousChannelDomain){
				allegianceObject[cls.spontaneousChannelDomain] += 1;
			}
		};
	})
	return allegianceObject;
};

export const sortDomainAspects = (character: Character) => {
	const allegianceTotals = getAllegianceTotal(character);
	const diff = (a: DivineDomain, b: DivineDomain) => {
		if (allegianceTotals[a] > allegianceTotals[b]){
			return -1
		}
		else if (allegianceTotals[a] < allegianceTotals[b]){
			return 1
		}
		const cleric = character.classes.filter(x => x.name === CharacterClassNames.Cleric)[0];
		const preferredDomainA = cleric.preferredDomains?.includes(a);
		const preferredDomainB = cleric.preferredDomains?.includes(b);
		if(preferredDomainA && !preferredDomainB){
			return -1
		} else if (!preferredDomainA && preferredDomainB) {
			return 1
		}
		return 0
	}
	return R.sort(diff, Object.keys(DivineDomain) as DivineDomain[])
}

export const getAlignedDomainAspects = (character: Character) => {
	return sortDomainAspects(character).slice(0, 5);
};

export const getAlignedOrisons = (character: Character, abilities: ClassAbility[]) => {
	const orisons = abilities.filter(x => !!x.domain && x.level === 0 && x.className === CharacterClassNames.Cleric);
	const alignedDomains = getAlignedDomainAspects(character);
	return orisons.filter(abl => !!abl.domain && alignedDomains.includes(abl.domain));
};

export const getClassAbilities = (classes: CharacterClass[]): Partial<ClassAbilityObject> => {
	type ClassAbilityObject =  {
		[key in CharacterClassNames]: ClassAbility[]
	};
	let classAbilityObject: Partial<ClassAbilityObject> = {};
	classes.forEach(cls => {
		if(cls.name === CharacterClassNames.Cleric){
			classAbilityObject[cls.name] = [...cls.classAbilities]
		} else {
			classAbilityObject[cls.name] = cls.classAbilities
		}
	})
	return classAbilityObject;
};

export const getTotalClassLevels = (character: Character) => {
	return character.classes.reduce((x: number, y: CharacterClass) => x + y.level, 0)
};

export const getHexbladeCurseDC = (character: Character) => {
	const isHexblade = character.classes.some(x => x.name === CharacterClassNames.Hexblade);
	const charismaMod  = getAttributeModifier(getBaseAttributeScore(character, AttributeNames.Charisma))
	const characterLevel = getTotalClassLevels(character);
	const hexbladeDC = Math.floor(10 + (characterLevel / 2) + charismaMod);
	return isHexblade ? hexbladeDC : null;
};