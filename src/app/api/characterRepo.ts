import { Character } from "@/_models";
import { db } from "./db";

const Character = db.Character;


const getAll = async (): Promise<Character[]> => {
    const characters = await Character.find();
    return characters;
}

export const characterRepo = {
    getAll,
};
