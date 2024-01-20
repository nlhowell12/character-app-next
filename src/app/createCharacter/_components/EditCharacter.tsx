'use client';

import { Character, CharacterKeys } from '@/_models';
import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
import UserContext from '@/app/_auth/UserContext';
import {
    Button,
    Grid,
    SwipeableDrawer,
    Typography,
    useTheme,
} from '@mui/material';
import { useContext, useEffect, Dispatch, useState } from 'react';
import { AttributeDisplay } from './AttributeDisplay';
import { CharacterInfoDisplay } from './CharacterInfoDisplay';
import { ClassSelector } from './ClassSelector';
import { FeatSelector } from './FeatSelector';
import { SkillDisplay } from './SkillDisplay';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface EditCharacterDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    onUpdate?: () => void;
}

export const EditCharacter = ({
    character,
    dispatch,
    onUpdate,
}: EditCharacterDisplayProps) => {
    const { user } = useContext(UserContext);
    const [openSkillDrawer, setOpenSkillDrawer] = useState(false);
    const [openAttDrawer, setOpenAttDrawer] = useState(false);

    useEffect(() => {
        if (!!user && !onUpdate) {
            dispatch(updateAction(CharacterKeys.playerName, user?.name));
        }
    }, [user]);

    const theme = useTheme();

    return (
        <div style={{ height: '100vh', marginRight: '2rem'  }}>
            <div
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
                    onUpdate={onUpdate}
                />
            </div>
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
                    <AttributeDisplay character={character} dispatch={dispatch} />
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
                    <SkillDisplay character={character} dispatch={dispatch} />
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
                    <AttributeDisplay
                        character={character}
                        dispatch={dispatch}
                    />
                </Grid>
                <Grid item xs={12} md={4} display='flex'>
                    <ClassSelector character={character} dispatch={dispatch} />
                    <FeatSelector character={character} dispatch={dispatch} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    xl={2}
                    columns={2}
                    sx={{
                        [theme.breakpoints.down('xl')]: {
                            display: 'none',
                        },
                    }}
                >
                    <SkillDisplay character={character} dispatch={dispatch} />
                </Grid>
            </Grid>
        </div>
    );
};
