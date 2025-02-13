import { Card, Grid, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { RestartAlt } from '@mui/icons-material';
import { getSpecialResources } from '@/_utils/classUtils';
import { Character } from '@/_models';

interface SpecialResourceProps {
    character: Character;
}

interface WidgetProps {
    name: string;
    value: number;
}
const ResourceWidget = ({ name, value }: WidgetProps) => {
    const [resValue, setResValue] = useState(value);
    const handleAdd = () => {
        setResValue(resValue + 1);
    };
    const handleSubtract = () => {
        setResValue(resValue - 1);
    };
    const handleReset = () => {
        setResValue(value);
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
                <IconButton onClick={handleSubtract} disabled={!resValue}>
                    <RemoveCircleOutlineIcon />
                </IconButton>
                <Typography>{resValue}</Typography>
                <IconButton onClick={handleAdd} disabled={resValue === value}>
                    <AddCircleOutlineIcon />
                </IconButton>
                <IconButton onClick={handleReset} disabled={resValue === value}>
                    <RestartAlt />
                </IconButton>
            </Card>
        </Grid>
    );
};
const SpecialResourceTracker = ({ character }: SpecialResourceProps) => {
    const specialResources = getSpecialResources(character);

    return specialResources.map(({ name, value }) => {
        return <ResourceWidget key={name} name={name} value={value} />;
    });
};

export default SpecialResourceTracker;
