import { AttributeNames, Character, CharacterClass, CharacterClassNames, ClassAbility, DivineDomain, Movement, StatusEffects } from "@/_models";
import { getTotalAttributeModifier } from "./attributeUtils";

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
	const speedReductionStatusEffects = [StatusEffects.Blinded, StatusEffects.Exhausted, StatusEffects.Slowed]
    return character.statusEffects.some(x => speedReductionStatusEffects.includes(x)) ? reduceSpeed(character.movementSpeeds, 'half') : character.movementSpeeds;
}

export const getInitiativeScore = (character: Character): string => {
	const attBonus = getTotalAttributeModifier(character, AttributeNames.Dexterity);
	const modValue = character.miscModifiers.filter(x => !!x.initiative).reduce((x,y) => x + y.value, 0);
	const total = attBonus + modValue;
    return `${total > 0 ? '+': ''}${total}`;
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
	return allegianceObject;
};

export const sortDomainAspects = (character: Character) => {
	const allegianceTotals = getAllegianceTotal(character);
	return Object.keys(DivineDomain).sort((a,b) => allegianceTotals[b as DivineDomain] - allegianceTotals[a as DivineDomain])
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
}