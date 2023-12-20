import { Add } from '@mui/icons-material';
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Dialog,
    Grid,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { Dispatch, useState } from 'react';
import {
    CharacterAction,
    updateAction,
} from '../../../_reducer/characterReducer';
import { AddClassCard } from './AddClassCard';
import {
    Character,
    CharacterClass,
    CharacterKeys,
    SkillTypes,
} from '@/_models';

interface ClassSelectorProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const ClassSelector = ({ character, dispatch }: ClassSelectorProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = (event: any, reason: any) => {
        if (reason !== 'backdropClick') {
            setOpen(false);
        }
    };
    const handleSubmit = (cls: CharacterClass) => {
        dispatch(
            updateAction(CharacterKeys.classes, [...character.classes, cls])
        );
    };
    return (
        <div
            style={{
                margin: '0 .5rem',
            }}
        >
            <Button variant='outlined' onClick={() => setOpen(true)}>
                <Typography>Add Class</Typography>
                <Add />
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <AddClassCard onClose={handleClose} onSubmit={handleSubmit} />
            </Dialog>
            <Grid
                direction='row'
                display='flex'
                sx={{ marginTop: '.5rem' }}
                container
            >
                {character.classes.map((cls) => {
                    return (
                        <Card
                            sx={{ margin: '0 .25rem', width: '20rem' }}
                            key={cls.name}
                        >
                            <CardHeader title={cls.name} />
                            <CardContent>
                                <Typography>Level: {cls.level}</Typography>
                                <List subheader={'Class Skills:'}>
                                    {cls.classSkills.map((skill) => {
                                        return (
                                            <ListItem key={skill}>
                                                <ListItemText
                                                    /* @ts-ignore */
                                                    primary={SkillTypes[skill]}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                                {!!cls.classAbilities.length && (
                                    <List subheader={'Class Abilities:'}>
                                        {cls.classAbilities.map((abl) => {
                                            return (
                                                <ListItem key={abl.name}>
                                                    <ListItemText
                                                        primary={`Level ${abl.level}`}
                                                    />
                                                    <ListItemText
                                                        primary={abl.name}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </Grid>
        </div>
    );
};
