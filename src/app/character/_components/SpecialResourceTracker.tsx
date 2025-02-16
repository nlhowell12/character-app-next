import { Card, Grid, IconButton, Typography } from '@mui/material';
import React, { Dispatch } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { RestartAlt } from '@mui/icons-material';
import { getSpecialResources } from '@/_utils/classUtils';
import { Character, CharacterKeys, SpecialResourceType } from '@/_models';
import { CharacterAction, updateAction } from '@/_reducer/characterReducer';

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
                [name]: currentValue + 1,
            })
        );
    };
    const handleSubtract = () => {
        dispatch(
            updateAction(CharacterKeys.specialResources, {
                ...specialResources,
                [name]: currentValue - 1,
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
        </Grid>
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
