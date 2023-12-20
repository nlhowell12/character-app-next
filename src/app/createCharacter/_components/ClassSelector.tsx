import { Add } from '@mui/icons-material';
import { Button, Popover, Typography } from '@mui/material';
import React, { Dispatch, useState } from 'react';
import { CharacterAction } from '../../../_reducer/characterReducer';
import { AddClassCard } from './AddClassCard';
import { Character } from '@/_models';

interface ClassSelectorProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const ClassSelector: React.FC<ClassSelectorProps> = ({
    character,
    dispatch,
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);

    return (
        <div
            style={{
                margin: '0 .5rem',
                width: '20rem',
            }}
        >
            <Button variant='outlined' onClick={handleClick}>
                <Typography>Add Class</Typography>
                <Add />
            </Button>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <AddClassCard onClose={setAnchorEl} />
            </Popover>
        </div>
    );
};
