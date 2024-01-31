import { Feat } from "@/_models";
import { useEffect, useState } from "react";

export default () => {
    const [feats, setFeats] = useState<Feat[]>();

    useEffect(() => {
        getFeats();
    }, []);

    const getFeats = async () => {
        const res = await fetch('/api/feats')
        const feats = await res.json();
        setFeats(feats);
    }
    return { feats }
}