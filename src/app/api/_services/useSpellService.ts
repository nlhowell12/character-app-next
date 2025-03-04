import { SpellObject } from '@/_models';
import { useEffect, useRef, useState } from 'react';

export default () => {
    const [spells, setSpells] = useState<SpellObject>();
    const cachedSpells = useRef();

    useEffect(() => {
        getSpells();
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
    return { spells };
};
