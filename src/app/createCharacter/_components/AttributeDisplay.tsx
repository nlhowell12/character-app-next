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

import { CharacterAction, updateAttributeAction } from '../../../_reducer/characterReducer';
import { BonusTypes, Modifier, Character, AttributeNames } from '@/_models';
import {
    totalAttributeValue,
    getBaseAttributeScore,
    getTotalAttributeModifier,
    getAttributeBonuses,
} from '@/_utils/attributeUtils';
import { getTotalSaveBonus } from '@/_utils/defenseUtils';

enum CardTitles {
    Total = 'Total',
    Base = 'Base',
    Modifier = 'Modifier',
    Save = 'Save',
}

type CardTitlesType = BonusTypes | CardTitles;

const AttributeTooltip: React.FC<{ modifiers: Modifier[] }> = ({
    modifiers,
}) => {
    return (
        <Table>
            <TableBody>
                <TableRow>
                    {modifiers.map((mod) => {
                        return (
                            <TableCell key={mod.type + mod.value}>
                                <DisplayBox
                                    displayTitle={mod.type}
                                    displayValue={mod.value || 0}
                                    modifiers={modifiers}
                                />
                            </TableCell>
                        );
                    })}
                </TableRow>
            </TableBody>
        </Table>
    );
};

interface AttributeDisplayProps {
    displayTitle: CardTitlesType;
    displayValue: number;
    modifiers?: Modifier[];
    editable?: boolean;
    dispatch?: Dispatch<CharacterAction>;
    onChange?: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

const DisplayBox: React.FC<AttributeDisplayProps> = ({
    modifiers,
    displayTitle,
    displayValue,
    editable,
    onChange,
}) => {
    return !!modifiers?.length && displayTitle === CardTitles.Total ? (
        <Tooltip
            title={<AttributeTooltip modifiers={modifiers} />}
            placement='right'
        >
            <div
                style={{
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Typography variant='caption'>{displayTitle}</Typography>
                <Typography variant='h4'>{displayValue}</Typography>
            </div>
        </Tooltip>
    ) : (
        <div
            style={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Typography variant='caption'>{displayTitle}</Typography>
            {!!editable ? (
                <TextField
                    sx={{
                        maxWidth: '4rem',
                    }}
                    value={displayValue}
                    onChange={(e) => !!onChange && onChange(e)}
                />
            ) : (
                <Typography variant='h4'>{displayValue}</Typography>
            )}
        </div>
    );
};

const AttributeRow: React.FC<{
    character: Character;
    attribute: AttributeNames;
    modifiers: Modifier[];
    dispatch?: Dispatch<CharacterAction>;
}> = ({ character, attribute, modifiers, dispatch }) => {
    const totalValue = totalAttributeValue(character, attribute);
    return (
        <TableRow
            sx={{
                height: '3rem',
                alignItems: 'center',
                display: 'flex',
                width: '100%',
            }}
        >
            <TableCell>
                <Typography
                    sx={{
                        padding: '0 1rem',
                        display: 'flex',
                        flexGrow: 1,
                    }}
                    variant='h5'
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

export const AttributeDisplay: React.FC<{
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}> = ({ character, dispatch }) => {
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
                        const modifiers =
                            character.attributes[typedAtt].modifiers;
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
