import { Armor, BonusTypes, Damage, Dice, Equipment, Weapon } from '@/_models';
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

interface AddEquipmentCardProps {
    onAdd: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    const textFieldStyling = {
        marginBottom: '.5rem'
    }
    const formControlStyle = {
        marginBottom: '.5rem',
    };
    return (
        <Card>
            <CardActions>
                <FormGroup>
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
                <NumberInput minZero value={newEq.weight} label='Weight' onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => onChange(e, 'weight')}/>
                {!!isWeapon ? (
                    <>
                    <Typography sx={{margin: '.5rem 0'}}>Weapon Info</Typography>
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
                        <NumberInput minZero value={(newEq as Weapon).numberOfDice} label='Number of Dice' onChange={(
                            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                        ) => onChange(e, 'numberOfDice')}/>
                        <FormControl fullWidth sx={formControlStyle}>
                            <InputLabel id='damage-id'>Damage Die</InputLabel>
                            <Select
                                labelId='damage-id'
                                id='damage'
                                label='Damage Die'
                                name='type'
                                value={(newEq as Weapon).damage}
                                onChange={(e: any) => onChange(e, 'damage')}
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
                        <NumberInput minZero value={(newEq as Weapon).criticalRange} label='Crit Range' onChange={(
                            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                        ) => onChange(e, 'criticalRange')}/>
                        <NumberInput minZero value={(newEq as Weapon).criticalMultiplier} label='Crit Multiplier' onChange={(
                            e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                        ) => onChange(e, 'criticalMultiplier')}/>
                    </>
                ) : null}
                {!!isArmor ? (
                    <>
                    <Typography sx={{margin: '.5rem 0'}}>Armor Info</Typography>
                    <NumberInput value={(newEq as Armor).armorCheckPenalty} label='Armor Check Penalty' onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => onChange(e, 'armorCheckPenalty')}/>
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
