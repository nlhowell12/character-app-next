import { Character, ClassAbility, Movement, StatusEffects } from "@/_models";

export const getClassAbilities = (character: Character): ClassAbility[] => {
	const abilities: ClassAbility[][] = [];
	character.classes.forEach((cls) => {
		abilities.push(cls.classAbilities);
	});
	return abilities.flat();
};

export const reduceSpeed = (moveSpeeds: Movement[], reduction: 'half' | 'quarter') => {
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

export const checkForHalfMovement = (character: Character) => {
	const speedReductionStatusEffects = [StatusEffects.Blinded, StatusEffects.Exhausted, StatusEffects.Slowed]
    return character.statusEffects.some(x => speedReductionStatusEffects.includes(x)) ? reduceSpeed(character.movementSpeeds, 'half') : character.movementSpeeds;
}