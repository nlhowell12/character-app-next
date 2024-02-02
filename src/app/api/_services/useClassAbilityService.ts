import { CharacterClassNames, ClassAbility } from "@/_models";
import { useEffect, useState } from "react";

interface ClassAbilityObject {
    [CharacterClassNames.Cleric]: {
        domainAspects: ClassAbility[];
        orisons: ClassAbility[];
    }
}

const initialClassAbilityState: ClassAbilityObject = {
    [CharacterClassNames.Cleric]: {
        domainAspects: [],
        orisons: []
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
        const clericDomainAspects: ClassAbility[] = classAbilities.filter((x: ClassAbility) => x.className === CharacterClassNames.Cleric && !!x.domain && !!x.allegianceValue);
        const clericOrisons: ClassAbility[] = classAbilities.filter((x: ClassAbility) => x.className === CharacterClassNames.Cleric && !!x.domain && !x.level);
    
        if(!!classAbilities){
            setClassAbilities({
                [CharacterClassNames.Cleric]: {domainAspects: clericDomainAspects, orisons: clericOrisons}
            });
        }
    }
    return { classAbilities }
}