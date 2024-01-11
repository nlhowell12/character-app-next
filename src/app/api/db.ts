import { Spell, MagickCategory, CharacterClassNames, ArcaneSchool, Character, Sizes } from '@/_models';
import { User } from '@/_models/user';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const dbPw = process.env.MONGO_PW;

const dbUrl = `mongodb+srv://nlhowell12:${dbPw}@characterbuilder.3boqqau.mongodb.net/character_sheet?retryWrites=true&w=majority`;

mongoose.connect(`${dbUrl}`).then(() => {
    console.log('Connected to Atlas')
})
mongoose.Promise = global.Promise;

export const db = {
    Spell: spellModel(),
    Character: characterModel(),
    User: userModel()
};

function userModel(){
    const userSchema = new Schema<User>({
        name: { type: String, required: true },
        password: { type: String, required: true },
        isDm: { type: Boolean, required: true },
    })
    return mongoose.models.User || mongoose.model('User', userSchema, 'users');
}
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
        savingThrow: {type: String, required: true},
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
        proficiencies: [String],
        specialAbilities: [String],
        skills: {type: Map, of: Object},
        currency: {type: Map, of: Object},
        equipment: [Object],
        miscModifiers: [Object],
        playerName: { type: String, required: true },
        experience: { type: Number, required: true },
        feats: [Object],
        spellBook: {type: Map, of: Object},
        notes: [Object],
        isPsionic: Boolean,
        powerPoints: { type: Number },
        maxPowerPoints: { type: Number },
        heroPoints: { type: Number },
    })
    return mongoose.models.Character || mongoose.model('Character', characterSchema, 'characters');

}