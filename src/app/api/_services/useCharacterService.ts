import { Character } from "@/_models";
import { useEffect, useState } from "react";

export default () => {
    const [characters, setCharacters] = useState<Character[]>();

    useEffect(() => {
        getAllCharacters()
    }, [])

    const getAllCharacters = async () => {
        const res = await fetch('/api/characters');
        const characters = await res.json();
        if(!!characters)
        {
            setCharacters(characters);
        }
    }

    const createCharacter = async (character: Character) => {
        const res = await fetch('/api/characters', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(character)
        })
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

    return { characters, createCharacter, updateCharacter }
}