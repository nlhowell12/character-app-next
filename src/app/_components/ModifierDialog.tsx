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
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    MenuItem,
    Button,
    TextField,
    FormHelperText,
    Dialog,
    Divider,
} from '@mui/material';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NumberInput } from './NumberInput';
interface ModifierDialogProps {
    onAdd: (appliedModifier: Modifier) => void;
    onClose: () => void;
    open: boolean;
}

export const ModifierDialog = ({
    onAdd,
    onClose,
    open,
}: ModifierDialogProps) => {
    const initialState: Modifier = {
        id: '',
        value: 0,
        definition: '',
        skill: SkillTypes.Acrobatics,
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

    const [optionalValues, setOptionalValues] = useState({
        boolValue: false,
        boolDefinition: false,
        boolSkill: false,
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
    });

    const modifierValueHandler = (e: any) => {
        const { value, name } = e.target;
        
        if(value === ModifierSource.synergy){
            setOptionalValues({
                ...optionalValues,
                boolValue: true,
                boolSkill: true,
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
            })
            setModifier({
                ...modifier,
                [name]: value,
                type: BonusTypes.Untyped,
            });
        } else {
            setModifier({
                ...modifier,
                [name]: value,
            });
        }
    };

    const optionalValueHandler = (e: any) => {
        const { name, checked } = e.target;
        if(name === 'boolSkill' && !checked && source === ModifierSource.synergy) {
            setModifier({
                ...modifier,
                source: ModifierSource.other
            })
        }
        setOptionalValues({
            ...optionalValues,
            [name]: checked,
        });
    };
    const {
        boolValue,
        boolDefinition,
        boolSkill,
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
        value: !!boolValue ? Number(modValue) : 0,
        definition: !!boolDefinition || !!definition ? definition : undefined,
        skill: !!boolSkill ? skill : undefined,
        attribute: !!boolAttribute ? attribute : undefined,
        attack: boolAttack,
        damage: boolDamage,
        defense: boolDefense,
        type: bonusType,
        initiative: boolInit,
        abilityType: !!abilityTypeRequired ? abilityType : undefined,
        resistance: boolResistance,
        immunity: boolImmunity,
        damageType:
            !!boolResistance || !!boolImmunity || boolDamageType
                ? damageType
                : undefined,
        damageDice: !!boolDamage && !!boolDamageDice ? damageDice : undefined,
        numberOfDice:
            !!boolDamage && !!boolDamageDice ? Number(numberOfDice) : undefined,
            spellSchool: !!boolSpell ? spellSchool :  undefined,
        id: uuidv4(),
        source: source
    };
    const diceAndNumber = !!damageDice && !!numberOfDice;
    const valueOptions =
        appliedModifier.value || appliedModifier.attribute || diceAndNumber;
    const valueAssignments =
        boolResistance ||
        boolAttack ||
        boolDamage ||
        boolDefense ||
        boolSkill ||
        boolAttribute ||
        boolInit ||
        boolSpell;
    const attAssignments = 
        boolResistance ||
        boolAttack ||
        boolDamage ||
        boolDefense ||
        boolSkill ||
        boolValue ||
        boolInit;
    const noModValue = !!valueAssignments && !valueOptions;
    const noDamageType = !!boolImmunity && !appliedModifier.damageType;
    const noUnassignedValue = boolValue && !valueAssignments;
    const noUnassignedAttribute = boolAttribute && !attAssignments;

    const noValuesSelected = Object.values(optionalValues).every((value) => {
        if (!value) {
            return true;
        }
        return false;
    });

    const formValidation =
        !noValuesSelected && !noModValue && !noDamageType && !noUnassignedValue && !noUnassignedAttribute;

    const formControlStyle = {
        marginBottom: '.5rem',
    };

    const handleAdd = () => {
        if (formValidation) {
            onAdd(appliedModifier);
        }
    };
    const dividerStyling = {margin: '.5rem 0'}
    const disableSynergy = source === ModifierSource.synergy;

    return (
        <Dialog open={open} onClose={onClose}>
            <Card sx={{ overflow: 'scroll' }}>
                <CardHeader title='Add Modifiers' subheader='Bonus Type is required, use Untyped if one is not specified'/>
                <CardContent>
                    <FormControl
                        fullWidth
                        sx={formControlStyle}
                        error={!formValidation}
                    >
                        <FormLabel component='legend'>
                            Check applicable:
                        </FormLabel>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolValue}
                                        onChange={optionalValueHandler}
                                        name='boolValue'
                                    />
                                }
                                label='Does it have a numerical value? (E.g. +2)'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolAttribute}
                                        onChange={optionalValueHandler}
                                        name='boolAttribute'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this modify an attribute or is it derived from one? (do not add a value if derived)' 
                            />
                            <Divider sx={dividerStyling}/>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolSkill}
                                        onChange={optionalValueHandler}
                                        name='boolSkill'
                                    />
                                }
                                label='Does this affect a skill? (E.g. +2 Acrobatics)'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolSpell}
                                        onChange={optionalValueHandler}
                                        name='boolSpell'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this affect a spell DC? (E.g. +1 to Conjuration)'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolInit}
                                        onChange={optionalValueHandler}
                                        name='boolInit'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this modify your initiative?'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolAttack}
                                        onChange={optionalValueHandler}
                                        name='boolAttack'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this modify your attacks?'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolDamage}
                                        onChange={optionalValueHandler}
                                        name='boolDamage'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this modify your damage?'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolDamageDice}
                                        onChange={optionalValueHandler}
                                        name='boolDamageDice'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this add additional dice to your damage?'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolDefense}
                                        onChange={optionalValueHandler}
                                        name='boolDefense'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this modify your Defense (Armor, Shield, and Racial for DR)?'
                            />
                            <Divider sx={dividerStyling}/>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolResistance}
                                        onChange={optionalValueHandler}
                                        name='boolResistance'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this confer resistance to damage?'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolImmunity}
                                        onChange={optionalValueHandler}
                                        name='boolImmunity'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this confer immunity to damage?'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolDamageType}
                                        onChange={optionalValueHandler}
                                        name='boolDamageType'
                                        disabled={disableSynergy}
                                    />
                                }
                                label='Does this have a specific damage type?'
                            />
                            <Divider sx={dividerStyling}/>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={boolDefinition}
                                        onChange={optionalValueHandler}
                                        name='boolDefinition'
                                    />
                                }
                                label='Would you like to add a definition?'
                            />
                        </FormGroup>
                        <FormHelperText>
                            Resistance, Attack, Damage, Defense, and Skills
                            require a Value, Attribute, or additional Dice (size
                            and number) to reference.
                        </FormHelperText>
                        <FormHelperText>
                            If Value or Attribute are selected, you must select
                            where to apply it.
                        </FormHelperText>
                    </FormControl>
                    <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='source-id'>Source</InputLabel>
                        <Select
                            labelId='source-id'
                            id='source'
                            label='Source'
                            name='source'
                            value={source}
                            onChange={modifierValueHandler}
                        >
                            {Object.values(ModifierSource).map((source) => {
                                return (
                                    <MenuItem key={source} value={source}>
                                        {source}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='bonus-type-id'>Bonus Type</InputLabel>
                        <Select
                            labelId='bonus-type-id'
                            id='bonus-type'
                            label='Bonus Type'
                            name='type'
                            value={bonusType}
                            onChange={modifierValueHandler}
                            disabled={disableSynergy}
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
                    </FormControl>
                   {!!boolSpell && <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='spell-school-id'>Bonus Type</InputLabel>
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
                    {!!optionalValues.boolDamage && !!boolDamageDice && (
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
                                onChange={modifierValueHandler}
                            />
                        </>
                    )}
                    {!!optionalValues.boolValue && (
                        <NumberInput
                            label='Value'
                            value={modValue}
                            onChange={modifierValueHandler}
                        />
                    )}
                    {!!optionalValues.boolDefinition && (
                        <FormControl fullWidth sx={formControlStyle}>
                            <TextField
                                label='Definition'
                                name='definition'
                                multiline
                                onChange={modifierValueHandler}
                                value={definition}
                            />
                        </FormControl>
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
                    {!!optionalValues.boolAttribute && (
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='attribute-id'>
                                Attribute Modified
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
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <Button
                            disabled={!formValidation}
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
