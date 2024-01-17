'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import ThemeRegistry from '@/_utils/theme/ThemeRegistry';
import { Grid } from '@mui/material';
import Header from './_components/Header';
import { User } from '@/_models/user';
import { useEffect, useState } from 'react';
import useUserService from './api/_services/useUserService';
import UserContext from './_auth/UserContext';
import { UserSignIn } from './_components/UserSignIn';
import {LoadSkeleton} from './_components/LoadSkeleton';
import * as Ably from 'ably';
import { AblyProvider } from 'ably/react';
import { v4 as uuidv4 } from 'uuid';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
    title: 'Rhedrah Character Builder',
    description:
        'Created for use in the Second Edition of the Rhedrah campaign',
};

export const initialUser: User = {
    name: '',
    password: '',
    isDm: false,
};

const client = new Ably.Realtime.Promise({ key: '1ZOkeg.ZOkKzg:dAjzR3Y_22i_NBTizBCBt4AxfO_AcLFCkBTAKVAWi7k', clientId: uuidv4() });

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User>();
    const [isLoading, setLoading] = useState(true);
    const { createUser, loginUser } = useUserService();
    const localStorageKey = 'user';

    useEffect(() => {
        const storedUser = localStorage.getItem(localStorageKey);
        if (!!storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        setLoading(false)
    }, []);

    const login = async (user: User) => {
        setLoading(true);
        const res = await loginUser(user);
        if (res.name) {
            setUser(res);
            localStorage.setItem(localStorageKey, JSON.stringify({name: res.name, isDm: res.isDm}));
        }
        setLoading(false)
    };
    const createNewUser = async (user: User) => {
        const res = await createUser(user);
        if (res.name) {
            setUser(user);
        }
    };

    const logout = () => {
        setUser(undefined);
        localStorage.removeItem(localStorageKey);
    };


    return (
        <html lang='en'>
            <body className={inter.className} style={{backgroundColor: 'black'}}>
            <AblyProvider client={client}>
                <AppRouterCacheProvider>
                    <ThemeRegistry options={{ key: 'mui-theme' }}>
                        <UserContext.Provider
                            value={{ user, login, createNewUser, logout }}
                        >
                            <LoadSkeleton loading={isLoading}>
                                {!user?.name ? (
                                    <UserSignIn />
                                ) : (
                                    <Grid
                                        sx={{
                                            marginLeft: '6rem',
                                            marginTop: '5rem',
                                            height: '100vh',
                                        }}
                                    >
                                        <Header />
                                        {children}
                                    </Grid>
                                )}
                            </LoadSkeleton>
                        </UserContext.Provider>
                    </ThemeRegistry>
                </AppRouterCacheProvider>
                </AblyProvider>
            </body>
        </html>
    );
}
