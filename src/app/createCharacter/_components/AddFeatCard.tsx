import { Feat } from "@/_models";
import { CancelRounded, CheckCircle } from "@mui/icons-material";
import { Button, Card, CardActions, CardContent, CardHeader, TextField} from "@mui/material"
import { useState } from "react";

const textFieldStyling = { marginTop: '.5rem' };

interface AddFeatCardProps {
    onClose: (event: any, reason: any) => void;
    onSubmit: (feat: Feat) => void;
}

export const AddFeatCard = ({onClose, onSubmit} : AddFeatCardProps) => {
    const [name, setName] = useState('');
    const [definition, setDefinition] = useState('');
    const handleSubmitClick = () => {
        const feat: Feat = {
            name,
            definition
        } 
        onSubmit(feat)
        onClose({}, 'buttonClose')
    }
    return (
        <Card variant="outlined">
            <CardHeader title='Add New Feat' />
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <TextField
                        sx={textFieldStyling}
                        variant='outlined'
                        label='Feat Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        sx={textFieldStyling}
                        variant='outlined'
                        label='Definition'
                        value={definition}
                        onChange={(e) => setDefinition(e.target.value)}
                    />
                </div>
            </CardContent>
            <CardActions sx={{ justifyContent: 'right' }}>
                <Button onClick={(e) => onClose(e, 'buttonClose')}>
                    <CancelRounded />
                </Button>
                <Button onClick={() => handleSubmitClick()}>
                    <CheckCircle />
                </Button>
            </CardActions>
        </Card>
    )
}