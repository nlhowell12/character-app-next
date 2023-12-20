import { Add } from '@mui/icons-material';
import { Button, Dialog, Popover, Typography } from '@mui/material';
import React, { Dispatch, useState } from 'react';
import { CharacterAction } from '../../../_reducer/characterReducer';
import { AddClassCard } from './AddClassCard';
import { Character } from '@/_models';

interface ClassSelectorProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const ClassSelector = ({
    character,
    dispatch,
} : ClassSelectorProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = (event: any, reason: any) => {
        if (reason !== 'backdropClick') {
          setOpen(!open)
        }
      }

    return (
        <div
            style={{
                margin: '0 .5rem',
                width: '20rem',
            }}
        >
            <Button variant='outlined' onClick={() => setOpen(true)}>
                <Typography>Add Class</Typography>
                <Add />
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <AddClassCard onClose={handleClose} />
            </Dialog>
        </div>
    );
};
