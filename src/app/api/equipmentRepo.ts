import { db } from "./db";

const Equipment = db.Equipment;

const getEquipment = async () => {
    const equipment = await Equipment.find()
    return equipment;
}
export const equipmentRepo = {
    getEquipment,
}