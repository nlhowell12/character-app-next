import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Dialog,
    IconButton,
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
    CarryingCapacityObject,
    Character,
    CharacterKeys,
    Currency,
    Equipment,
    Weapon,
} from '@/_models';
import {
    CharacterAction,
    addEquipmentAction,
    removeEquipmentAction,
    replaceEquipmentAction,
    toggleEquippedAction,
    updateAction,
    updateEquipmentAction,
} from '@/_reducer/characterReducer';
import React, { Dispatch, useMemo, useState } from 'react';
import { AddEquipmentCard } from './AddEquipmentCard';
import { iconHoverStyling, numberInputStyling } from '@/_utils/theme';
import {
    determineCarryingCapacity,
    getAllArmorMods,
    getAllDamageModifiers,
    getAttackBonus,
    getDamageBonus,
    getDiceDamageModifiers,
    getEqBonusObject,
    getTotalArmorBonus,
    getTotalCarriedWeight,
} from '@/_utils/equipmentUtils';
import { BonusObject } from '@/_utils/defenseUtils';
import { DisplayBox } from './DisplayBox';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { camelToTitle } from '@/_utils/stringUtils';
import PaidIcon from '@mui/icons-material/Paid';
import { NumberInput } from '@/app/_components/NumberInput';
import { v4 as uuidv4 } from 'uuid';

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
interface CarryCapTooltipProps {
    cap: CarryingCapacityObject;
}

