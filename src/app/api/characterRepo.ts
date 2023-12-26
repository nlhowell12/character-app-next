import { db } from "./db";

const Character = db.Character;


const getAll = async () => {
    const characters = await Character.find();
    return characters;
}

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

export const characterRepo = {
    getAll,
    create,
    update
};
