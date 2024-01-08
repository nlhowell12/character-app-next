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
import * as R from 'ramda';

interface ClassSelectorProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const ClassSelector = ({ character, dispatch }: ClassSelectorProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
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
    const handleEditSubmit = (cls:CharacterClass) => {
        const updateIndex = R.findIndex(R.propEq(cls.name, 'name'))(character.classes)
        dispatch(updateAction(CharacterKeys.classes, R.update(updateIndex, cls, character.classes)))
        setEdit(false)
    };
    const handleEdit = () => {
        setEdit(true);
        setOpen(true)
    }
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
                <AddClassCard onClose={handleClose} onSubmit={edit ? handleEditSubmit : handleSubmit} />
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
                            sx={{
                                margin: '0 .25rem .5rem',
                                width: '20rem',
                                '&:hover': { opacity: '.6', cursor: 'pointer' },
                            }}
                            key={cls.name}
                            onClick={handleEdit}
                        >
                            <CardHeader title={cls.name} />
                            <CardContent>
                                <Typography>Level: {cls.level}</Typography>
                                <Typography>{`Saves: ${cls.primarySave}, ${cls.secondarySave}`}</Typography>
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
