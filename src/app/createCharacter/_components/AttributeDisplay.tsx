import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { Dispatch } from 'react';

import {
    CharacterAction,
    updateAttributeAction,
} from '../../../_reducer/characterReducer';
import { BonusTypes, Modifier, Character, AttributeNames } from '@/_models';
import {
    totalAttributeValue,
    getBaseAttributeScore,
    getTotalAttributeModifier,
    getAttributeBonuses,
    getAllAttributeModifiers,
} from '@/_utils/attributeUtils';
import { getTotalSaveBonus } from '@/_utils/defenseUtils';
import { DisplayBox } from '@/app/character/_components/DisplayBox';

enum CardTitles {
    Total = 'Total',
    Base = 'Base',
    Modifier = 'Modifier',
    Save = 'Save',
}

type CardTitlesType = BonusTypes | CardTitles;
interface AttributeRowProps {
    character: Character;
    attribute: AttributeNames;
    modifiers: Modifier[];
    dispatch?: Dispatch<CharacterAction>;
}
const AttributeRow = ({
    character,
    attribute,
    modifiers,
    dispatch,
}: AttributeRowProps) => {
    const totalValue = totalAttributeValue(character, attribute);
    return (
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
                    {attribute}
                </Typography>
            </TableCell>
            <TableCell>
                <DisplayBox
                    displayTitle={CardTitles.Base}
                    displayValue={getBaseAttributeScore(character, attribute)}
                    editable={true}
                    onChange={(
                        e: React.ChangeEvent<
                            HTMLInputElement | HTMLTextAreaElement
                        >
                    ) =>
                        !!dispatch &&
                        dispatch(
                            updateAttributeAction(
                                AttributeNames[attribute],
                                Number(e.target.value)
                            )
                        )
                    }
                />
            </TableCell>
            <TableCell>
                <DisplayBox
                    displayTitle={CardTitles.Modifier}
                    displayValue={getTotalAttributeModifier(
                        character,
                        attribute
                    )}
                />
            </TableCell>
            <TableCell>
                <DisplayBox
                    displayTitle={CardTitles.Total}
                    displayValue={totalValue}
                    modifiers={modifiers}
                />
            </TableCell>
            <TableCell>
                <DisplayBox
                    displayTitle={CardTitles.Save}
                    displayValue={getTotalSaveBonus(
                        character,
                        attribute as AttributeNames
                    )}
                />
            </TableCell>
        </TableRow>
    );
};

interface AttributeDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const AttributeDisplay = ({
    character,
    dispatch,
}: AttributeDisplayProps) => {
    const { attributes } = character;
    return (
        <Card
            sx={{
                width: 'fit-content',
                height: 'fit-content',
            }}
        >
            <Table
                sx={{
                    width: '100%',
                    border: '1px solid gray',
                }}
            >
                <TableBody>
                    {Object.keys(attributes).map((attribute) => {
                        const typedAtt = attribute as AttributeNames;
                        const modifiers = getAllAttributeModifiers(
                            character,
                            typedAtt
                        );
                        return (
                            <AttributeRow
                                key={typedAtt}
                                character={character}
                                attribute={typedAtt}
                                modifiers={getAttributeBonuses(
                                    typedAtt,
                                    modifiers
                                )}
                                dispatch={dispatch}
                            ></AttributeRow>
                        );
                    })}
                </TableBody>
            </Table>
        </Card>
    );
};
