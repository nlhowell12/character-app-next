import { CharacterClassNames, ClassAbility } from "@/_models";
import { useEffect, useState } from "react";

interface ClassAbilityObject {
    [CharacterClassNames.Cleric]: {
        domainAspects: ClassAbility[];
    }
}

const initialClassAbilityState: ClassAbilityObject = {
    [CharacterClassNames.Cleric]: {
        domainAspects: []
    }
};

export default () => {
    const [classAbilities, setClassAbilities] = useState<ClassAbilityObject>(initialClassAbilityState);

    useEffect(() => {
        getClassAbilties();
    }, []);

    const getClassAbilties = async () => {
        const res = await fetch('/api/classAbilities')
        const classAbilities = await res.json();
        const clericDomainAspects = classAbilities.filter((x: ClassAbility) => x.className === CharacterClassNames.Cleric && !!x.domain && !!x.allegianceValue);
    
        if(!!classAbilities){
            setClassAbilities({
                [CharacterClassNames.Cleric]: {domainAspects: clericDomainAspects}
            });
        }
    }
    return { classAbilities }
}