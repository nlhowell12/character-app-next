import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ClearIcon from '@mui/icons-material/Clear';
import { Armor, Character, Dice, Equipment, Modifier, Weapon } from '@/_models';
import {
    CharacterAction,
    addEquipmentAction,
    removeEquipmentAction,
    toggleEquippedAction,
} from '@/_reducer/characterReducer';
import React, { Dispatch, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AddEquipmentCard } from './AddEquipmentCard';
import { iconHoverStyling } from '@/_utils/theme';

interface EquipmentDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const EquipmentDisplay = ({
    character,
    dispatch,
}: EquipmentDisplayProps) => {
    const weapons = character.equipment.filter(
        (eq: Equipment) => !!(eq as Weapon).damage
    );
    const armor = character.equipment.filter(
        (eq: Equipment) =>
            !!(eq as Armor).modifiers.some((mod: Modifier) => !!mod.defense)
    );
    const eqDisplayCardStyle = {
        margin: '1rem',
    };
    const initialEquipmentState: Equipment = {
        id: uuidv4(),
        name: '',
        weight: 0,
        modifiers: [],
        equipped: false,
        numberOfDice: 0,
        damage: Dice.None,
        armorCheckPenalty: 0,
        criticalMultiplier: 2,
        criticalRange: 20,
        category: '',
    };

    const [newObject, setNewObject] = useState<Equipment>(
        initialEquipmentState
    );
    const [open, setOpen] = useState<boolean>(false);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof Equipment | keyof Weapon | keyof Armor
    ) => {
        setNewObject({ ...newObject, [key]: e.target.value });
    };
    const handleAdd = () => {
        dispatch(addEquipmentAction(newObject));
        setOpen(false);
    };

    const handleClose = () => {
        setNewObject(initialEquipmentState);
        setOpen(false);
    };
    return (
        <Card>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <CardHeader title='Equipment' />
                <CardActions>
                    <Button onClick={() => setOpen(true)}>Add</Button>
                </CardActions>
            </div>
            <Dialog open={open}>
                <AddEquipmentCard
                    onAdd={handleAdd}
                    onChange={handleChange}
                    newEq={newObject}
                    onClose={handleClose}
                />
            </Dialog>
            <Card sx={eqDisplayCardStyle}>
                <CardContent
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Typography variant='h6'>Weapons</Typography>
                </CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Damage</TableCell>
                            <TableCell align='center'>Two-Handed?</TableCell>
                            <TableCell>Critical</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {weapons.map((eq) => {
                            const weapon = eq as Weapon;
                            const critRange =
                                weapon.criticalRange < 20
                                    ? `${weapon.criticalRange}-20`
                                    : 20;
                            return (
                                <TableRow key={weapon.name}>
                                    <TableCell>{weapon.name}</TableCell>
                                    <TableCell>{`${Number(
                                        weapon.numberOfDice.toString()
                                    )}${weapon.damage}`}</TableCell>
                                    <TableCell align='center'>
                                        {!!weapon.twoHanded ? (
                                            <CheckCircleOutlineIcon />
                                        ) : null}
                                    </TableCell>
                                    <TableCell>{`${critRange} / x${weapon.criticalMultiplier}`}</TableCell>
                                    <TableCell>
                                        <Tooltip title='Remove Equipment'>
                                            <ClearIcon
                                                sx={iconHoverStyling}
                                                onClick={() =>
                                                    dispatch(
                                                        removeEquipmentAction(
                                                            eq
                                                        )
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
            <Card sx={eqDisplayCardStyle}>
                <CardContent>
                    <Typography variant='h6'>Armor</Typography>
                </CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Bonus</TableCell>
                            <TableCell>Body Slot</TableCell>
                            <TableCell align='center'>Equipped</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {armor.map((eq) => {
                            const armorMod = (eq as Armor).modifiers.find(
                                (mod) => mod.defense
                            );
                            return (
                                <TableRow key={eq.name}>
                                    <TableCell>{eq.name}</TableCell>
                                    <TableCell>{`${armorMod?.value || 0} (${
                                        armorMod?.type
                                    })`}</TableCell>
                                    <TableCell>{eq.bodySlot}</TableCell>
                                    <TableCell align='center'>
                                        {(eq as Armor).equipped ? (
                                            <Tooltip title='Unequip Item'>
                                                <CheckCircleOutlineIcon
                                                    sx={iconHoverStyling}
                                                    onClick={() =>
                                                        dispatch(
                                                            toggleEquippedAction(
                                                                eq
                                                            )
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        ) : (
                                            <Tooltip title='Equip Item'>
                                                <AddCircleOutlineIcon
                                                    sx={iconHoverStyling}
                                                    onClick={() =>
                                                        dispatch(
                                                            toggleEquippedAction(
                                                                eq
                                                            )
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title='Remove Equipment'>
                                            <ClearIcon
                                                sx={iconHoverStyling}
                                                onClick={() =>
                                                    dispatch(
                                                        removeEquipmentAction(
                                                            eq
                                                        )
                                                    )
                                                }
                                            />
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </Card>
    );
};
