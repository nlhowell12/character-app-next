import { Character, MovementTypes, StatusEffects } from '@/_models';
import {
    CharacterAction,
    addMovementActions,
    removeMovementAction,
} from '@/_reducer/characterReducer';
import {
    Dialog,
    Card,
    Button,
    TextField,
    Typography,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Stack,
    Chip,
} from '@mui/material';
import { Dispatch, useState } from 'react';
import Add from '@mui/icons-material/Add';
import { NumberInput } from '@/app/_components/NumberInput';
import { checkForHalfMovement, reduceSpeed } from '@/_utils/classUtils';

interface SpeedDialogProps {
    character: Character;
    open: boolean;
    onClose: () => void;
    dispatch: Dispatch<CharacterAction>;
}

interface AddSpeedDialogProps {
    dispatch: Dispatch<CharacterAction>;
}
const AddSpeedDialog = ({ dispatch }: AddSpeedDialogProps) => {
    const [type, setType] = useState<MovementTypes>(MovementTypes.Land);
    const [speed, setSpeed] = useState<number>(0);

    const reset = () => {
        setType(MovementTypes.Land);
        setSpeed(0);
    };

    const handleSave = () => {
        dispatch(addMovementActions({ type, speed: Number(speed) }));
        reset();
    };
    const textFieldStyling = {
        marginBottom: '.5rem',
    };
    const formControlStyle = {
        marginBottom: '.5rem',
    };
    return (
        <Card
            sx={{
                padding: '.5rem',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <FormControl fullWidth sx={formControlStyle}>
                <InputLabel id='movement-type-id'>Movement Type</InputLabel>
                <Select
                    labelId='movement-type-id'
                    id='movement-type'
                    label='Movement Type'
                    name='type'
                    value={type}
                    onChange={(e) => setType(e.target.value as MovementTypes)}
                >
                    {Object.keys(MovementTypes).map((type) => {
                        return (
                            <MenuItem key={type} value={type}>
                                {/* @ts-ignore */}
                                {MovementTypes[type]}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
            <NumberInput
                label='Speed'
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
            />
            <Button variant='outlined' onClick={handleSave}>
                <Typography>Add Speed</Typography>
                <Add sx={{ marginLeft: '.5rem' }} />
            </Button>
        </Card>
    );
};

export const SpeedDialog = ({
    character,
    open,
    onClose,
    dispatch,
}: SpeedDialogProps) => {
    const adjustedMovement = checkForHalfMovement(character);
    return (
        <Dialog open={open} onClose={onClose}>
            <Card
                sx={{
                    width: '20rem',
                }}
            >
                <Stack>
                    {adjustedMovement.map((spd) => {
                        return (
                            <Chip
                                key={`${spd.type}${spd.speed}`}
                                label={`${spd.type} - ${spd.speed}`}
                                variant='outlined'
                                onDelete={() =>
                                    dispatch(removeMovementAction(spd))
                                }
                            />
                        );
                    })}
                </Stack>
                <AddSpeedDialog dispatch={dispatch} />
            </Card>
        </Dialog>
    );
};
