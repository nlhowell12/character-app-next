import { Spell, MagickCategory, CharacterClassNames, ArcaneSchool, Character, Sizes, AttributeNames } from '@/_models';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const dbUrl = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_NAME;

mongoose.connect(`mongodb://${dbUrl}/${dbName}`);
mongoose.Promise = global.Promise;

export const db = {
    Spell: spellModel(),
    Character: characterModel()
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

function characterModel() {
    const characterSchema = new Schema<Character>({
        name: { type: String, required: true },
        race: { type: String, required: true },
        size: { type: String, enum: Sizes, required: true },
        movementSpeeds: [Object],
        subRace: { type: String },
        attributes: {type: Map, of: Object},
        classes: [Object],
        maxHitPoints: { type: Number, required: true },
        currentHitPoints: { type: Number, required: true },
        nonLethalDamage: { type: Number, required: true },
        tempHP: { type: Number, required: true },
        age: { type: Number },
        height: { type: String },
        weight: { type: Number },
        eyeColor: { type: String},
        hairColor: { type: String },
        languages: [String],
        skills: {type: Map, of: Object},
        equipment: [Object],
        miscModifiers: [Object],
        playerName: { type: String, required: true },
        experience: { type: Number, required: true },
        feats: [Object],
        spellBook: {type: Object, required: false}
    })
    return mongoose.models.Character || mongoose.model('Character', characterSchema, 'characters');

}