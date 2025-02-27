import { CharacterClassNames, ClassAbility } from '@/_models';
import { useEffect, useState } from 'react';

export interface ClassAbilityReturnObject {
    [CharacterClassNames.Cleric]: {
        domainAspects: ClassAbility[];
        orisons: ClassAbility[];
    };
    [CharacterClassNames.Fighter]: ClassAbility[];
    [CharacterClassNames.Barbarian]: ClassAbility[];
    [CharacterClassNames.Bard]: ClassAbility[];
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

const initialClassAbilityState: ClassAbilityReturnObject = {
    [CharacterClassNames.Cleric]: {
        domainAspects: [],
        orisons: [],
    },
    [CharacterClassNames.Fighter]: [],
    [CharacterClassNames.Barbarian]: [],
    [CharacterClassNames.Bard]: [],
    [CharacterClassNames.Hexblade]: [],
    [CharacterClassNames.Monk]: [],
    [CharacterClassNames.Oathsworn]: [],
    [CharacterClassNames.Psion]: [],
    [CharacterClassNames.PsychicWarrior]: [],
    [CharacterClassNames.Rogue]: [],
    [CharacterClassNames.Shadowcaster]: [],
    [CharacterClassNames.Sorcerer]: [],
    [CharacterClassNames.Wizard]: [],
};

export default () => {
    const [classAbilities, setClassAbilities] =
        useState<ClassAbilityReturnObject>(initialClassAbilityState);

    useEffect(() => {
        getClassAbilties();
    }, []);

    const getClassAbilties = async () => {
        const res = await fetch('/api/classAbilities');
        const classAbilities = await res.json();
        const clericDomainAspects: ClassAbility[] = classAbilities.filter(
            (x: ClassAbility) =>
                x.className === CharacterClassNames.Cleric &&
                !!x.domain &&
                !!x.allegianceValue
        );
        const clericOrisons: ClassAbility[] = classAbilities.filter(
            (x: ClassAbility) =>
                x.className === CharacterClassNames.Cleric &&
                !!x.domain &&
                !x.level
        );

        if (!!classAbilities) {
            setClassAbilities({
                [CharacterClassNames.Cleric]: {
                    domainAspects: clericDomainAspects,
                    orisons: clericOrisons,
                },
                [CharacterClassNames.Fighter]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Fighter
                ),
                [CharacterClassNames.Barbarian]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Barbarian
                ),
                [CharacterClassNames.Bard]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Bard
                ),
                [CharacterClassNames.Hexblade]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Hexblade
                ),
                [CharacterClassNames.Monk]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Monk
                ),
                [CharacterClassNames.Oathsworn]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Oathsworn
                ),
                [CharacterClassNames.Psion]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Psion
                ),
                [CharacterClassNames.PsychicWarrior]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.PsychicWarrior
                ),
                [CharacterClassNames.Rogue]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Rogue
                ),
                [CharacterClassNames.Shadowcaster]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Shadowcaster
                ),
                [CharacterClassNames.Sorcerer]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Sorcerer
                ),
                [CharacterClassNames.Wizard]: classAbilities.filter(
                    (x: ClassAbility) =>
                        x.className === CharacterClassNames.Wizard
                ),
            });
        }
    };
    return { classAbilities };
};
