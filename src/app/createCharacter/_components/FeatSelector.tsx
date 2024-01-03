import { Character, CharacterKeys, Feat } from "@/_models";
import { CharacterAction, updateAction } from "@/_reducer/characterReducer";
import { Add } from "@mui/icons-material";
import { Button, Typography, Dialog, Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText, Tooltip, Chip } from "@mui/material";
import { Dispatch, useState } from "react";
import { AddFeatCard } from "./AddFeatCard";
import * as R from 'ramda';
import { FeatDisplay } from "@/app/character/_components/FeatDisplay";
interface FeatSelectorProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const FeatSelector = ({character, dispatch}: FeatSelectorProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = (event: any, reason: any) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };
    const handleSubmit = (feat: Feat) => {
        dispatch(
            updateAction(CharacterKeys.feats, [...character.feats, feat])
        );
    };
    const handleDelete = (feat: Feat) => {
        const filter = R.propEq(feat.name, 'name');
        dispatch(updateAction(CharacterKeys.feats, R.reject(filter, character.feats)))
    }
    return (
        <div
            style={{
                margin: '0 .5rem',
            }}
        >
            <Button variant='outlined' onClick={() => setOpen(true)}>
                <Typography>Add Feat</Typography>
                <Add />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <AddFeatCard onClose={handleClose} onSubmit={handleSubmit} />
            </Dialog>
            <Grid
                direction='column'
                display='flex'
                sx={{ marginTop: '.5rem'}}
                container
            >
                <FeatDisplay feats={character.feats} onDelete={handleDelete}/>
            </Grid>
        </div>
    );
}