import { User } from "@/_models/user";
import { NextResponse } from "next/server";

const useUserService = () => {
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
            return user;
        } else {
            return new NextResponse(`User already exists or was not created`, {status: 500});
        }
    }
    return { loginUser, createUser }
}

export default useUserService