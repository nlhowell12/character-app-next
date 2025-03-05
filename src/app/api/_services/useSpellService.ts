import { SpellObject, SpellTableObject } from '@/_models';
import { useEffect, useRef, useState } from 'react';

export default () => {
    const [spells, setSpells] = useState<SpellObject>();
    const [spellTables, setSpellTables] = useState<SpellTableObject>();
    const cachedSpells = useRef();
    const cachedSpellTables = useRef();

    useEffect(() => {
        getSpells();
        getSpellTables();
    }, []);

    const getSpells = async () => {
        if (!cachedSpells.current) {
            const res = await fetch('/api/spells');
            const spells = await res.json();
            cachedSpells.current = spells;
        }
        if (!!cachedSpells.current) {
            setSpells(cachedSpells.current);
        }
    };
    const getSpellTables = async () => {
        if (!cachedSpellTables.current) {
            const res = await fetch('/api/spelltables');
            const spellTablesRes = await res.json();
            cachedSpellTables.current = spellTablesRes;
        }
        if (!!cachedSpellTables.current) {
            setSpellTables(cachedSpellTables.current);
        }
    };
    return { spells, spellTables };
};
