import {
    Armor,
    BodySlot,
    Damage,
    Dice,
    Equipment,
    Modifier,
    Sizes,
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { Add } from '@mui/icons-material';
import { ModChipStack } from '@/app/_components/ModChipStack';
import * as R from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import useEquipmentService from '@/app/api/_services/useEquipmentService';
import { camelToTitle } from '@/_utils/stringUtils';

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
    enum EquipmentTypeOptions {
        Armor = 'Armor',
        Weapons = 'Weapons',
        Other = 'Other',
        Custom = 'Custom'
    }
    const [equipmentType, setEquipmentType] = useState<EquipmentTypeOptions>(EquipmentTypeOptions.Armor);

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
        size: Sizes.Medium,
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
        isWeapon: false,
        twoHanded: false,
        cost: '0gp'
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
        if(key === 'isWeapon'){
            setNewObject({
                ...newEq,
                isArmor: false,
                [key]: e.target.checked
            });
            return
        }
        if(key === 'isArmor'){
            setNewObject({
                ...newEq,
                isWeapon: false,
                [key]: e.target.checked
            });
            return
        }
        setNewObject({
            ...newEq,
            [key]: e.target.checked
        });
    };

    const [selectedEquipment, setSelectedEquipment] = useState<Equipment>();

    const handleTableClick = (eq: Equipment) => {
        if(selectedEquipment && selectedEquipment.id === eq.id){
            setSelectedEquipment(undefined);
            setNewObject(initialEquipmentState);
        } else {
            setSelectedEquipment(eq);
            setNewObject({
                ...newEq,
                ...eq,
                modifiers: [...newEq.modifiers, ...eq.modifiers]
            })
        }
       
    }
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

    const { equipment } = useEquipmentService();
    const showCustomFields = equipmentType === EquipmentTypeOptions.Custom;
    const isTableDisplayedType = equipmentType !== EquipmentTypeOptions.Custom;
    const showEditFields = showCustomFields || !!edit;
    
    const columnsByType = {
        [EquipmentTypeOptions.Armor]: ['Name', 'Cost', 'Armor Bonus', 'Max Dex Bonus', 'Armor Check Penalty', 'Spell Failure', 'Weight', 'Category'],
        [EquipmentTypeOptions.Weapons]: ['Name', 'Cost', 'Damage', 'Critical', 'Range Increment', 'Weight', 'Damage Types'],
        [EquipmentTypeOptions.Other]: ['Name', 'Cost', 'Weight'],
    };
    const columnValuesByType = {
        [EquipmentTypeOptions.Armor]: (x: Armor) => {return {
            col1: x.name,
            col2: x.cost,
            col3: `+${x.modifiers[0].value}`,
            col4: x.maxDexBonus ? `+${x.maxDexBonus}` : '-',
            col5: x.armorCheckPenalty ? `-${x.armorCheckPenalty}` : '-',
            col6: `${x.spellFailure}%`,
            col7: `${x.weight} lbs`,
            col8: x.category
        }},
        [EquipmentTypeOptions.Weapons]: (x: Weapon) => {return {
            col1: x.name,
            col2: x.cost,
            col3: !!x.numberOfDice ? `${x.numberOfDice}${x.damage}` : '-',
            col4: `${x.criticalRange > 20 ? `${x.criticalRange}-20` : ''}x${x.criticalMultiplier}`,
            col5: !!x.rangeIncrement ? `${x.rangeIncrement} ft` : '-',
            col6: `${x.weight} lbs`,
            col7: x.damageTypes.join(', '),
        }},
        [EquipmentTypeOptions.Other]:  (x: Equipment) => {return {
            col1: x.name,
            col2: x.cost,
            col3: !!x.weight ? `${x.weight} lbs` : '-',
        }},
    };

    return (
        <Card sx={{overflow: 'scroll'}}>
            <CardActions>
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
                        edit
                        equipment
                    />
                {!edit && <FormControl sx={{width: '25%'}}>
                    <InputLabel id='type-id'>Equipment Type</InputLabel>
                    <Select
                        labelId='type-id'
                        id='type'
                        label='Equipment Type'
                        name='type'
                        value={equipmentType}
                        onChange={(e: any) => setEquipmentType(e.target.value)}
                    >
                        {Object.keys(EquipmentTypeOptions).map((x) => {
                            /* @ts-ignore */
                            return <MenuItem key={x} value={x}>{EquipmentTypeOptions[x]}</MenuItem>
                        })}
                    </Select>
                </FormControl>}
                {showCustomFields &&
                    <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                        
                            <FormControlLabel
                            control={
                                <Checkbox
                                    checked={(newEq as Weapon).isWeapon}
                                    onChange={(e) => handleCheck(e, 'isWeapon')}
                                    disabled={newEq.isArmor}
                                />
                            }
                            label='Is this a Weapon?'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={(newEq as Armor).isArmor}
                                    onChange={(e) => handleCheck(e, 'isArmor')}
                                    disabled={newEq.isWeapon}
                                />
                            }
                            label='Is this Armor?'
                        />
                    </FormGroup>
                }
            <ModChipStack edit mods={!selectedEquipment ? newEq.modifiers : newEq.modifiers.filter(x => !x.defense)} onDelete={handleDeleteModifier}/>

            </CardActions>
            {showEditFields ? 
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
                 <FormControl fullWidth sx={formControlStyle}>
                    <InputLabel id='size-id'>Equipment Size</InputLabel>
                    <Select
                        labelId='size-id'
                        id='size'
                        label='Equipment Size'
                        name='size'
                        value={newEq.size}
                        onChange={(e: any) => handleChange(e, 'size')}
                    >
                        {Object.keys(Sizes).map((size) => {
                            return (
                                <MenuItem key={size} value={size}>
                                    {/* @ts-ignore */}
                                    {Sizes[size]}
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
                                            handleCheck(e, 'dexBasedAttack')
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
                                            handleCheck(e, 'dexBasedDamage')
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
            </CardContent> : 
            isTableDisplayedType && 
                <CardContent>
                    <TableContainer sx={{height: '24rem'}}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow>
                                    {columnsByType[equipmentType].map(x => {
                                        return <TableCell key={x} align='center'>{camelToTitle(x)}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(!!selectedEquipment ? [selectedEquipment] : equipment[equipmentType]).map(eq => {
                                    /* @ts-ignore */
                                    const values = columnValuesByType[equipmentType](eq);
                                    return <TableRow key={eq.name} hover onClick={() => handleTableClick(eq)}>
                                        {Object.keys(values).map(x => {
                                            /* @ts-ignore */
                                            return <TableCell key={`${eq.name}${x}`} align='center'>{values[x]}</TableCell>
                                        })}
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            }
            <CardActions sx={{justifyContent: 'flex-end'}}>
                <Button onClick={() => onClose()}>Cancel</Button>
                <Button onClick={() => !!edit ? onEdit(newEq) : onAdd(newEq)}>{!!edit ? `Update Equipment` :`Add to Equipment`}</Button>
            </CardActions>
        </Card>
    );
};
