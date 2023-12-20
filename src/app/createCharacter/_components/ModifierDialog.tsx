import { AbilityTypes, AttributeNames, BonusTypes, Character, CharacterKeys, Damage, Modifier, SkillTypes } from '@/_models';
import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
import {
    Card,
    CardHeader,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormLabel,
    MenuItem,
    Button,
    TextField,
} from '@mui/material';
import { Dispatch, useState } from 'react';

interface ModifierDialogProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const ModifierDialog = ({ character, dispatch }: ModifierDialogProps) => {
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
    });

    const { value: modValue, definition, skill, attribute, type: bonusType, abilityType, damageType } = modifier;

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

    const handleApply = () => {
        const noValuesSelected = Object.values(optionalValues).every(value => {
            if (!value) {
              return true;
            }
            return false;
          });
          
        const appliedModifier: Modifier = {
            value: !!boolValue ? modValue : undefined,
            definition: (!!boolDefinition || !!definition) ? definition : undefined,
            skill: !!boolSkill ? skill : undefined,
            attribute: !!boolAttribute ? attribute : undefined,
            attack: boolAttack,
            damage: boolDamage,
            defense: boolDefense,
            type: bonusType,
            abilityType: !!boolAbilityType ? abilityType : undefined,
            resistance: boolResistance,
            immunity: boolImmunity,
            damageType: (!!boolResistance || !!boolImmunity) ? damageType : undefined,
        };
        if(!noValuesSelected)
        {
            // set up on close
            dispatch(updateAction(CharacterKeys.miscModifiers, [...character.miscModifiers, appliedModifier]))
        } else {
            // set up field validation or a warning
            alert('Not good')
        }
    };

    const formControlStyle = {
        marginBottom: '.5rem',
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
    return (
        <Card>
            <CardHeader title='Add Modifiers' />
            <CardContent>
                <FormControl fullWidth sx={formControlStyle}>
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
                            label='Does this modifer your attacks?'
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
                {!!optionalValues.boolValue && (
                    <FormControl fullWidth sx={formControlStyle}>
                        <InputLabel id='value-id'>Value</InputLabel>
                        <OutlinedInput
                            type='number'
                            label='Value'
                            name='value'
                            sx={{
                                maxWidth: '4rem',
                                '& input[type=number]': {
                                    '-moz-appearance': 'textfield',
                                },
                                '& input[type=number]::-webkit-outer-spin-button':
                                    {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                    },
                                '& input[type=number]::-webkit-inner-spin-button':
                                    {
                                        '-webkit-appearance': 'none',
                                        margin: 0,
                                    },
                            }}
                            value={modValue}
                            onChange={modifierValueHandler}
                        />
                    </FormControl>
                )}
                {!!optionalValues.boolDefinition && (
                    <FormControl fullWidth sx={formControlStyle}>
                        <TextField label='Definition' name='definition' multiline onChange={modifierValueHandler} value={definition}/>
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
                        <InputLabel id='attribute-id'>Attribute Modified</InputLabel>
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
                {(!!optionalValues.boolResistance || !!optionalValues.boolImmunity) && (
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
                <div style={{display: 'flex', justifyContent: 'end'}}>
                    <Button variant='outlined' onClick={() => handleApply()}>Apply Modifier</Button>
                </div>
            </CardContent>
        </Card>
    );
};
