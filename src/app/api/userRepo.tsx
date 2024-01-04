import { db } from "./db";

const User = db.User;

const create = async (params: any) => {
    try {
        const user = await User.findOne({'name': params.name});
        if(!user){
            const newUser = new User(params);
            const res = await User.create(newUser);
            return res
        } else {
            throw 'User already exists'
        }

    } catch(e) {
        console.log(e)
        throw 'Failed to create user'
    }
};

const logIn = async (params: any) => {
    try {
        const user = await User.findOne({'name': params.name});
        if(user.password === params.password){
            return user
        } else {
            throw 'Password is incorrect'
        }
    } catch(e){
        console.log(e)
        throw 'Failed to log in'
    }
};

export const userRepo = {
    create,
    logIn
}