import { User } from "@/_models/user";
import { initialUser } from "@/app/layout";
import { NextResponse } from "next/server";
import { useState } from "react";

const useUserService = () => {
    const [user, setUser] = useState<User>(initialUser);

    const loginUser = async (user: User) => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user)
        });
        if(res.status === 200){
            const user = await res.json()
            setUser(user)
            return user;
        } else {
            return new NextResponse(`Password did not match or User has not been created`, {status: 500});
        }
    }
    const createUser = async (user: User) => {
        const res = await fetch('/api/login', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(user)
        });
        if(res.status === 200){
            const user = await res.json()
            setUser(user)
            return user;
        } else {
            return new NextResponse(`User already exists or was not created`, {status: 500});
        }
    }
    return { loginUser, createUser, user }
}

export default useUserService