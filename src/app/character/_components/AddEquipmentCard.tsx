import {
    Armor,
    BodySlot,
    Damage,
    Dice,
    Equipment,
    Modifier,
    Weapon,
} from '@/_models';
import { ModifierDialog } from '@/app/_components/ModifierDialog';
import { NumberInput } from '@/app/_components/NumberInput';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { ModChipStack } from '@/app/_components/ModChipStack';
import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';

interface AddEquipmentCardProps {
    onAdd: (newEq: Equipment) => void;
    onEdit: (newEq: Equipment) => void;
    onClose: () => void;
    edit?: Equipment;
}
export const AddEquipmentCard = ({
    onAdd,
    onClose,
    edit,
    onEdit
}: AddEquipmentCardProps) => {
    const [modOpen, setModOpen] = useState<boolean>(false);
    const initialEquipmentState: Equipment = {
        id: uuidv4(),
        name: '',
        weight: 0,
        modifiers: [],
        equipped: false,
        numberOfDice: 0,
        damage: Dice.d4,
        armorCheckPenalty: 0,
        criticalMultiplier: 2,
        criticalRange: 20,
        category: '',
        damageTypes: [],
        dexBasedAttack: false,
        dexBasedDamage: false,
        rangeIncrement: 0,
        maxDexBonus: 0,
        spellFailure: 0,
        hardness: 0,
        bodySlot: BodySlot.None,
        amount: 1,
        isArmor: false,
        isWeapon: false
    };

    useEffect(() => {
        if(!!edit){
            setNewObject(edit)
        }
    },[])

    const [newEq, setNewObject] = useState<Equipment>(
        initialEquipmentState
    );

    const handleChange = (
        e: any,
        key: keyof Equipment | keyof Weapon | keyof Armor
    ) => {
        setNewObject({
            ...newEq,
            [key]: e.target.checked || e.target.value,
        });
    };
    const handleCheck = (
        e: any,
        key: keyof Equipment | keyof Weapon | keyof Armor
    ) => {
        setNewObject({
            ...newEq,
            [key]: e.target.checked
        });
    };
    const textFieldStyling = {
        marginBottom: '.5rem',
    };
    const formControlStyle = {
        marginBottom: '.5rem',
    };
    const handleAddModifier = (mod: Modifier) => {
        handleChange({target: {value: [...newEq.modifiers, mod]}}, 'modifiers');
    };
    const handleDeleteModifier = (mod: Modifier) => {
        const filter = (x: Modifier) => x.id !== mod.id;
        const filteredMods = R.filter(filter, newEq.modifiers);
        handleChange({target: {value: filteredMods}}, 'modifiers')};
    return (
        <Card sx={{overflow: 'scroll'}}>
            <CardActions>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={(newEq as Weapon).isWeapon}
                                onChange={(e) => handleCheck(e, 'isWeapon')}
                            />
                        }
                        label='Is this a Weapon?'
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={(newEq as Armor).isArmor}
                                onChange={(e) => handleCheck(e, 'isArmor')}
                            />
                        }
                        label='Is this Armor?'
                    />
                    <Button
                        variant='outlined'
                        onClick={() => setModOpen(true)}
                    >
                        <Typography>Add Modifier</Typography>
                        <Add sx={{ marginLeft: '.5rem' }} />
                    </Button>
                    <ModifierDialog
                        onAdd={handleAddModifier}
                        onClose={() => setModOpen(false)}
                        open={modOpen}
                    />
                </FormGroup>
            </CardActions>
            <CardContent>
                <TextField
                    value={newEq.name}
                    sx={textFieldStyling}
                    label='Name'
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleChange(e, 'name')}
                />
                <NumberInput
                    minZero
                    value={newEq.weight}
                    label='Weight'
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => handleChange(e, 'weight')}
                />
                 <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='body-slot-id'>Body Slot</InputLabel>
                            <Select
                                labelId='body-slot-id'
                                id='body-slot'
                                label='Body Slot'
                                name='bodySlot'
                                value={(newEq as Armor).bodySlot}
                                onChange={(e: any) => handleChange(e, 'bodySlot')}
                            >
                                {Object.keys(BodySlot).map((slot) => {
                                    return (
                                        <MenuItem key={slot} value={slot}>
                                            {/* @ts-ignore */}
                                            {BodySlot[slot]}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>
                {!!(newEq as Weapon).isWeapon ? (
                    <>
                        <Typography sx={{ margin: '.5rem 0' }}>
                            Weapon Info
                        </Typography>
                        <TextField
                            value={(newEq as Weapon).category}
                            sx={textFieldStyling}
                            label='Category'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'category')}
                        />
                        <FormGroup
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                margin: '0 0 .5rem',
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            (newEq as Weapon).dexBasedAttack
                                        }
                                        onChange={(e) =>
                                            handleChange(e, 'dexBasedAttack')
                                        }
                                    />
                                }
                                label='Is attack based on Dex?'
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            (newEq as Weapon).dexBasedDamage
                                        }
                                        onChange={(e) =>
                                            handleChange(e, 'dexBasedDamage')
                                        }
                                    />
                                }
                                label='Is damage based on Dex?'
                            />
                        </FormGroup>
                        <NumberInput
                            minZero
                            value={(newEq as Weapon).numberOfDice}
                            label='Number of Dice'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'numberOfDice')}
                        />
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='damage-id'>Damage Die</InputLabel>
                            <Select
                                labelId='damage-id'
                                id='damage'
                                label='Damage Die'
                                name='damage'
                                value={(newEq as Weapon).damage}
                                onChange={(e: any) => handleChange(e, 'damage')}
                            >
                                {Object.keys(Dice).map((dam) => {
                                    return (
                                        !!dam && (
                                            <MenuItem key={dam} value={dam}>
                                                {/* @ts-ignore */}
                                                {Dice[dam]}
                                            </MenuItem>
                                        )
                                    );
                                })}
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='damage-types-id'>
                                Damage Types
                            </InputLabel>
                            <Select
                                labelId='damage-types-id'
                                id='damage-types'
                                label='Damage Types'
                                name='damageTypes'
                                value={(newEq as Weapon).damageTypes}
                                multiple
                                onChange={(e: any) =>
                                    handleChange(e, 'damageTypes')
                                }
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
                        <NumberInput
                            minZero
                            value={(newEq as Weapon).criticalRange}
                            label='Crit Range'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'criticalRange')}
                        />
                        <NumberInput
                            minZero
                            value={(newEq as Weapon).criticalMultiplier}
                            label='Crit Multiplier'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'criticalMultiplier')}
                        />
                        <NumberInput
                            minZero
                            value={(newEq as Weapon).rangeIncrement}
                            label='Range Increment'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'rangeIncrement')}
                        />
                    </>
                ) : null}
                {!!(newEq as Armor).isArmor ? (
                    <>
                        <Typography sx={{ margin: '.5rem 0' }}>
                            Armor Info
                        </Typography>
                        <NumberInput
                            value={(newEq as Armor).armorCheckPenalty}
                            label='Armor Check Penalty'
                            minZero
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'armorCheckPenalty')}
                        />
                        <NumberInput
                            value={(newEq as Armor).maxDexBonus}
                            label='Max Dex Bonus'
                            minZero
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'maxDexBonus')}
                        />
                        <NumberInput
                            value={(newEq as Armor).spellFailure}
                            label='Spell Failure'
                            minZero
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'spellFailure')}
                        />
                        <NumberInput
                            value={(newEq as Armor).hardness}
                            label='Hardness'
                            minZero
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => handleChange(e, 'hardness')}
                        />
                    </>
                ) : null}
                <ModChipStack mods={newEq.modifiers} onDelete={handleDeleteModifier}/>
            </CardContent>
            <CardActions>
                <Button onClick={() => !!edit ? onEdit(newEq) : onAdd(newEq)}>{!!edit ? `Update Equipment` :`Add to Equipment`}</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </CardActions>
        </Card>
    );
};
