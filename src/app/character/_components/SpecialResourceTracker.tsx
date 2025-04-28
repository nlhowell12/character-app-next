import { Button, Card, Grid, IconButton, Typography } from '@mui/material';
import React, { Dispatch, useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { RestartAlt } from '@mui/icons-material';
import { getSpecialResources, isRaging } from '@/_utils/classUtils';
import { Character, CharacterKeys, SpecialResourceType } from '@/_models';
import {
    CharacterAction,
    removeRageAction,
    setRageAction,
    updateAction,
} from '@/_reducer/characterReducer';

interface SpecialResourceProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

interface WidgetProps {
    name: SpecialResourceType;
    initialValue: number;
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}
const ResourceWidget = ({
    name,
    initialValue,
    character,
    dispatch,
}: WidgetProps) => {
    const { specialResources } = character;
    const currentValue = specialResources[name];
    const handleAdd = () => {
        dispatch(
            updateAction(CharacterKeys.specialResources, {
                ...specialResources,
                [name]: !!currentValue ? currentValue + 1 : initialValue,
            })
        );
    };
    const handleSubtract = () => {
        dispatch(
            updateAction(CharacterKeys.specialResources, {
                ...specialResources,
                [name]: !!currentValue ? currentValue - 1 : initialValue,
            })
        );
    };
    const handleReset = () => {
        dispatch(
            updateAction(CharacterKeys.specialResources, {
                ...specialResources,
                [name]: initialValue,
            })
        );
    };
    return (
        <Grid>
            <Card
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '1rem',
                    marginTop: '.5rem',
                    marginBottom: '.5rem',
                    marginLeft: '.5rem',
                }}
            >
                <Typography>{name}</Typography>
                <IconButton onClick={handleSubtract} disabled={!currentValue}>
                    <RemoveCircleOutlineIcon />
                </IconButton>
                <Typography>{specialResources[name]}</Typography>
                <IconButton
                    onClick={handleAdd}
                    disabled={currentValue === initialValue && !!initialValue}
                >
                    <AddCircleOutlineIcon />
                </IconButton>
                <IconButton
                    onClick={handleReset}
                    disabled={currentValue === initialValue}
                >
                    <RestartAlt />
                </IconButton>
            </Card>
            {name === SpecialResourceType.Rage && (
                <RageButton character={character} dispatch={dispatch} />
            )}
        </Grid>
    );
};

interface RageProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}
const RageButton = ({ character, dispatch }: RageProps) => {
    const raging = isRaging(character.miscModifiers);
    const handleRage = () => {
        if (!raging) {
            dispatch(setRageAction());
        } else {
            dispatch(removeRageAction());
        }
    };
    return (
        <Button
            color={raging ? 'error' : undefined}
            variant='outlined'
            onClick={handleRage}
            fullWidth
            disabled={!character.specialResources.Rage && !raging}
        >
            {raging ? <strong>RAGE!</strong> : <p>Rage?</p>}
        </Button>
    );
};

const SpecialResourceTracker = ({
    character,
    dispatch,
}: SpecialResourceProps) => {
    const specialResources = getSpecialResources(character);
    return specialResources.map(({ name, value }) => {
        return (
            <ResourceWidget
                key={name}
                name={name}
                initialValue={value}
                character={character}
                dispatch={dispatch}
            />
        );
    });
};

export default SpecialResourceTracker;
