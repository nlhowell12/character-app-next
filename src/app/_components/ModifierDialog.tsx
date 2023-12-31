import {
    AbilityTypes,
    AttributeNames,
    BonusTypes,
    Character,
    CharacterKeys,
    Damage,
    Dice,
    Modifier,
    SkillTypes,
} from '@/_models';
import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
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
} from '@mui/material';
import { Dispatch, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NumberInput } from './NumberInput';

interface ModifierDialogProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    onAdd: (appliedModifier: Modifier) => void;
}

export const ModifierDialog = ({
    character,
    dispatch,
    onAdd,
}: ModifierDialogProps) => {
    const [modifier, setModifier] = useState<Modifier>({
        value: 0,
        definition: '',
        skill: SkillTypes.Acrobatics,
        attribute: AttributeNames.Strength,
        attack: false,
        damage: false,
        defense: false,
        type: BonusTypes.Armor,
        abilityType: AbilityTypes.Extraordinary,
        resistance: undefined,
        immunity: undefined,
        damageType: Damage.Acid,
        damageDice: Dice.d4,
        numberOfDice: 0,
    });

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
    } = modifier;

    const [optionalValues, setOptionalValues] = useState({
        boolValue: false,
        boolDefinition: false,
        boolSkill: false,
        boolAttribute: false,
        boolAttack: false,
        boolDamage: false,
        boolDefense: false,
        boolAbilityType: false,
        boolResistance: false,
        boolImmunity: false,
        boolDamageType: false,
    });

    const modifierValueHandler = (e: any) => {
        console.log(e.target.name)
        setModifier({
            ...modifier,
            [e.target.name]: e.target.value,
        });
    };

    const optionalValueHandler = (e: any) => {
        setOptionalValues({
            ...optionalValues,
            [e.target.name]: e.target.checked,
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
        boolAbilityType,
        boolResistance,
        boolImmunity,
    } = optionalValues;

    const appliedModifier: Modifier = {
        value: !!boolValue ? Number(modValue) : 0,
        definition: !!boolDefinition || !!definition ? definition : undefined,
        skill: !!boolSkill ? skill : undefined,
        attribute: !!boolAttribute ? attribute : undefined,
        attack: boolAttack,
        damage: boolDamage,
        defense: boolDefense,
        type: bonusType,
        abilityType: !!boolAbilityType ? abilityType : undefined,
        resistance: boolResistance,
        immunity: boolImmunity,
        damageType: !!boolResistance || !!boolImmunity || boolDamage ? damageType : undefined,
        damageDice: !!boolDamage ? damageDice : undefined,
        numberOfDice: !!boolDamage ? numberOfDice : undefined,
        id: uuidv4(),
    };
    const diceAndNumber =
        !!damageDice &&
        !!numberOfDice;
    const valueOptions =
        appliedModifier.value ||
        appliedModifier.attribute ||
        diceAndNumber
    const valueAssignments =
        !!boolResistance ||
        !!boolAttack ||
        !!boolDamage ||
        !!boolDefense ||
        !!boolSkill ||
        !!boolAttribute;
    const noModValue = !!valueAssignments && !valueOptions;
    const noDamageType = !!boolImmunity && !appliedModifier.damageType;
    const noUnassignedValue = !!appliedModifier.value && !valueAssignments;

    const noValuesSelected = Object.values(optionalValues).every((value) => {
        if (!value) {
            return true;
        }
        return false;
    });

    const formValidation =
        !noValuesSelected && !noModValue && !noDamageType && !noUnassignedValue;

    const formControlStyle = {
        marginBottom: '.5rem',
    };

    const handleAdd = () => {
        if (formValidation) {
            onAdd(appliedModifier);
        }
    };
    return (
        <Card>
            <CardHeader title='Add Modifiers' />
            <CardContent>
                <FormControl
                    fullWidth
                    sx={formControlStyle}
                    error={!formValidation}
                >
                    <FormLabel component='legend'>Check applicable:</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={boolValue}
                                    onChange={optionalValueHandler}
                                    name='boolValue'
                                />
                            }
                            label='Does it have a numerical value?'
                        />
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={boolSkill}
                                    onChange={optionalValueHandler}
                                    name='boolSkill'
                                />
                            }
                            label='Does this affect a skill?'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={boolAttribute}
                                    onChange={optionalValueHandler}
                                    name='boolAttribute'
                                />
                            }
                            label='Does this affect an attribute?'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={boolAttack}
                                    onChange={optionalValueHandler}
                                    name='boolAttack'
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
                                />
                            }
                            label='Does this modify your damage?'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={boolDefense}
                                    onChange={optionalValueHandler}
                                    name='boolDefense'
                                />
                            }
                            label='Does this modifier your Defense Score?'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={boolAbilityType}
                                    onChange={optionalValueHandler}
                                    name='boolAbilityType'
                                />
                            }
                            label='Does this have an ability type specified? (Ex, Psi, Spell, Sup)'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={boolResistance}
                                    onChange={optionalValueHandler}
                                    name='boolResistance'
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
                                />
                            }
                            label='Does this confer immunity to damage?'
                        />
                    </FormGroup>
                    <FormHelperText>
                        Resistance, Attack, Damage, Defense, and Skills require
                        a Value, Attribute, or additional Dice (size and number)
                        to reference.
                    </FormHelperText>
                    <FormHelperText>
                        If Value or Attribute are selected, you must select
                        where to apply it.
                    </FormHelperText>
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
                {!!optionalValues.boolDamage && (
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
                        <InputLabel id='skill-id'>Skill Modified</InputLabel>
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
                {!!optionalValues.boolAbilityType && (
                    <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='attribute-id'>Ability Type</InputLabel>
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
                    !!optionalValues.boolDamage) && (
                    <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='attribute-id'>Damage Type</InputLabel>
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
    );
};
