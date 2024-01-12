'use client';

import { Character } from '@/_models';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { AttributeDisplay } from './AttributeDisplay';
import { CharacterInfoDisplay } from './CharacterInfoDisplay';
import { CombatInfoDisplay } from './CombatInfoDisplay';
import { EquipmentDisplay } from './EquipmentDisplay';
import { SkillDisplay } from './SkillDisplay';
import { CharacterAction } from '@/_reducer/characterReducer';
import {
    Button,
    Grid,
    SwipeableDrawer,
    Typography,
    useTheme,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface CharacterDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    onEdit: Dispatch<SetStateAction<boolean>>;
}
export const CharacterDisplay = ({
    character,
    dispatch,
    onEdit,
}: CharacterDisplayProps) => {
    const [openSkillDrawer, setOpenSkillDrawer] = useState(false);
    const [openAttDrawer, setOpenAttDrawer] = useState(false);
    const theme = useTheme();

    return (
        !!character && (
            <div style={{ height: '100vh', marginRight: '2rem' }}>
                <Grid
                    container
                    display={'flex'}
                    flexDirection='row'
                    style={{
                        borderBottom: `1px solid grey`,
                        paddingBottom: '.5rem',
                        marginBottom: '1rem',
                        width: '99%',
                    }}
                >
                    <CharacterInfoDisplay
                        character={character}
                        dispatch={dispatch}
                        onEdit={onEdit}
                    />
                </Grid>
                <Grid
                    container
                    style={{
                        display: 'flex',
                        height: '65vh',
                        position: 'relative'
                    }}
                >
                    <Button
                        variant='outlined'
                        onClick={() => setOpenAttDrawer(true)}
                        color='primary'
                        sx={{
                            position: 'absolute',
                            transform: 'rotate(90deg)',
                            left: '-4rem',
                            top: '3rem',
                            borderRadius: '1rem 1rem 0 0',
                            padding: '0 .5rem 0 .5rem',
                            margin: 0,
                            textTransform: 'none',
                            alignContent: 'center',
                            [theme.breakpoints.up('xl')]: {
                                display: 'none',
                            },
                        }}
                    >
                        <Typography variant='body1' textTransform='none'>
                            Attributes
                        </Typography>
                        <ArrowDropUpIcon sx={{ margin: 0 }} />
                    </Button>
                    <SwipeableDrawer
                        PaperProps={{
                            sx: {
                                marginTop: '15%',
                                height: 'fit-content',
                            },
                        }}
                        keepMounted
                        anchor={'left'}
                        open={openAttDrawer}
                        onClose={() => setOpenAttDrawer(false)}
                        onOpen={() => setOpenAttDrawer(true)}
                    >
                        <AttributeDisplay character={character} />
                    </SwipeableDrawer>
                    <Button
                        variant='outlined'
                        onClick={() => setOpenSkillDrawer(true)}
                        color='primary'
                        sx={{
                            position: 'absolute',
                            transform: 'rotate(-90deg)',
                            right: '-3.5rem',
                            top: '2rem',
                            borderRadius: '1rem 1rem 0 0',
                            padding: '0 .5rem 0 .5rem',
                            margin: 0,
                            textTransform: 'none',
                            alignContent: 'center',
                            [theme.breakpoints.up('xl')]: {
                                display: 'none',
                            },
                        }}
                    >
                        <Typography variant='body1' textTransform='none'>
                            Skills
                        </Typography>
                        <ArrowDropUpIcon sx={{ margin: 0 }} />
                    </Button>
                    <SwipeableDrawer
                        PaperProps={{
                            sx: {
                                marginTop: '6%',
                                maxHeight: '92vh',
                            },
                        }}
                        keepMounted
                        anchor={'right'}
                        open={openSkillDrawer}
                        onClose={() => setOpenSkillDrawer(false)}
                        onOpen={() => setOpenSkillDrawer(true)}
                    >
                        <SkillDisplay character={character} />
                    </SwipeableDrawer>
                    <Grid
                        item
                        xl={'auto'}
                        sx={{
                            [theme.breakpoints.down('xl')]: {
                                display: 'none',
                            },
                        }}
                    >
                        <AttributeDisplay character={character} />
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        sx={{
                            [theme.breakpoints.up('md')]: {
                                display: 'none',
                            },
                        }}
                    >
                        <Grid container>
                            <CombatInfoDisplay
                                character={character}
                                dispatch={dispatch}
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} xl={5} sx={{ margin: '0 .5rem' }}>
                        <Grid container display={'flex'} flexDirection='row'>
                            <Grid
                                item
                                xs={12}
                                direction='row'
                                columns={2}
                                sx={{
                                    [theme.breakpoints.down('md')]: {
                                        display: 'none',
                                    },
                                }}
                            >
                                <Grid container>
                                    <CombatInfoDisplay
                                        character={character}
                                        dispatch={dispatch}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <EquipmentDisplay
                                    character={character}
                                    dispatch={dispatch}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        xl={2}
                        direction='row'
                        columns={2}
                        sx={{
                            [theme.breakpoints.down('xl')]: {
                                display: 'none',
                            },
                        }}
                    >
                        <SkillDisplay character={character} />
                    </Grid>
                </Grid>
            </div>
        )
    );
};
