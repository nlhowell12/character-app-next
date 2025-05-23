import { AbilityTypes, Character, ClassAbility } from '@/_models';

import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import {
    getAbilityDescription,
    getAllClassAbilities,
    getHexbladeCurseDC,
} from '@/_utils/classUtils';
import useClassAbilityService from '@/app/api/_services/useClassAbilityService';

export enum CardTitles {
    Total = 'Total',
    Base = 'Base',
    Modifier = 'Modifier',
    Save = 'Save',
}

interface AbilityRowProps {
    ability: ClassAbility;
}
const AbilityRow = ({ ability }: AbilityRowProps) => {
    const { classAbilityResponse } = useClassAbilityService();

    const getAbiltyTitle = (ability: ClassAbility) => {
        const { name, domain, secondSelectedChoice, selectedChoice } = ability;
        const abilityName = name ? name : `${domain} Aspect`;
        const secondSelection = secondSelectedChoice
            ? `, ${secondSelectedChoice}`
            : '';
        const selection = selectedChoice
            ? ` (${selectedChoice}${secondSelection})`
            : '';

        return `${abilityName}${selection}`;
    };
    const getAbilityType = (ability: ClassAbility) => {
        switch (ability.abilityType) {
            case AbilityTypes.Extraordinary:
                return 'Ex';
            case AbilityTypes.Prayer:
                return 'Pr';
            case AbilityTypes.PsiLike:
                return 'Psi';
            case AbilityTypes.SpellLike:
                return 'Sp';
            case AbilityTypes.Supernatural:
                return 'Su';
            default:
                return '';
        }
    };
    return (
        <Tooltip
            title={
                !!classAbilityResponse
                    ? getAbilityDescription(ability, classAbilityResponse)
                    : ''
            }
            placement='right'
            key={ability.name + ability.level}
        >
            <TableRow
                sx={{
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <TableCell>
                    <Typography
                        sx={{
                            display: 'flex',
                            flexGrow: 1,
                        }}
                        variant='body1'
                    >
                        {ability.className}
                    </Typography>
                </TableCell>
                <TableCell>{ability.level}</TableCell>
                <TableCell>{getAbiltyTitle(ability)}</TableCell>
                <TableCell>{getAbilityType(ability)}</TableCell>
            </TableRow>
        </Tooltip>
    );
};

interface ClassAbilityDisplayProps {
    character: Character;
}
export const ClassAbilityDisplay = ({
    character,
}: ClassAbilityDisplayProps) => {
    const abilities = getAllClassAbilities(character);
    const theme = useTheme();
    const hexbladeDC = getHexbladeCurseDC(character);
    return (
        <Card
            sx={{
                width: '100%',
                height: 'fit-content',
                maxHeight: '60vh',
                overflow: 'scroll',
                [theme.breakpoints.up('xl')]: {
                    marginTop: '1.5rem',
                    maxWidth: '30rem',
                },
            }}
        >
            <Table
                sx={{
                    width: '100%',
                    border: '1px solid gray',
                }}
            >
                <TableBody sx={{ overflow: 'scroll' }}>
                    {!!hexbladeDC && (
                        <TableRow>
                            <TableCell>
                                <Typography>Hexblade Curse DC</Typography>
                            </TableCell>
                            <TableCell>
                                <Typography>{hexbladeDC}</Typography>
                            </TableCell>
                        </TableRow>
                    )}
                    {abilities
                        .sort((a, b) => a.level - b.level)
                        .map((ability) => {
                            return (
                                <AbilityRow
                                    key={
                                        ability.className +
                                        ability.description +
                                        ability.level
                                    }
                                    ability={ability}
                                />
                            );
                        })}
                </TableBody>
            </Table>
        </Card>
    );
};
