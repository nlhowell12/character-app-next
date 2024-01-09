import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    OutlinedInput,
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
import EditIcon from '@mui/icons-material/Edit';
import {
    Armor,
    BodySlot,
    Character,
    Equipment,
    Modifier,
    Weapon,
} from '@/_models';
import {
    CharacterAction,
    addEquipmentAction,
    removeEquipmentAction,
    replaceEquipmentAction,
    toggleEquippedAction,
    updateEquipmentAction,
} from '@/_reducer/characterReducer';
import React, { Dispatch, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AddEquipmentCard } from './AddEquipmentCard';
import { iconHoverStyling, numberInputStyling } from '@/_utils/theme';
import {
    getAllArmorMods,
    getAllDamageModifiers,
    getDamageBonus,
    getEqBonusObject,
    getTotalArmorBonus,
} from '@/_utils/equipmentUtils';
import { BonusObject } from '@/_utils/defenseUtils';
import { DisplayBox } from './DisplayBox';

interface EquipmentDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

interface BonusTooltipProps {
    bonusObject: BonusObject;
}
const BonusTooltip = ({ bonusObject }: BonusTooltipProps) => {
    return (
        <Table>
            <TableBody>
                <TableRow>
                    {Object.keys(bonusObject).map((key) => {
                        return (
                            <TableCell key={key} size='small' align='center'>
                                <Typography>{key}</Typography>
                                {/* @ts-ignore */}
                                <Typography>{bonusObject[key]}</Typography>
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableBody>
        </Table>
    );
};
interface WeaponDamageTooltipProps {
    character: Character;
    weapon: Weapon;
}
const WeaponDamageTooltip = ({
    character,
    weapon,
}: WeaponDamageTooltipProps) => {
    const eqDamageBonuses = getEqBonusObject(
        character,
        getAllDamageModifiers(character, weapon)
    );
    return (
        <Table>
            <TableBody>
                <TableRow>
                    {Object.keys(eqDamageBonuses).map((bon) => {
                        const key = bon as keyof BonusObject;
                        return (
                            <TableCell key={key}>
                                <DisplayBox
                                    displayTitle={key}
                                    displayValue={eqDamageBonuses[key]}
                                />
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableBody>
        </Table>
    );
};
export const EquipmentDisplay = ({
    character,
    dispatch,
}: EquipmentDisplayProps) => {
    const weapons = character.equipment.filter(
        (eq: Equipment) =>
            !!(eq as Weapon).damage && eq.bodySlot === BodySlot.None
    );
    const armor = character.equipment.filter(
        (eq: Equipment) =>
            !!(eq as Armor).modifiers.some((mod: Modifier) => !!mod.defense)
    );
    const eqDisplayCardStyle = {
        margin: '0 .5rem',
    };

    const [open, setOpen] = useState<boolean>(false);
    const [editEq, setEditEq] = useState<Equipment>();

    const handleAdd = (newEq: Equipment) => {
        dispatch(addEquipmentAction(newEq));
        setOpen(false);
    };

    const handleEdit = (newEq: Equipment) => {
        dispatch(replaceEquipmentAction(newEq.id, newEq));
        setEditEq(undefined);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const weaponDamage = (weapon: Weapon) => {
        const damageBonus = getDamageBonus(
            character,
            weapon
        );
        const damagePositive = damageBonus >= 0 ? '+' : '-';
        if(!weapon.numberOfDice){
            return `${1 + damageBonus}`
        } else {
            return `${Number(
                weapon.numberOfDice.toString()
            )}${
                weapon.damage
            } ${damagePositive} ${Math.abs(
                damageBonus
            )}`
        }
    }
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
            <Dialog open={open || !!editEq}>
                <AddEquipmentCard
                    onAdd={handleAdd}
                    onClose={handleClose}
                    edit={editEq}
                    onEdit={handleEdit}
                />
            </Dialog>
            <Card sx={eqDisplayCardStyle}>
                <CardContent
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Typography variant='body1'>Weapons</Typography>
                </CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align='center'>Damage</TableCell>
                            <TableCell align='center'>Two-Handed?</TableCell>
                            <TableCell align='center'>
                                Range Increment
                            </TableCell>
                            <TableCell align='center'>Critical</TableCell>
                            <TableCell></TableCell>
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
                                    <TableCell>
                                        <OutlinedInput
                                            type='number'
                                            sx={{
                                                ...numberInputStyling,
                                                width: '4rem',
                                            }}
                                            value={weapon.amount}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateEquipmentAction(
                                                        weapon.id,
                                                        Number(e.target.value),
                                                        'amount'
                                                    )
                                                );
                                            }}
                                            inputProps={{
                                                min: 0,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Tooltip
                                            title={
                                                <WeaponDamageTooltip
                                                    character={character}
                                                    weapon={weapon}
                                                />
                                            }
                                        >
                                            <Typography>
                                                {weaponDamage(weapon)}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align='center'>
                                        {!!weapon.twoHanded ? (
                                            <CheckCircleOutlineIcon />
                                        ) : null}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {!!weapon.rangeIncrement ? (
                                            <Typography>
                                                {`${weapon.rangeIncrement} ft`}
                                            </Typography>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell align='center'>
                                        {`${critRange} / x${weapon.criticalMultiplier}`}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title='Edit Equipment'>
                                            <EditIcon
                                                sx={iconHoverStyling}
                                                onClick={() =>
                                                    setEditEq(weapon)
                                                }
                                            />
                                        </Tooltip>
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
            <Card sx={eqDisplayCardStyle}>
                <CardContent>
                    <Typography variant='body1'>Armor</Typography>
                </CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Bonus</TableCell>
                            <TableCell align='center'>Body Slot</TableCell>
                            <TableCell align='center'>Max Dex Bonus</TableCell>
                            <TableCell align='center'>
                                Armor Check Penalty
                            </TableCell>
                            <TableCell align='center'>Spell Failure</TableCell>
                            <TableCell>Hardness</TableCell>
                            <TableCell align='center'>Equipped</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {armor.map((eq) => {
                            const armor = eq as Armor;
                            return (
                                <TableRow key={armor.name}>
                                    <TableCell>{armor.name}</TableCell>
                                    <TableCell>
                                        <Tooltip
                                            title={
                                                <BonusTooltip
                                                    bonusObject={getEqBonusObject(
                                                        character,
                                                        getAllArmorMods(armor)
                                                    )}
                                                />
                                            }
                                        >
                                            <Typography>
                                                {`+${getTotalArmorBonus(
                                                    character,
                                                    armor
                                                )}`}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align='center'>
                                        {armor.bodySlot}
                                    </TableCell>
                                    <TableCell align='center'>{`+${armor.maxDexBonus}`}</TableCell>
                                    <TableCell align='center'>{`${
                                        !!armor.armorCheckPenalty ? '-' : ''
                                    }${armor.armorCheckPenalty}`}</TableCell>
                                    <TableCell align='center'>{`${armor.spellFailure}%`}</TableCell>
                                    <TableCell>
                                        <OutlinedInput
                                            type='number'
                                            sx={{
                                                ...numberInputStyling,
                                                width: '4rem',
                                            }}
                                            value={armor.hardness}
                                            onChange={(e) => {
                                                dispatch(
                                                    updateEquipmentAction(
                                                        armor.id,
                                                        e.target.value,
                                                        'hardness'
                                                    )
                                                );
                                            }}
                                            inputProps={{
                                                min: 0,
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align='center'>
                                        {armor.equipped ? (
                                            <Tooltip title='Unequip Item'>
                                                <CheckCircleOutlineIcon
                                                    sx={iconHoverStyling}
                                                    onClick={() =>
                                                        dispatch(
                                                            toggleEquippedAction(
                                                                armor
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
                                                                armor
                                                            )
                                                        )
                                                    }
                                                />
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title='Edit Equipment'>
                                            <EditIcon
                                                sx={iconHoverStyling}
                                                onClick={() =>
                                                    setEditEq(armor)
                                                }
                                            />
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title='Remove Equipment'>
                                            <ClearIcon
                                                sx={iconHoverStyling}
                                                onClick={() =>
                                                    dispatch(
                                                        removeEquipmentAction(
                                                            armor
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
