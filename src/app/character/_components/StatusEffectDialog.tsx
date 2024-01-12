import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
import {
    Card,
    CardContent,
    CardHeader,
    Dialog,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
} from '@mui/material';
import { Dispatch } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Character, CharacterKeys, StatusEffects } from '@/_models';
import * as R from 'ramda';

interface StatusEffectRowProps {
    effect: string;
    dispatch: Dispatch<CharacterAction>;
    character: Character;
}

const StatusEffectRow = ({
    character,
    effect,
    dispatch,
}: StatusEffectRowProps) => {
    const hasStatusEffect = R.includes(effect, character.statusEffects);
    const handleClick = () => {
        if (hasStatusEffect) {
            const filter = (x: string) => x !== effect;
            dispatch(
                updateAction(
                    CharacterKeys.statusEffects,
                    R.filter(filter, character.statusEffects)
                )
            );
        } else {
            dispatch(
                updateAction(
                    CharacterKeys.statusEffects,
                    R.append(effect, character.statusEffects)
                )
            );
        }
    };
    const textStyle = {marginRight: '.5rem'}
    return (
        <ListItem
            secondaryAction={
                <IconButton onClick={handleClick}>
                    {hasStatusEffect ? (
                        <HighlightOffIcon color='error'/>
                    ) : (
                        <AddCircleOutlineIcon/>
                    )}
                </IconButton>
            }
        >
            <ListItemText primary={effect} sx={textStyle}/>
        </ListItem>
    );
};

interface StatusEffectDialogProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
    open: boolean;
    onClose: () => void;
}
export const StatusEffectDialog = ({
    dispatch,
    character,
    open,
    onClose
}: StatusEffectDialogProps) => {
    const statusEffects = Object.keys(StatusEffects);
    return (
        <Dialog open={open} onClose={onClose}>
            <Card sx={{overflow: 'scroll'}}>
                <CardHeader subheader='Status Effects'/>
                <CardContent  sx={{display: 'flex', flexDirection: 'row'}}>
                    <List
                        dense
                    >
                        {statusEffects.slice(0, statusEffects.length/2).map((eff) => {
                            return (
                                <StatusEffectRow
                                    key={eff}
                                    character={character}
                                    effect={StatusEffects[eff]}
                                    dispatch={dispatch}
                                />
                            );
                        })}
                    </List>
                    <List
                        dense
                    >
                        {statusEffects.slice(-(statusEffects.length/2)).map((eff) => {
                            return (
                                <StatusEffectRow
                                    key={eff}
                                    character={character}
                                    effect={StatusEffects[eff]}
                                    dispatch={dispatch}
                                />
                            );
                        })}
                    </List>
                </CardContent>
            </Card>
        </Dialog>
       
    );
};
