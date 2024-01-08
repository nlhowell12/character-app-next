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
import { Fab, Grid, SwipeableDrawer, useMediaQuery, useTheme } from '@mui/material';

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
    const xsBreak = useMediaQuery(theme.breakpoints.up('xs'));
    const smBreak = useMediaQuery(theme.breakpoints.up('sm'));

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
						<Fab variant="extended" 
						onClick={() => setOpenSkillDrawer(true)}
						sx={{
							position: 'absolute',
							transform: 'rotate(-90deg)',
							right: 0,
							marginTop: '1rem'
						}}>
							Skills
						</Fab>
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
