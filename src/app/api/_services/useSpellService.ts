import { SpellObject } from "@/_models";
import { useEffect, useState } from "react";

export default () => {
    const [spells, setSpells] = useState<SpellObject>();

    useEffect(() => {
        getSpells()
    }, [])

    const getSpells = async () => {
        const res = await fetch('/api/spells');
        const spells = await res.json();
        if(!!spells)
        {
            setSpells(spells);
        }
    }
    return { spells }
}