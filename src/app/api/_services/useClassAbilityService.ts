import { CharacterClassNames, ClassAbility } from '@/_models';
import { useEffect, useState } from 'react';

export interface ClassAbilityReturnObject {
    [CharacterClassNames.Cleric]: {
        domainAspects: ClassAbility[];
        orisons: ClassAbility[];
        abilities: ClassAbility[];
    };
    [CharacterClassNames.Fighter]: ClassAbility[];
    [CharacterClassNames.Barbarian]: ClassAbility[];
    [CharacterClassNames.Bard]: {
        abilities: ClassAbility[];
        music: ClassAbility[];
        refrains: ClassAbility[];
    };
    [CharacterClassNames.Hexblade]: ClassAbility[];
    [CharacterClassNames.Monk]: ClassAbility[];
    [CharacterClassNames.Oathsworn]: ClassAbility[];
    [CharacterClassNames.Psion]: ClassAbility[];
    [CharacterClassNames.PsychicWarrior]: ClassAbility[];
    [CharacterClassNames.Rogue]: ClassAbility[];
    [CharacterClassNames.Shadowcaster]: ClassAbility[];
    [CharacterClassNames.Sorcerer]: ClassAbility[];
    [CharacterClassNames.Wizard]: ClassAbility[];
}

// const initialClassAbilityState: ClassAbilityReturnObject = {
//     [CharacterClassNames.Cleric]: {
//         domainAspects: [],
//         orisons: [],
//         abilities: [],
//     },
//     [CharacterClassNames.Fighter]: [],
//     [CharacterClassNames.Barbarian]: [],
//     [CharacterClassNames.Bard]: {
//         abilities: [],
//         music: [],
//         refrains: [],
//     },
//     [CharacterClassNames.Hexblade]: [],
//     [CharacterClassNames.Monk]: [],
//     [CharacterClassNames.Oathsworn]: [],
//     [CharacterClassNames.Psion]: [],
//     [CharacterClassNames.PsychicWarrior]: [],
//     [CharacterClassNames.Rogue]: [],
//     [CharacterClassNames.Shadowcaster]: [],
//     [CharacterClassNames.Sorcerer]: [],
//     [CharacterClassNames.Wizard]: [],
// };

export default () => {
    const [classAbilityResponse, setClassAbilities] = useState<
        ClassAbilityReturnObject | undefined
    >();

    useEffect(() => {
        getClassAbilties();
    }, []);

    const getClassAbilties = async () => {
        const res = await fetch('/api/classAbilities');
        const allClassAbilities = await res.json();
        const clericAbilities = allClassAbilities.filter(
            (x: ClassAbility) =>
                x.className === CharacterClassNames.Cleric &&
                !!x.level &&
                !x.allegianceValue
        );
        const clericDomainAspects: ClassAbility[] = allClassAbilities.filter(
            (x: ClassAbility) =>
                x.className === CharacterClassNames.Cleric &&
                !!x.domain &&
                !!x.allegianceValue
        );
        const clericOrisons: ClassAbility[] = allClassAbilities.filter(
            (x: ClassAbility) =>
                x.className === CharacterClassNames.Cleric &&
                !!x.domain &&
                !x.level
        );
        const bardAbilities = allClassAbilities.filter(
            (x: ClassAbility) => x.className === CharacterClassNames.Bard
        );
        setClassAbilities({
            [CharacterClassNames.Cleric]: {
                domainAspects: clericDomainAspects,
                orisons: clericOrisons,
                abilities: clericAbilities,
            },
            [CharacterClassNames.Fighter]: allClassAbilities.filter(
                (x: ClassAbility) => x.className === CharacterClassNames.Fighter
            ),
            [CharacterClassNames.Barbarian]: allClassAbilities.filter(
                (x: ClassAbility) =>
                    x.className === CharacterClassNames.Barbarian
            ),
            [CharacterClassNames.Bard]: {
                abilities: bardAbilities.filter(
                    (x: ClassAbility) => !x.isMusic && !x.isRefrain
                ),
                music: bardAbilities.filter((x: ClassAbility) => x.isMusic),
                refrains: bardAbilities.filter(
                    (x: ClassAbility) => x.isRefrain
                ),
            },
            [CharacterClassNames.Hexblade]: allClassAbilities.filter(
                (x: ClassAbility) =>
                    x.className === CharacterClassNames.Hexblade
            ),
            [CharacterClassNames.Monk]: allClassAbilities.filter(
                (x: ClassAbility) => x.className === CharacterClassNames.Monk
            ),
            [CharacterClassNames.Oathsworn]: allClassAbilities.filter(
                (x: ClassAbility) =>
                    x.className === CharacterClassNames.Oathsworn
            ),
            [CharacterClassNames.Psion]: allClassAbilities.filter(
                (x: ClassAbility) => x.className === CharacterClassNames.Psion
            ),
            [CharacterClassNames.PsychicWarrior]: allClassAbilities.filter(
                (x: ClassAbility) =>
                    x.className === CharacterClassNames.PsychicWarrior
            ),
            [CharacterClassNames.Rogue]: allClassAbilities.filter(
                (x: ClassAbility) => x.className === CharacterClassNames.Rogue
            ),
            [CharacterClassNames.Shadowcaster]: allClassAbilities.filter(
                (x: ClassAbility) =>
                    x.className === CharacterClassNames.Shadowcaster
            ),
            [CharacterClassNames.Sorcerer]: allClassAbilities.filter(
                (x: ClassAbility) =>
                    x.className === CharacterClassNames.Sorcerer
            ),
            [CharacterClassNames.Wizard]: allClassAbilities.filter(
                (x: ClassAbility) => x.className === CharacterClassNames.Wizard
            ),
        });
    };
    return { classAbilityResponse };
};
