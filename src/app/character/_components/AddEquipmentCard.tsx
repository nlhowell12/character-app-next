import { Armor, Equipment, Weapon } from '@/_models';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControlLabel,
    FormGroup,
    TextField,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';

interface AddEquipmentCardProps {
    onAdd: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        key: keyof Equipment | keyof Weapon | keyof Armor
    ) => void;
    newEq: Equipment;
    onClose: () => void;
}
export const AddEquipmentCard = ({
    onAdd,
    onChange,
    newEq,
    onClose,
}: AddEquipmentCardProps) => {
    const [isArmor, setIsArmor] = useState<boolean>(false);
    const [isWeapon, setIsWeapon] = useState<boolean>(false);
    return (
        <Card>
            <CardActions>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isWeapon}
                                onChange={(e) => setIsWeapon(e.target.checked)}
                            />
                        }
                        label='Is this a Weapon?'
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isArmor}
                                onChange={(e) => setIsArmor(e.target.checked)}
                            />
                        }
                        label='Is this Armor?'
                    />
                </FormGroup>
            </CardActions>
            <CardContent>
                <TextField
                    value={newEq.name}
                    label='Name'
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => onChange(e, 'name')}
                />
                <TextField
                    value={newEq.weight}
                    label='Weight'
                    onChange={(
                        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                    ) => onChange(e, 'weight')}
                />
                {!!isWeapon ? (
                    <>
                        <TextField
                            value={(newEq as Weapon).category}
                            label='Category'
                            onChange={(
                                e: ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) => onChange(e, 'category')}
                        />
                    </>
                ) : null}
            </CardContent>
            <CardActions>
                <Button onClick={() => onAdd()}>Add to Equipment</Button>
                <Button onClick={() => onClose()}>Cancel</Button>
            </CardActions>
        </Card>
    );
};
