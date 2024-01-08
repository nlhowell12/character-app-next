'use client';

import { Character } from '@/_models';
import { useParams } from 'next/navigation';
import React, { useEffect, useReducer, useState } from 'react';
import { AttributeDisplay } from '../_components/AttributeDisplay';
import { CharacterInfoDisplay } from '../_components/CharacterInfoDisplay';
import { CombatInfoDisplay } from '../_components/CombatInfoDisplay';
import { EquipmentDisplay } from '../_components/EquipmentDisplay';
import { SkillDisplay } from '../_components/SkillDisplay';
import {
    characterReducer,
    initialCharacterState,
    setCharacterAction,
} from '@/_reducer/characterReducer';
import useCharacterService from '@/app/api/_services/useCharacterService';
import { Button, Fab, Grid, SwipeableDrawer, Typography, useMediaQuery, useTheme } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

export default function CharacterPage() {
    const params = useParams<{ character: string }>();

    const { characters } = useCharacterService();

    const pageCharacter = characters?.find(
        (character: Character) => character.name === params.character
    );
    const [character, dispatch] = useReducer(
        characterReducer,
        initialCharacterState
    );

	const [openSkillDrawer, setOpenSkillDrawer] = useState(false);
    useEffect(() => {
        if (!!pageCharacter) {
            dispatch(setCharacterAction(pageCharacter));
            document.title = pageCharacter.name;
        }
    }, [pageCharacter]);

    const theme = useTheme();

    return (
        !!character && (
            <div style={{ height: '100vh' }}>
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
                    />
                </Grid>
                <Grid
                    container
                    style={{
                        display: 'flex',
                        height: '65vh',
                    }}
                >
						<Button  variant='outlined' 
							onClick={() => setOpenSkillDrawer(true)}
							color='primary'
							sx={{
							position: 'absolute',
							transform: 'rotate(-90deg)',
							right: '-1rem',
							top: '31rem',
							borderRadius: '1rem 1rem 0 0',
							padding: '0 .5rem 0 .5rem',
							margin: 0,
							textTransform: 'none',
							alignContent: 'center',
							[theme.breakpoints.up('xl')]: {
								display: 'none',
							},
						}}>
							<Typography variant='body1' textTransform='none'>Skills</Typography>
							<ArrowDropUpIcon sx={{margin: 0}}/>
						</Button>
						<SwipeableDrawer
							keepMounted
							anchor={'right'}
							open={openSkillDrawer}
							onClose={() => setOpenSkillDrawer(false)}
							onOpen={() => setOpenSkillDrawer(true)}
							>
                        	<SkillDisplay character={character} />
						</SwipeableDrawer>
                    <Grid item xs={12} lg={'auto'} sx={{position: 'relative'}}>
                        <Grid container>
                            <Grid item xs={'auto'}>
                                <AttributeDisplay character={character} />
                            </Grid>
                            <Grid
                                item
                                xs={12}
                                lg={6}
                                sx={{
                                    [theme.breakpoints.up('lg')]: {
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12} lg={7} sx={{ margin: '0 .5rem' }}>
                        <Grid container display={'flex'} flexDirection='row'>
                            <Grid
                                item
                                xs={12}
                                direction='row'
                                columns={2}
                                sx={{
                                    [theme.breakpoints.down('lg')]: {
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
}
