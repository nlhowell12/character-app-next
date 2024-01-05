import { camelString } from "@/_utils/stringUtils";
import { numberInputStyling } from "@/_utils/theme"
import { FormControl, InputLabel, OutlinedInput } from "@mui/material"

const formControlStyle = {
    marginBottom: '.5rem',
};

interface NumberInputProps {
    label: string;
    value: number;
    onChange: (e: any) => void;
    minZero?: boolean;
    sx?: {};
}
export const NumberInput = ({label, value, onChange, minZero, sx}: NumberInputProps) => {
    return(
        <FormControl fullWidth sx={{...formControlStyle, ...sx}}>
            <InputLabel id={`${label.toLowerCase()}-id`}>{label}</InputLabel>
            <OutlinedInput
                type='number'
                label={label}
                name={camelString(label)}
                sx={numberInputStyling}
                value={Number(value)}
                onChange={onChange}
                inputProps={{
                    min: minZero ? 0 : undefined
                }}
            />
        </FormControl>
    )
}