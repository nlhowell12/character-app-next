import { Equipment, Armor, Weapon, DBEquipment } from "@/_models";
import { useEffect, useState } from "react";

export interface EquipmentObject {
    Armor: Armor[],
    Weapons: Weapon[],
    Other: Equipment[]
}

const initialEquipmentObject: EquipmentObject = {
    Armor: [],
    Weapons: [],
    Other: []
};

export default () => {
    const [equipment, setEquipment] = useState<EquipmentObject>(initialEquipmentObject);

    useEffect(() => {
        getEquipment();
    }, []);

    const getEquipment = async () => {
        const res = await fetch('/api/equipment')
        const eq: DBEquipment[] = await res.json();
        setEquipment({
            Armor:  eq.filter(x => x.isArmor),
            Weapons: eq.filter(x => x.isWeapon),
            Other: eq.filter(x => !x.isArmor && !x.isWeapon)
        })
    }
    return { equipment }
}