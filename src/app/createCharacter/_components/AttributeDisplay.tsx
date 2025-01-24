import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Typography,
} from '@mui/material';
import React, { Dispatch, useState } from 'react';

import {
    CharacterAction,
    updateAttributeAction,
    updateAttributeRacialAction,
} from '../../../_reducer/characterReducer';
import { Modifier, Character, AttributeNames } from '@/_models';
import {
    totalAttributeValue,
    getBaseAttributeScore,
    getTotalAttributeModifier,
    getAttributeBonuses,
    getAllAttributeModifiers,
} from '@/_utils/attributeUtils';
import { getTotalSaveBonus } from '@/_utils/defenseUtils';
import { DisplayBox } from '@/app/character/_components/DisplayBox';
import { CardTitles } from '@/app/character/_components/AttributeDisplay';

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
    const [updateAttributeValue, setUpdateAtrtibuteValue] = useState<string | number>(character.attributes[attribute].value);
    const [updateRacialValue, setUpdateRacialValue] = useState<string | number>(character.attributes[attribute].racialBonus || 0);
        const [isAttributeFocused, setAttributeFocused] = useState(false);
        const [isRacialFocused, setRacialFocused] = useState(false);
        const handleAttributeChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setAttributeFocused(true);
            setUpdateAtrtibuteValue(e.target.value)
        }
        const handleRacialChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            setRacialFocused(true);
            setUpdateRacialValue(e.target.value)
        }
        const dispatchAttributeChange = () => {
            !!dispatch &&
            dispatch(
                updateAttributeAction(
                    AttributeNames[attribute],
                    Number(updateAttributeValue)
                )
            )
            setAttributeFocused(false);
        }
        const dispatchRacialChange = () => {
            !!dispatch &&
            dispatch(
                updateAttributeRacialAction(
                    AttributeNames[attribute],
                    Number(updateRacialValue)
                )
            )
            setRacialFocused(false);
        }
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
                    displayValue={updateAttributeValue}
                    editable={true}
                    onChange={handleAttributeChange}
                    isFocused={isAttributeFocused}
                    dispatchChange={dispatchAttributeChange}
                />
            </TableCell>
            <TableCell>
                <DisplayBox
                    displayTitle={CardTitles.Racial}
                    displayValue={updateRacialValue}
                    editable={true}
                    onChange={handleRacialChange}
                    isFocused={isRacialFocused}
                    dispatchChange={dispatchRacialChange}
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
