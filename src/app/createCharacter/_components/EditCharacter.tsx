'use client'

import { Character, CharacterKeys } from "@/_models";
import { CharacterAction, updateAction } from "@/_reducer/characterReducer";
import UserContext from "@/app/_auth/UserContext";
import { Button, Grid, SwipeableDrawer, Typography, useTheme } from "@mui/material";
import { useContext, useEffect, Dispatch, useState } from "react";
import { AttributeDisplay } from "./AttributeDisplay";
import { CharacterInfoDisplay } from "./CharacterInfoDisplay";
import { ClassSelector } from "./ClassSelector";
import { FeatSelector } from "./FeatSelector";
import { SkillDisplay } from "./SkillDisplay";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

interface EditCharacterDisplayProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    onUpdate?:  () => void;
};

export const EditCharacter = ({character, dispatch, onUpdate}: EditCharacterDisplayProps) => {
    const { user } = useContext(UserContext);
	const [openSkillDrawer, setOpenSkillDrawer] = useState(false);

    useEffect(() => {
        if(!!user && !onUpdate){
            dispatch(updateAction(CharacterKeys.playerName, user?.name))
        }
    }, [user])
    
    const theme = useTheme();

    return (
		<div style={{height: '100vh'}}>
			<div style={{
                borderBottom: `1px solid grey`,
                paddingBottom: '.5rem',
                marginBottom: '1rem',
                width: '99%',
            }}>
                <CharacterInfoDisplay
                    character={character}
                    dispatch={dispatch}
                    onUpdate={onUpdate}
                />
            </div>
            <Grid container
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
                        	<SkillDisplay character={character} dispatch={dispatch}/>
						</SwipeableDrawer>
                <Grid item xs={'auto'}>
                    <AttributeDisplay character={character} dispatch={dispatch} />
                </Grid>
                <Grid item xs={12} md={4}display='flex'>
                    <ClassSelector character={character} dispatch={dispatch} />
                    <FeatSelector character={character} dispatch={dispatch} />
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
                    }}>
                    <SkillDisplay character={character} dispatch={dispatch}/>
                </Grid>
            </Grid>
        </div>
    );
};
