import { User } from '@/_models/user';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
} from '@mui/material';
import { useContext, useState } from 'react';
import UserContext from '../_auth/UserContext';

interface UserSignInProps {}
export const UserSignIn = ({}: UserSignInProps) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [createFlow, setCreateFlow] = useState(false);

    const { login, createNewUser } = useContext(UserContext);

    const textFieldStyling = {
        marginBottom: '.5rem',
    };
    return (
        <Card
            sx={{
                width: '20rem',
                position: 'absolute',
                top: '35%',
                left: '45%',
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
                        !createFlow
                            ? login({ name: username, password, isDm: false })
                            : createNewUser({
                                  name: username,
                                  password,
                                  isDm: false,
                              })
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
                    {createFlow
                        ? 'Sign In with Existing User?'
                        : 'Create New User?'}
                </Typography>
            </CardContent>
        </Card>
    );
};
