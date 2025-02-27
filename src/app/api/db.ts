import {
    Spell,
    MagickCategory,
    CharacterClassNames,
    ArcaneSchool,
    Character,
    Sizes,
    ClassAbility,
    BodySlot,
    Dice,
    DBEquipment,
    Feat,
    AttributeNames,
    AbilityTypes,
} from '@/_models';
import { User } from '@/_models/user';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const dbPw = process.env.MONGO_PW;

const dbUrl = `mongodb+srv://nlhowell12:${dbPw}@characterbuilder.3boqqau.mongodb.net/character_sheet?retryWrites=true&w=majority`;

mongoose.connect(`${dbUrl}`).then(() => {
    console.log('Connected to Atlas');
});
mongoose.Promise = global.Promise;

export const db = {
    Spell: spellModel(),
    Character: characterModel(),
    User: userModel(),
    ClassAbility: classAbilityModel(),
    Equipment: equipmentModel(),
    Feat: featModel(),
};

function userModel() {
    const userSchema = new Schema<User>({
        name: { type: String, required: true },
        password: { type: String, required: true },
        isDm: { type: Boolean, required: true },
    });
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
        savingThrow: { type: String, required: true },
        action: { type: String, required: true },
        bonusType: String,
        school: { type: String, required: true, enum: ArcaneSchool },
    });

    return (
        mongoose.models.Spell || mongoose.model('Spell', spellSchema, 'spells')
    );
}

function characterModel() {
    const characterSchema = new Schema<Character>({
        name: { type: String, required: true },
        race: { type: String, required: true },
        size: { type: String, enum: Sizes, required: true },
        movementSpeeds: [Object],
        subRace: { type: String },
        attributes: { type: Map, of: Object },
        classes: [Object],
        maxHitPoints: { type: Number, required: true },
        currentHitPoints: { type: Number, required: true },
        nonLethalDamage: { type: Number, required: true },
        tempHP: { type: Number, required: true },
        age: { type: Number },
        height: { type: String },
        weight: { type: Number },
        eyeColor: { type: String },
        hairColor: { type: String },
        languages: [String],
        proficiencies: [String],
        specialAbilities: [String],
        skills: { type: Map, of: Object },
        currency: { type: Map, of: Object },
        equipment: [Object],
        miscModifiers: [Object],
        playerName: { type: String, required: true },
        experience: { type: Number, required: true },
        feats: [Object],
        spellBook: { type: Map, of: Object },
        martialQueue: { type: Map, of: Object },
        notes: [Object],
        isPsionic: Boolean,
        powerPoints: { type: Number },
        maxPowerPoints: { type: Number },
        heroPoints: { type: Number },
        statusEffects: { type: [String], required: true },
        specialResources: { type: Map, of: Object },
    });
    return (
        mongoose.models.Character ||
        mongoose.model('Character', characterSchema, 'characters')
    );
}

function classAbilityModel() {
    const classAbilitySchema = new Schema<ClassAbility>({
        name: { type: String, required: true },
        level: { type: Number, required: true },
        className: { type: String, required: true, enum: CharacterClassNames },
        description: { type: String, required: true },
        abilityType: { type: String, enum: AbilityTypes },
        allegianceValue: { type: Number },
        domain: { type: String },
        school: { type: String },
        discipline: { type: String },
        choices: { type: Array },
        saveAttribute: { type: String, enum: AttributeNames },
        path: { type: String },
        selectedChoice: { type: String },
        isMusic: { type: Boolean },
        isRefrain: { type: Boolean },
    });
    return (
        mongoose.models.ClassAbility ||
        mongoose.model('ClassAbility', classAbilitySchema, 'class_abilities')
    );
}

function equipmentModel() {
    const equipmentSchema = new Schema<DBEquipment>({
        id: { type: String, required: true },
        name: { type: String, required: true },
        weight: { type: Number, required: true },
        size: { type: String, required: true },
        modifiers: [Object],
        bodySlot: { type: String, enum: BodySlot },
        armorCheckPenalty: { type: Number },
        maxDexBonus: { type: Number },
        spellFailure: { type: Number },
        hardness: { type: Number },
        isArmor: Boolean,
        category: { type: String },
        numberOfDice: { type: Number },
        damage: { type: String, enum: Dice },
        damageTypes: [String],
        twoHanded: Boolean,
        criticalRange: { type: Number, required: true },
        criticalMultiplier: { type: Number, required: true },
        rangeIncrement: { type: Number, required: true },
        dexBasedAttack: Boolean,
        dexBasedDamage: Boolean,
        isWeapon: Boolean,
    });
    return (
        mongoose.models.Equipment ||
        mongoose.model('Equipment', equipmentSchema, 'equipment')
    );
}

function featModel() {
    const featSchema = new Schema<Feat>({
        prerequisites: { type: String },
        name: { type: String, required: true },
        definition: { type: String, required: true },
        category: { type: String, required: true },
        stackable: Boolean,
        requiredOption: Boolean,
    });
    return mongoose.models.Feat || mongoose.model('Feat', featSchema, 'feats');
}