const CarryCapTooltip = ({ cap }: CarryCapTooltipProps) => {
    return (
        <Table>
            <TableBody>
                <TableRow>
                    {Object.keys(cap).map((key) => {
                        return (
                            <TableCell
                                key={key}
                                size='small'
                                align='center'
                                sx={{ borderBottom: 'none' }}
                            >
                                <Typography>{camelToTitle(key)}</Typography>
                                {/* @ts-ignore */}
                                <Typography>{cap[key]}</Typography>
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

interface CurrencyDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    open: boolean;
    onClose: () => void;
}
const CurrencyDisplay = ({
    character,
    dispatch,
    open,
    onClose,
}: CurrencyDisplayProps) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <Card>
                <Table>
                    <TableBody>
                        <TableRow>
                            {Object.keys(character.currency).map((coin) => {
                                return (
                                    <TableCell
                                        key={coin}
                                        sx={{ borderBottom: 'none' }}
                                    >
                                        <NumberInput
                                            label={coin.toUpperCase()}
                                            value={Number(
                                                character.currency[
                                                    coin as keyof Currency
                                                ]
                                            )}
                                            onChange={(e) =>
                                                dispatch(
                                                    updateAction(
                                                        CharacterKeys.currency,
                                                        {
                                                            ...character.currency,
                                                            [coin as keyof Currency]:
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                ).toFixed(2),
                                                        }
                                                    )
                                                )
                                            }
                                        />
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>
        </Dialog>
    );
};
interface EquipmentInputProps {
    id: string;
    value: string | number;
    dispatch: Dispatch<CharacterAction>
    eqKey: keyof Equipment | keyof Weapon | keyof Armor;
};

const EquipmentInput = ({id, value, dispatch, eqKey} : EquipmentInputProps) => {
    const [updateValue, setUpdateValue] = useState(value);
    const [isFocused, setFocused] = useState(false);
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setFocused(true);
        setUpdateValue(e.target.value)
    }
    const dispatchChange = () => {
        dispatch(
            updateEquipmentAction(
                id,
                updateValue,
                eqKey
            )
        );
        setFocused(false);
    }
 return ( 
    <OutlinedInput
        type='number'
        sx={{
            ...numberInputStyling,
            width: '4rem',
        }}
        value={isFocused ? updateValue : value}
        onChange={handleChange}
        onBlur={() => dispatchChange()}
        inputProps={{
            min: 0,
        }}
    />
    )
};

export const EquipmentDisplay = ({
    character,
    dispatch,
}: EquipmentDisplayProps) => {
    const weapons = character.equipment.filter(
        (eq: Equipment) => (eq as Weapon).isWeapon
    );
    const armor = character.equipment.filter(
        (eq: Equipment) => (eq as Armor).isArmor
    );
    const otherEq = character.equipment.filter(
        (eq: Equipment) => !(eq as Armor).isArmor && !(eq as Weapon).isWeapon
    );
    const eqDisplayCardStyle = {
        margin: '0 .5rem',
    };

    const [open, setOpen] = useState<boolean>(false);
    const [editEq, setEditEq] = useState<Equipment>();
    const [openCurrency, setOpenCurrency] = useState<boolean>(false);

    const handleAdd = (newEq: Equipment) => {
        dispatch(addEquipmentAction(newEq));
        setOpen(false);
    };

    const handleEdit = (newEq: Equipment) => {
        dispatch(replaceEquipmentAction(newEq.id, newEq));
        setEditEq(undefined);
    };

    const handleClose = () => {
        !editEq ? setOpen(false) : setEditEq(undefined);
    };
    const weaponDamage = (weapon: Weapon) => {
        const damageBonus = getDamageBonus(character, weapon);
        const damagePositive = damageBonus >= 0 ? '+' : '-';
        const diceDamageBonuses = getDiceDamageModifiers(character, weapon);
        const bonusDiceString = () => {
            let string = '';
            diceDamageBonuses.forEach((x) => {
                const addString = `\n+ ${x.numberOfDice}${x.damageDice} ${x.damageType}`;
                string += addString;
            });
            return string;
        };
        if (!weapon.numberOfDice) {
            return `${1 + damageBonus}`;
        } else {
            return `${Number(weapon.numberOfDice.toString())}${
                weapon.damage
            } ${damagePositive} ${Math.abs(damageBonus)} ${bonusDiceString()}`;
        }
    };

    const totalWeightCarried = useMemo(() => {
        return getTotalCarriedWeight(character);
    }, [character.equipment, character.currency]);

    const carryingCap = useMemo(() => {
        return determineCarryingCapacity(character);
    }, [character]);

    const weightIconColor = () => {
        if (totalWeightCarried <= carryingCap.light) {
            return 'success';
        } else if (totalWeightCarried <= carryingCap.med) {
            return 'warning';
        } else {
            return 'error';
        }
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
                    <Tooltip title='Currency'>
                        <IconButton onClick={() => setOpenCurrency(true)}>
                            <PaidIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title={<CarryCapTooltip cap={carryingCap} />}>
                        <FitnessCenterIcon color={weightIconColor()} />
                    </Tooltip>
                    <Typography variant='caption'>{`Total: ${totalWeightCarried} lbs`}</Typography>

                    <Button onClick={() => setOpen(true)}>Add</Button>
                </CardActions>
            </div>
            <Dialog open={open || !!editEq} maxWidth={false} onClose={() => {
                setOpen(false);
                setEditEq(undefined);
            }}>
                <AddEquipmentCard
                    onAdd={handleAdd}
                    onClose={handleClose}
                    edit={editEq}
                    onEdit={handleEdit}
                />
            </Dialog>
            <CurrencyDisplay
                character={character}
                dispatch={dispatch}
                open={openCurrency}
                onClose={() => setOpenCurrency(false)}
            />
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
                            <TableCell align='center'>Attack Bonus</TableCell>
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
                                <TableRow key={uuidv4()}>
                                    <TableCell>{weapon.name}</TableCell>
                                    <TableCell>
                                        <EquipmentInput id={weapon.id} value={weapon.amount} dispatch={dispatch} eqKey={'amount'}/>
                                    </TableCell>
                                    <TableCell align='center'>
                                        <Typography>{`${getAttackBonus(
                                            character,
                                            weapon
                                        )}`}</Typography>
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
                                <TableRow key={uuidv4()}>
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
                                        <EquipmentInput id={armor.id} value={armor.hardness} dispatch={dispatch} eqKey={'hardness'}/>
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
                                                onClick={() => setEditEq(armor)}
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
            <Card sx={eqDisplayCardStyle}>
                <CardContent>
                    <Typography variant='body1'>Other Equipment</Typography>
                </CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell align='center'>Body Slot</TableCell>
                            <TableCell align='center'>Equipped</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        {otherEq.map((eq) => {
                            return (
                                <TableRow key={uuidv4()}>
                                    <TableCell>{eq.name}</TableCell>
                                    <TableCell>
                                        <EquipmentInput id={eq.id} value={eq.amount} dispatch={dispatch} eqKey={'amount'}/>
                                    </TableCell>
                                    <TableCell align='center'>
                                        {eq.bodySlot}
                                    </TableCell>
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
                                        <Tooltip title='Edit Equipment'>
                                            <EditIcon
                                                sx={iconHoverStyling}
                                                onClick={() => setEditEq(eq)}
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
        </Card>
    );
};
