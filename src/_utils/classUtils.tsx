import { Character, ClassAbility } from "@/_models";

export const getClassAbilities = (character: Character): ClassAbility[] => {
	const abilities: ClassAbility[][] = [];
	character.classes.forEach((cls) => {
		abilities.push(cls.classAbilities);
	});
	return abilities.flat();
};
