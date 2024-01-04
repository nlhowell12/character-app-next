import { User } from "@/_models/user";
import { createContext } from "react";

interface UserContextInterface {
    user: User | undefined;
    login: (user: User) => Promise<void>;
    createNewUser: (user: User) => Promise<void>;
}
const UserContext = createContext<UserContextInterface>({
    user: undefined,
    login: async (user: User) => {},
    createNewUser: async (user: User) => {}
});
export default UserContext