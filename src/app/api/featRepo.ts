import { db } from "./db";

const Feat = db.Feat;

const getFeats = async () => {
    const feats = await Feat.find()
    return feats;
}
export const featRepo = {
    getFeats,
}