import { Spell, MagickCategory, ArcaneSchool, CharacterClassNames } from '@/_models';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dbUrl = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_NAME;

mongoose.connect(`mongodb://${dbUrl}/${dbName}`);
mongoose.Promise = global.Promise;

export const db = {
    Spell: spellModel()
};

function spellModel() {
    const spellSchema = new Schema<Spell>({
        name: { type: String, required: true },
        range: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String, required: true },
        descriptors: String,
        category: { type: String, enum: MagickCategory, required: true },
        class: { type: String, enum: CharacterClassNames, required: true },
        level: { type: Number, required: true },
        damageType: String,
        savingThrow: String,
        action: { type: String, required: true },
        bonusType: String,
        school: { type: String, required: true, enum: ArcaneSchool },
    });

    return mongoose.models.Spell || mongoose.model('Spell', spellSchema, 'spells');
}