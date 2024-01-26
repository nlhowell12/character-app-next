import { db } from "./db";

const Character = db.Character;


const getAll = async () => {
    const characters = await Character.find();
    return characters;
}

const getChar = async (charName: string) => {
    const character = await Character.findOne({name: charName})
    return character;
};

const getUser = async (user: string) => {
    const characters = await Character.find({playerName: user})
    return characters
};

const create = async (params: any) => {
    try {
        if(await Character.findOne({name: params.name})){
            throw 'Character name is already taken'
        }
        const newCharacter = new Character(params);
        await Character.create(newCharacter)
    } catch(e) {
        console.log(e)
        throw 'Failed to create character'
    }
};

const update = async (params: any) => {
    try {
        await Character.findOneAndUpdate({name: params.name}, params, {new: true});
    } catch(e) {
        throw 'Failed to update character'
    }
};

const remove = async (params: any) => {
    try {
        await Character.findOneAndDelete({name: params.name}, params);
    } catch(e) {
        throw 'Failed to delete character'
    }
};

export const characterRepo = {
    getAll,
    getUser,
    create,
    update,
    getChar,
    remove
};
