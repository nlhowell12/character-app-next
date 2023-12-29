import { Character, CharacterClass, CharacterKeys, Feat } from "@/_models";
import { CharacterAction, updateAction } from "@/_reducer/characterReducer";
import { Add } from "@mui/icons-material";
import { Button, Typography, Dialog, Grid, Card, CardHeader, CardContent, List, ListItem, ListItemText, Tooltip } from "@mui/material";
import { Dispatch, useState } from "react";
import { AddFeatCard } from "./AddFeatCard";

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
                sx={{ marginTop: '.5rem' }}
                container
            >
                {character.feats.map((ft: Feat) => {
                    return (
                        <Card
                            sx={{ margin: '0 .25rem .5rem', padding: '0 .5rem' }}
                            key={ft.name}
                        >
                            <Tooltip title={ft.definition}>
                                <Typography variant="h6">{ft.name}</Typography>
                            </Tooltip>
                        </Card>
                    );
                })}
            </Grid>
        </div>
    );
}