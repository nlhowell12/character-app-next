import { AnyMagickType, SpellObject } from "@/_models";
import { db } from "./db";

const Spell = db.Spell;


const getAll = async (): Promise<SpellObject> => {
    const spells = await Spell.find();
    const spellObject: SpellObject = {} as SpellObject;
    spells.forEach((doc: AnyMagickType) => {
        const charClass = doc.class as keyof SpellObject;
        if(!spellObject[charClass])
        {
            spellObject[charClass] = [];
        }
        spellObject[charClass].push(doc as any);
    })
    return spellObject;
}

export const spellRepo = {
    getAll,
};
