import { User } from '@/_models/user';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';

interface UserSignInProps {
    handleSignIn: (user: User) => void;
    handleCreate: (user: User) => void;
}
export const UserSignIn = ({ handleSignIn, handleCreate }: UserSignInProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [createFlow, setCreateFlow] = useState(false);

    const textFieldStyling = {
        marginBottom: '.5rem',
    };
    return (
        <Card
            sx={{
                width: '20rem',
                position: 'absolute',
                top: '50%',
                left: '50%',
            }}
        >
            <CardContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <CardHeader>Please Sign In</CardHeader>
                <TextField
                    sx={textFieldStyling}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    label='Username'
                />
                <TextField
                    sx={textFieldStyling}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    label='Password'
                />
                <Button
                    sx={textFieldStyling}
                    disabled={!username && !password}
                    variant='outlined'
                    onClick={() =>
                        !createFlow ? handleSignIn({ name: username, password, isDm: false }) : handleCreate({ name: username, password, isDm: false })
                    }
                >
                    {createFlow ? 'Create New User' : 'Sign In'}
                </Button>
                <Typography
                    variant='caption'
                    sx={{ '&:hover': { opacity: '.6', cursor: 'pointer' } }}
                    onClick={() => setCreateFlow(!createFlow)}
                    textAlign='center'
                >
                    {createFlow ? 'Sign In with Existing User?' : 'Create New User?'}
                </Typography>
            </CardContent>
        </Card>
    );
};
