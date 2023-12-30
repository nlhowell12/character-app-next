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
}
export const NumberInput = ({label, value, onChange, minZero}: NumberInputProps) => {
    return(
        <FormControl fullWidth sx={formControlStyle}>
            <InputLabel id={`${label.toLowerCase()}-id`}>{label}</InputLabel>
            <OutlinedInput
                type='number'
                label={label}
                name={label.toLowerCase()}
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