import {
    Button,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Armor, Character, Equipment, Modifier, Weapon } from '@/_models';
import { Add } from '@mui/icons-material';
import {
    CharacterAction,
    toggleEquippedAction,
} from '@/_reducer/characterReducer';
import { Dispatch } from 'react';

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
    return (
        <>
            <Card sx={eqDisplayCardStyle}>
                <CardContent
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                >
                    <Typography variant='h6'>Weapons</Typography>
                    <div>
                        <Button>Add</Button>
                        <Button>Remove</Button>
                    </div>
                </CardContent>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Damage</TableCell>
                            <TableCell align='center'>Two-Handed?</TableCell>
                            <TableCell>Critical</TableCell>
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
                                    <TableCell>{weapon.damage}</TableCell>
                                    <TableCell align='center'>
                                        {!!weapon.twoHanded ? (
                                            <CheckCircleOutlineIcon />
                                        ) : null}
                                    </TableCell>
                                    <TableCell>{`${critRange} / x${weapon.criticalMultiplier}`}</TableCell>
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
                                            <CheckCircleOutlineIcon
                                                sx={{
                                                    '&:hover': {
                                                        opacity: '.6',
                                                        cursor: 'pointer',
                                                    },
                                                }}
                                                onClick={() =>
                                                    dispatch(
                                                        toggleEquippedAction(eq)
                                                    )
                                                }
                                            />
                                        ) : (
                                            <AddCircleOutlineIcon
                                                sx={{
                                                    '&:hover': {
                                                        opacity: '.6',
                                                        cursor: 'pointer',
                                                    },
                                                }}
                                                onClick={() =>
                                                    dispatch(
                                                        toggleEquippedAction(eq)
                                                    )
                                                }
                                            />
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </>
    );
};
