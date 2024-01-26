import { db } from "./db";

const ClassAbility = db.ClassAbility;

const getAll = async () => {
    const classAbilities = await ClassAbility.find()
    return classAbilities;
}

export const classAbilityRepo = {
    getAll
}