import { SpellsPerDay, SpellTableObject } from '@/_models';
import { db } from './db';

const DBSpellsPerDay = db.SpellsPerDay;

const getAll = async (): Promise<SpellTableObject> => {
    const spellTables = await DBSpellsPerDay.find();
    const spellTableObject: SpellTableObject = {} as SpellTableObject;
    spellTables.forEach((doc: SpellsPerDay) => {
        const charClass = doc.className as keyof SpellTableObject;
        if (!spellTableObject[charClass]) {
            spellTableObject[charClass] = [];
        }
        spellTableObject[charClass].push(doc as any);
    });
    return spellTableObject;
};

export const spellTableRepo = {
    getAll,
};
