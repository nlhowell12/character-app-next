import { Character } from "@/_models";
import { User } from "@/_models/user";
import UserContext from "@/app/_auth/UserContext";
import { useContext, useEffect, useState } from "react";

export default () => {
    const [characters, setCharacters] = useState<Character[]>();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if(!!user){
            populateCharacters(user)
        }
    }, [user])

    const populateCharacters = (user: User) => {
        if(!!user.isDm){
            getAllCharacters()
        } else {
            getUserCharacters(user)
        }
    }
    const getAllCharacters = async () => {
        const res = await fetch('/api/characters');
        const characters = await res.json();
        if(!!characters)
        {
            setCharacters(characters);
        }
    }
    const getUserCharacters = async (user: User) => {
        const res = await fetch(`/api/characters?name=${user.name}`);
        const characters = await res.json();
        if(!!characters)
        {
            setCharacters(characters);
        }
    };
    const createCharacter = async (character: Character) => {
        const res = await fetch('/api/characters', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(character)
        })
        return res;
    }

    const updateCharacter = async (character: Character) => {
        const res = await fetch('/api/characters', {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(character)
        })
        return res;
    }

    return { characters, createCharacter, updateCharacter, getAllCharacters }
}