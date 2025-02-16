import { MagickCategory } from '@/_models';

export const camelToTitle = (text: string) => {
    const split = text.replace(/([A-Z])/g, ' $1');
    return split.charAt(0).toUpperCase() + split.slice(1);
};

export const camelString = (str: string) => {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        })
        .replace(/\s+/g, '');
};

export const toKebabCase = (str: string) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .replace(/,/g, '')
        .replace(/'/g, '')
        .toLowerCase();
};

export const linkToSpellCompendium = (
    spell: string,
    spellType: MagickCategory
) => {
    let baseUrl;
    let linkSpell = spell;
    switch (spellType) {
        case MagickCategory.Arcane:
            baseUrl = 'https://homebrewery.naturalcrit.com/share/6988bCG34MfY';
            break;
        case MagickCategory.Divine:
            baseUrl = 'https://homebrewery.naturalcrit.com/share/cCT-vwPLKVj2';
            break;
        case MagickCategory.Psionic:
            baseUrl = 'https://homebrewery.naturalcrit.com/share/TmGpIeFUPn85';
            break;
        case MagickCategory.Shadow:
            baseUrl = 'https://homebrewery.naturalcrit.com/share/4rJgoZIZHqWK';
            break;
        case MagickCategory.Maneuver:
            baseUrl = 'https://homebrewery.naturalcrit.com/share/xF-Hd6XImurd';
            break;
    }
    if (spell.includes('Summon Monster')) linkSpell = 'Summon Monster';
    if (spell.includes('Summon Undead')) linkSpell = 'Summon Undead';
    window.open(`${baseUrl}#${toKebabCase(linkSpell)}`);
};

export const linkToSkillCompendium = (skill: string) => {
    const baseUrl = 'https://homebrewery.naturalcrit.com/share/Os0GfCuLSKKv';
    let linkSkill = skill;
    if (skill.includes('Knowledge'))
        linkSkill = skill.replace('Knowledge: ', '').replace('&', 'and');
    window.open(`${baseUrl}#${toKebabCase(linkSkill)}`);
};
