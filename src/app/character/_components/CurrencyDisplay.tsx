import { Character, Currency, CharacterKeys } from "@/_models";
import { CharacterAction, updateAction } from "@/_reducer/characterReducer";
import { numberInputStyling } from "@/_utils/theme";
import { TableRow, TableCell, OutlinedInput, Card, Dialog, Table, TableBody, TextField } from "@mui/material";
import { Dispatch, useState } from "react";

interface CurrencyDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    open: boolean;
    onClose: () => void;
}

interface CoinBoxProps {
    dispatch: Dispatch<CharacterAction>;
    value: number;
    character: Character;
    coin: keyof Currency;
}
const CoinBox = ({value, dispatch, character, coin}: CoinBoxProps) => {
        const [updateValue, setUpdateValue] = useState<number>(value);
        const [isFocused, setFocused] = useState(false);
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
            const { value } = e.target;
            const updateValue = typeof value !== 'number' ? Number(value) : value;
            setFocused(true);
            setUpdateValue(updateValue)
        }
        const dispatchChange = (coin: keyof Currency) => {
            dispatch(
                updateAction(
                    CharacterKeys.currency,
                    {
                        ...character.currency,
                        [coin]:
                            updateValue
                    }
                )
            )
            setFocused(false);
        }
    return (
    <TextField
        type='number'
        sx={{
            ...numberInputStyling,
            width: '4rem',
        }}
        label={coin}
        value={isFocused ? updateValue : value}
        onChange={handleChange}
        onBlur={() => dispatchChange(coin)}
        inputProps={{
            min: 0,
        }}
        /* @ts-ignore */
        onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => e.key === "Enter" && e.target.blur()}
        />
    )
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
                                const currencyType = coin as keyof Currency;
                                return (
                                    <TableCell
                                        key={coin}
                                        sx={{ borderBottom: 'none' }}
                                    >
                                       <CoinBox value={character.currency[currencyType]} dispatch={dispatch} character={character} coin={currencyType}/> 
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

export default CurrencyDisplay;