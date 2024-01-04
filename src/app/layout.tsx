'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ThemeRegistry from "@/_utils/theme/ThemeRegistry";
import { Grid } from "@mui/material";
import Header from "./_components/Header";
import { User } from "@/_models/user";
import { useState } from "react";
import useUserService from "./api/_services/useUserService";
import UserContext from "./_auth/UserContext";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Rhedrah Character Builder",
  description: "Created for use in the Second Edition of the Rhedrah campaign",
};

export const initialUser: User = {
  name: '',
  password: '',
  isDm: false
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User>();

  const { createUser, loginUser} = useUserService();

  const login = async (user: User) => {
    const res = await loginUser(user);
    if(res.name){
      setUser(user)
    }
  }
  const createNewUser = async (user: User) => {
    const res = await createUser(user);
    if(res.name){
      setUser(user)
    }
  }

  const logout = () => {
    setUser(undefined);
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeRegistry options={{ key: "mui-theme" }}>
            <UserContext.Provider value={{user, login, createNewUser}}>
              <Grid
                sx={{
                    marginLeft: "6rem",
                    marginTop: "5rem",
                    height: '100vh'
                  }}
              >
                <Header />
                {children}
              </Grid>
            </UserContext.Provider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
