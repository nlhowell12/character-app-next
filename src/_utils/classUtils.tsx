import { AttributeNames, Character, CharacterClass, ClassAbility, DivineDomain, Movement, StatusEffects } from "@/_models";
import { getTotalAttributeModifier } from "./attributeUtils";

export const getClassAbilities = (character: Character): ClassAbility[] => {
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

export const getAllegianceTotal = (classInfo: CharacterClass) => {
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

	classInfo.classAbilities.filter(x => !!x.allegianceValue && !!x.domain).forEach(abl => {
		/* @ts-ignore */
		allegianceObject[abl.domain] += abl.allegianceValue
	});
	return allegianceObject;
};

export const sortDomainAspects = (classInfo: CharacterClass) => {
	const allegianceTotals = getAllegianceTotal(classInfo);
	return Object.keys(DivineDomain).sort((a,b) => allegianceTotals[b as DivineDomain] - allegianceTotals[a as DivineDomain])
}