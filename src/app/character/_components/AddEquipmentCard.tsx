import {
    Armor,
    BodySlot,
    BonusTypes,
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
import { ChangeEvent, useState } from 'react';
import { Add } from '@mui/icons-material';

interface AddEquipmentCardProps {
    onAdd: () => void;
    onChange: (
        e: any,
        key: keyof Equipment | keyof Weapon | keyof Armor
    ) => void;
    newEq: Equipment;
    onClose: () => void;
}
export const AddEquipmentCard = ({
    onAdd,
    onChange,
    newEq,
    onClose,
}: AddEquipmentCardProps) => {
    const [isArmor, setIsArmor] = useState<boolean>(false);
    const [isWeapon, setIsWeapon] = useState<boolean>(false);
    const [modOpen, setModOpen] = useState<boolean>(false);
    const textFieldStyling = {
        marginBottom: '.5rem',
    };
    const formControlStyle = {
        marginBottom: '.5rem',
    };
    const handleAddModifier = (mod: Modifier) => {
        newEq.modifiers.push(mod);
    };
    return (
        <Card>
            <CardActions>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isWeapon}
                                onChange={(e) => setIsWeapon(e.target.checked)}
                            />
                        }
                        label='Is this a Weapon?'
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isArmor}
                                onChange={(e) => setIsArmor(e.target.checked)}
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
                    ) => onChange(e, 'name')}
                />
                <NumberInput
                    minZero
                    value={newEq.weight}
                    label='Weight'
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => onChange(e, 'weight')}
                />
                {!!isWeapon ? (
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
                            ) => onChange(e, 'category')}
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
                                            onChange(e, 'dexBasedAttack')
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
                                            onChange(e, 'dexBasedDamage')
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
                            ) => onChange(e, 'numberOfDice')}
                        />
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='damage-id'>Damage Die</InputLabel>
                            <Select
                                labelId='damage-id'
                                id='damage'
                                label='Damage Die'
                                name='damage'
                                value={(newEq as Weapon).damage}
                                onChange={(e: any) => onChange(e, 'damage')}
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
                                    onChange(e, 'damageTypes')
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
                            ) => onChange(e, 'criticalRange')}
                        />
                        <NumberInput
                            minZero
                            value={(newEq as Weapon).criticalMultiplier}
                            label='Crit Multiplier'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => onChange(e, 'criticalMultiplier')}
                        />
                        <NumberInput
                            minZero
                            value={(newEq as Weapon).rangeIncrement}
                            label='Range Increment'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => onChange(e, 'rangeIncrement')}
                        />
                    </>
                ) : null}
                {!!isArmor ? (
                    <>
                        <Typography sx={{ margin: '.5rem 0' }}>
                            Armor Info
                        </Typography>
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='body-slot-id'>Body Slot</InputLabel>
                            <Select
                                labelId='body-slot-id'
                                id='body-slot'
                                label='Body Slot'
                                name='bodySlot'
                                value={(newEq as Armor).bodySlot}
                                onChange={(e: any) => onChange(e, 'bodySlot')}
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
                        <NumberInput
                            value={(newEq as Armor).armorCheckPenalty}
                            label='Armor Check Penalty'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => onChange(e, 'armorCheckPenalty')}
                        />
                        <NumberInput
                            value={(newEq as Armor).maxDexBonus}
                            label='Max Dex Bonus'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => onChange(e, 'maxDexBonus')}
                        />
                        <NumberInput
                            value={(newEq as Armor).spellFailure}
                            label='Spell Failure'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => onChange(e, 'spellFailure')}
                        />
                        <NumberInput
                            value={(newEq as Armor).hardness}
                            label='Hardness'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => onChange(e, 'hardness')}
                        />
                    </>
                ) : null}
            </CardContent>
            <CardActions>
                <Button onClick={() => onAdd()}>Add to Equipment</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </CardActions>
        </Card>
    );
};
