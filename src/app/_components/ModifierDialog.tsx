import {
    AbilityTypes,
    AnyMagickSchool,
    ArcaneSchool,
    AttributeNames,
    BonusTypes,
    Damage,
    Dice,
    Modifier,
    ModifierSource,
    SkillTypes,
} from '@/_models';
import {
    Card,
    CardHeader,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    FormGroup,
    FormLabel,
    MenuItem,
    Button,
    TextField,
    FormHelperText,
    Dialog,
    Divider,
    Tooltip,
} from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NumberInput } from './NumberInput';
interface ModifierDialogProps {
    onAdd: (appliedModifier: Modifier) => void;
    onClose: () => void;
    open: boolean;
    edit?: boolean;
    equipment?: boolean;
}

export const ModifierDialog = ({
    onAdd,
    onClose,
    open,
    edit = false,
    equipment = false,
}: ModifierDialogProps) => {
    const initialState: Modifier = {
        id: '',
        value: 0,
        definition: '',
        skill: SkillTypes.Acrobatics,
        save: false,
        allSkills: false,
        allSaves: false,
        attribute: AttributeNames.Strength,
        attack: false,
        damage: false,
        defense: false,
        initiative: false,
        type: BonusTypes.Untyped,
        abilityType: AbilityTypes.Extraordinary,
        spellSchool: ArcaneSchool.Abjuration,
        resistance: undefined,
        immunity: undefined,
        damageType: Damage.Acid,
        damageDice: Dice.d4,
        numberOfDice: 0,
        source: ModifierSource.spell
    };
    
    const [modifier, setModifier] = useState<Modifier>(initialState);

    const {
        value: modValue,
        definition,
        skill,
        attribute,
        type: bonusType,
        abilityType,
        damageType,
        damageDice,
        numberOfDice,
        spellSchool,
        source
    } = modifier;

    const initialOptionalValues = {
        boolValue: false,
        boolSkill: false,
        boolSave: false,
        boolAllSkills: false,
        boolAllSaves: false,
        boolAttribute: false,
        boolAttack: false,
        boolDamage: false,
        boolDamageDice: false,
        boolDefense: false,
        boolAbilityType: false,
        boolResistance: false,
        boolImmunity: false,
        boolDamageType: false,
        boolInit: false,
        boolSpell: false
    };

    const [optionalValues, setOptionalValues] = useState(initialOptionalValues);

    const modifierValueHandler = (e: any) => {
        const { value, name } = e.target;
        
        if(value === ModifierSource.synergy || value === ModifierSource.trait){
            setOptionalValues({
                ...initialOptionalValues,
                boolValue: true,
                boolSkill: true,
            })
            setModifier({
                ...modifier,
                [name]: value,
                type: BonusTypes.Untyped,
            });
            return
        }
        setModifier({
            ...modifier,
            [name]: value,
        });
    };

    const optionalValueHandler = (checked: boolean, name: string) => {
        if(name === 'boolSkill' && !checked && (source === ModifierSource.synergy || source === ModifierSource.trait)) {
            setModifier({
                ...modifier,
                source: ModifierSource.other
            })
        }
        if(name === 'boolAllSkills' || name === 'boolAllSaves'){
            setOptionalValues({
                ...initialOptionalValues,
                boolValue: true,
                boolAllSaves: name === 'boolAllSaves' ? checked : boolAllSaves,
                boolAllSkills: name === 'boolAllSkills' ? checked : boolAllSkills,
                boolAttack,
                boolDamage
            });
            return
        } 
        if(name === 'boolDamageDice'){
            setOptionalValues({
                ...initialOptionalValues,
                boolDamageDice: checked,
                boolDamage: checked
              
            });
            return
        }
        if(name === 'boolImmunity') {
            setModifier({
                ...modifier,
                type: BonusTypes.Untyped,
            });
            setOptionalValues({
                ...initialOptionalValues,
                [name]: checked,
            });
            return
        }
        if(name === 'boolResistance') {
            setModifier({
                ...modifier,
                type: BonusTypes.Untyped,
            });
            setOptionalValues({
                ...initialOptionalValues,
                boolValue: checked ? checked : boolValue,
                [name]: checked,
            });
            return
        }
        if(name === 'boolSpell') {
            setModifier({
                ...modifier,
                type: BonusTypes.Untyped,
            });
            setOptionalValues({
                ...initialOptionalValues,
                boolValue: checked,
                [name]: checked,
            });
            return
        }
        if(name === 'boolSave') {
            setOptionalValues({
                ...optionalValues,
                boolAttribute:false,
                boolValue: checked,
                [name]: checked,
            });
            return
        }
        if(name === 'boolDamageType') {
            setOptionalValues({
                ...initialOptionalValues,
                boolDamageDice,
                boolDamage,
                boolValue,
                boolAttribute,
                [name]: checked,
            });
            return
        }
        setOptionalValues({
            ...optionalValues,
            [name]: checked,
        });
    };
    const {
        boolValue,
        boolSkill,
        boolSave,
        boolAllSkills,
        boolAllSaves,
        boolAttribute,
        boolAttack,
        boolDamage,
        boolDefense,
        boolResistance,
        boolImmunity,
        boolDamageType,
        boolDamageDice,
        boolInit,
        boolSpell
    } = optionalValues;

    {/* @ts-ignore */}
    const abilityTypeRequired = ModifierSource[source] === ModifierSource.classAbility || ModifierSource[source] === ModifierSource.otherAbility;

    const appliedModifier: Modifier = {
        value: !!boolValue ? +modValue : 0,
        definition: !!definition ? definition : undefined,
        skill: !!boolSkill && !boolAllSkills ? skill : undefined,
        save: boolSave && !boolAllSaves,
        allSkills: boolAllSkills,
        allSaves: boolAllSaves,
        attribute: (!!boolAttribute || !!boolSave) ? attribute : undefined,
        attack: boolAttack,
        damage: boolDamage,
        defense: boolDefense,
        type: bonusType,
        initiative: boolInit,
        abilityType: !!abilityTypeRequired ? abilityType : undefined,
        resistance: boolResistance,
        immunity: boolImmunity,
        fromEquipment: !!equipment ? equipment : false,
        damageType:
            !!boolResistance || !!boolImmunity || boolDamageType
                ? damageType
                : undefined,
        damageDice: !!boolDamage && !!boolDamageDice ? damageDice : undefined,
        numberOfDice:
            (!!boolDamage && !!boolDamageDice && numberOfDice) ? +numberOfDice : undefined,
            spellSchool: !!boolSpell ? spellSchool :  undefined,
        id: uuidv4(),
        source: source
    };
    const diceAndNumber = !!damageDice && numberOfDice  && numberOfDice > 0;
    const valueOptions =
        boolValue || boolAttribute || diceAndNumber;
    const valueAssignments =
        boolResistance ||
        boolAttack ||
        boolDamage ||
        boolSave || 
        boolDefense ||
        boolSkill ||
        boolAllSaves ||
        boolAllSkills ||
        boolAttribute ||
        boolInit ||
        boolSpell;
    const attAssignments = 
        boolResistance ||
        boolSave ||
        boolAttack ||
        boolDamage ||
        boolDefense ||
        boolSkill ||
        boolValue ||
        boolInit;
    const noModValue = (!!valueAssignments && !valueOptions) && !boolDamageDice;
    const noDamageDice = boolDamageDice && (!!numberOfDice && numberOfDice < 1);
    const noAttAssignment = (boolAttribute && !boolValue) && !attAssignments;
    const formValidation = () => {
        if(boolValue && !appliedModifier.value) {
            return false;
        }
        if(valueAssignments && !valueOptions) {
            return false;
        }
        if((!!boolImmunity || !!boolResistance) && !appliedModifier.damageType){
            return false;
        }
        if(noAttAssignment){
            return false
        }
        if(!boolValue && !boolAttribute && !boolDamageDice && !boolImmunity){
            return false;
        }
        if(noDamageDice) {
            return false;
        }
        return true;
    }

    const formControlStyle = {
        marginBottom: '.5rem',
    };

    const buttonStyle = {
        margin: '1rem'
    }
    const buttonContainerStyling = {
        'display': 'flex',
        'flex-wrap': 'wrap'
    };

    const handleAdd = () => {
        if (formValidation()) {
            onAdd(appliedModifier);
        }
    };
    const dividerStyling = {margin: '.5rem 0'}
    const disableNonSkillOptions = source === ModifierSource.synergy || source === ModifierSource.trait;
    const disableIfNotMultipleOption = boolAllSaves || boolAllSkills;
    const disabledIfModifyingAttribute = boolValue && boolAttribute;

    const editSources = Object.values(ModifierSource).filter(x => x !== ModifierSource.statusEffect).filter(x => {
        if(equipment) { 
            return x !== ModifierSource.synergy && x !== ModifierSource.trait
        }
        return true;
    }

    )
    return (
        <Dialog open={open} onClose={onClose}>
            <Card sx={{ overflow: 'scroll', width: 'fit-content', maxWidth: '50rem' }}>
                <CardHeader title='Add Modifiers' subheader='Bonus Type is required, use Untyped if one is not specified'/>
                <CardContent>
                    <FormControl
                        fullWidth
                        sx={formControlStyle}
                        error={noModValue}
                    >
                        <FormLabel component='legend'>
                            Modifier Value (if you select both you will be modifying an attribute)
                        </FormLabel>
                        <div style={buttonContainerStyling}>
                        <Tooltip title={'This modifier has a numerical value (E.g. +2)' } placement='top'>
                            <Button
                                color={boolValue ? 'success' : 'info'}
                                onClick={() => optionalValueHandler(!boolValue, 'boolValue')}
                                variant='outlined'
                                sx={buttonStyle}
                                disabled={boolDamageDice || disableIfNotMultipleOption || boolImmunity || boolSpell || boolSave}

                            >
                                Value
                            </Button>
                        </Tooltip>
                        <Tooltip title={'This modifier is derived from an attribute (E.g. Add your Strength to something)' } placement='top'>
                            <Button
                                color={boolAttribute ? 'success' : 'info'}
                                onClick={() => optionalValueHandler(!boolAttribute, 'boolAttribute')}
                                variant='outlined'
                                sx={buttonStyle}
                                disabled={disableIfNotMultipleOption || boolDamageDice || boolImmunity || boolResistance || boolSpell || boolSave}
                            >
                                Attribute
                            </Button>
                        </Tooltip>
                        </div>
                    </FormControl>

                        <Divider sx={dividerStyling}/>

                        <FormControl
                            fullWidth
                            sx={formControlStyle}
                            error={(!!boolValue && !valueAssignments) || noAttAssignment}
                        >
                            <FormLabel component='legend'>
                                Modifier Target (Where you want the modifier applied)
                            </FormLabel>
                            <div style={buttonContainerStyling}>
                                <Tooltip title={'This will apply to a skill (E.g. +2 Acrobatics)' } placement='top'>
                                    <Button
                                        color={boolSkill ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolSkill, 'boolSkill')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableIfNotMultipleOption || boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell || boolDamageType}
                                    >
                                        Skill
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +2 Stength Saves)' } placement='top'>
                                    <Button
                                        color={boolSave ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolSave, 'boolSave')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableIfNotMultipleOption || boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell || boolDamageType}
                                    >
                                        Save
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +2 to skill checks)' } placement='top'>
                                    <Button
                                        color={boolAllSkills ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolAllSkills, 'boolAllSkills')}
                                        variant='outlined'
                                        sx={{margin: '1rem'}}
                                        disabled={boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell || boolDamageType}
                                    >
                                        All Skills
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +2 to saves)' } placement='top'>
                                    <Button
                                        color={boolAllSaves ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolAllSaves, 'boolAllSaves')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell || boolDamageType}
                                    >
                                        All Saves
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +1 to Conjuration)' } placement='top'>
                                    <Button
                                        color={boolSpell ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolSpell, 'boolSpell')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableIfNotMultipleOption || boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolDamageType}
                                    >
                                        Spell School DC
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +4 to Initiative)' } placement='top'>
                                    <Button
                                        color={boolInit ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolInit, 'boolInit')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableIfNotMultipleOption || boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell || boolDamageType}
                                    >
                                        Initiative
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +1 to Attack)' } placement='top'>
                                    <Button
                                        color={boolAttack ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolAttack, 'boolAttack')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell || boolDamageType}
                                    >
                                        Attack
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +1 to Damage)' } placement='top'>
                                    <Button
                                        color={boolDamage ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolDamage, 'boolDamage')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell}
                                    >
                                        Damage
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. +1 to Defense Score or Damage Reduction)' } placement='top'>
                                    <Button
                                        color={boolDefense ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolDefense, 'boolDefense')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableIfNotMultipleOption || boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell || boolDamageType}
                                    >
                                        Defense
                                    </Button>
                                </Tooltip>
                            </div>
                        </FormControl>
                            
                        <Divider sx={dividerStyling}/>

                        <FormControl
                            fullWidth
                            sx={formControlStyle}
                        >
                            <FormLabel component='legend'>
                                Additional Modifiers
                            </FormLabel>
                            <FormGroup>
                            <div style={buttonContainerStyling}>
                                <Tooltip title={'(E.g. +1d6 Fire Damage)' } placement='top'>
                                    <Button
                                        color={boolDamageDice ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolDamageDice, 'boolDamageDice')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableIfNotMultipleOption || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell}
                                    >
                                        Additional Damage Dice
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. Cold Resistance 15)' } placement='top'>
                                    <Button
                                        color={boolResistance ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolResistance, 'boolResistance')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableNonSkillOptions || disableIfNotMultipleOption || boolDamageDice || disabledIfModifyingAttribute || boolImmunity || boolSpell || boolDamageType}
                                    >
                                        Resistance to Damage Type
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. Immune to Acid Damage)' } placement='top'>
                                    <Button
                                        color={boolImmunity ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolImmunity, 'boolImmunity')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableNonSkillOptions || disableIfNotMultipleOption || boolDamageDice || disabledIfModifyingAttribute || boolResistance || boolSpell || boolDamageType}
                                    >
                                        Immunity to Damage Type
                                    </Button>
                                </Tooltip>
                                <Tooltip title={'(E.g. Immune to Acid Damage)' } placement='top'>
                                    <Button
                                        color={boolDamageType ? 'success' : 'info'}
                                        onClick={() => optionalValueHandler(!boolDamageType, 'boolDamageType')}
                                        variant='outlined'
                                        sx={buttonStyle}
                                        disabled={disableNonSkillOptions || disableIfNotMultipleOption || disabledIfModifyingAttribute || boolImmunity || boolResistance || boolSpell}
                                    >
                                        Specify Damage Type
                                    </Button>
                                </Tooltip>
                            </div>
                            </FormGroup>
                        </FormControl>
                        <Divider sx={dividerStyling}/>

                        <FormHelperText>
                            Resistance, Attack, Damage, Defense, and Skills
                            require a Value, Attribute, or additional Dice (size
                            and number) to reference.
                        </FormHelperText>
                        <FormHelperText>
                            If Value or Attribute are selected, you must select
                            where to apply it.
                        </FormHelperText>

                    <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='source-id'>Source</InputLabel>
                        <Select
                            labelId='source-id'
                            id='source'
                            label='Source'
                            name='source'
                            value={source}
                            onChange={modifierValueHandler}
                            disabled={!edit}
                        >
                            {!!edit ? 
                            editSources.map((source) => {
                                return (
                                    <MenuItem key={source} value={source}>
                                        {source}
                                    </MenuItem>
                                );
                            }) :
                            <MenuItem key={ModifierSource.spell} value={ModifierSource.spell}>
                                {ModifierSource.spell}
                            </MenuItem>
                        }
                        </Select>
                    </FormControl>
                    {(!boolImmunity && !boolResistance) && 
                    <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='bonus-type-id'>Bonus Type</InputLabel>
                        <Select
                            labelId='bonus-type-id'
                            id='bonus-type'
                            label='Bonus Type'
                            name='type'
                            value={bonusType}
                            onChange={modifierValueHandler}
                            disabled={disableNonSkillOptions}
                        >
                            {Object.keys(BonusTypes).map((bon) => {
                                return (
                                    <MenuItem key={bon} value={bon}>
                                        {/* @ts-ignore */}
                                        {BonusTypes[bon]}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>}
                   {!!boolSpell && <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='spell-school-id'>School/Discipline/Domain/Path</InputLabel>
                        <Select
                            labelId='spell-school-id'
                            id='spell-school'
                            label='School/Discipline/Domain/Path'
                            name='spellSchool'
                            value={spellSchool}
                            onChange={modifierValueHandler}
                        >
                            {Object.keys(AnyMagickSchool).map((x) => {
                                return (
                                    <MenuItem key={x} value={x}>
                                        {/* @ts-ignore */}
                                        {AnyMagickSchool[x]}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>}
                    {!!boolDamageDice && (
                        <>
                            <FormControl fullWidth sx={formControlStyle}>
                                <InputLabel id='damage-die-id'>
                                    Damage Die
                                </InputLabel>
                                <Select
                                    labelId='damage-die-id'
                                    id='damage-die'
                                    label='Damage Die'
                                    name='damageDice'
                                    value={damageDice}
                                    onChange={modifierValueHandler}
                                >
                                    {Object.keys(Dice).map((dam) => {
                                        return (
                                            <MenuItem key={dam} value={dam}>
                                                {/* @ts-ignore */}
                                                {Dice[dam]}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                            <NumberInput
                                label='Number of Dice'
                                value={numberOfDice || 0}
                                onChange={(e) => modifierValueHandler({target: {value: e.target.value, name: 'numberOfDice'}})}
                                error={noDamageDice}
                                minZero
                            />                           
                        </>
                    )}
                    {!!optionalValues.boolValue && (
                        <NumberInput
                            label='Value'
                            value={modValue}
                            onChange={modifierValueHandler}
                            error={!!boolValue && !appliedModifier.value}
                        />
                    )}
                 
                    {!!optionalValues.boolSkill && (
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='skill-id'>
                                Skill Modified
                            </InputLabel>
                            <Select
                                label='Skill'
                                value={skill}
                                fullWidth
                                onChange={modifierValueHandler}
                                name='skill'
                            >
                                {Object.keys(SkillTypes).map((skill) => {
                                    return (
                                        <MenuItem key={skill} value={skill}>
                                            {/* @ts-ignore */}
                                            {SkillTypes[skill]}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    )}
                    {(optionalValues.boolAttribute || optionalValues.boolSave) && (
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='attribute-id'>
                                {boolSave ? 'Save' : 'Attribute'} Modified
                            </InputLabel>
                            <Select
                                label='Attribute'
                                value={attribute}
                                fullWidth
                                onChange={modifierValueHandler}
                                name='attribute'
                            >
                                {Object.keys(AttributeNames).map((att) => {
                                    return (
                                        <MenuItem key={att} value={att}>
                                            {/* @ts-ignore */}
                                            {AttributeNames[att]}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    )}
                    {!!abilityTypeRequired && (
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='attribute-id'>
                                Ability Type
                            </InputLabel>
                            <Select
                                label='Ability Type'
                                value={abilityType}
                                fullWidth
                                onChange={modifierValueHandler}
                                name='abilityType'
                            >
                                {Object.keys(AbilityTypes).map((abl) => {
                                    return (
                                        <MenuItem key={abl} value={abl}>
                                            {/* @ts-ignore */}
                                            {AbilityTypes[abl]}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    )}
                    {(!!optionalValues.boolResistance ||
                        !!optionalValues.boolImmunity ||
                        !!optionalValues.boolDamageType) && (
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='attribute-id'>
                                Damage Type
                            </InputLabel>
                            <Select
                                label='Damage Type'
                                value={damageType}
                                fullWidth
                                onChange={modifierValueHandler}
                                name='damageType'
                            >
                                {Object.keys(Damage).map((dam) => {
                                    return (
                                        <MenuItem key={dam} value={dam}>
                                            {/* @ts-ignore */}
                                            {Damage[dam]}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    )}
                       <FormControl fullWidth sx={formControlStyle}>
                        <TextField
                            label='Definition (optional)'
                            name='definition'
                            multiline
                            onChange={modifierValueHandler}
                            value={definition}
                        />
                    </FormControl>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button
                            disabled={!formValidation()}
                            variant='outlined'
                            onClick={() => handleAdd()}
                        >
                            Apply Modifier
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Dialog>
    );
};
