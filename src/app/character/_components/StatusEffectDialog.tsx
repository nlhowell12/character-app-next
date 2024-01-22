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
} from '@mui/material';
import { Dispatch } from 'react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Character, CharacterKeys, StatusEffects } from '@/_models';
import * as R from 'ramda';
import { getTotalEnergyDrained } from '@/_utils/statusEffectUtils';

interface StatusEffectRowProps {
    effect: StatusEffects;
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
    const handleEnergyDrainClick = (increase: boolean) => {
        if(increase){
            dispatch(
                updateAction(
                    CharacterKeys.statusEffects,
                    R.append(effect, character.statusEffects)
                )
            );
        } else {
            const removeIndex = R.findIndex(x => x === StatusEffects.EnergyDrained)(character.statusEffects);
            dispatch(
                updateAction(
                    CharacterKeys.statusEffects,
                    R.remove(removeIndex, 1, character.statusEffects)
                )
            );
        }
    };

    const textStyle = {marginRight: '.5rem'}
    return (
        (effect as StatusEffects) !== StatusEffects.EnergyDrained ? 
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
        </ListItem> : 
        <ListItem
            secondaryAction={
                <>
                {hasStatusEffect && 
                <IconButton onClick={() => handleEnergyDrainClick(false)}>
                    <RemoveCircleOutlineIcon/>
                </IconButton>}
                <IconButton onClick={() => handleEnergyDrainClick(true)}>
                    <AddCircleOutlineIcon/>
                </IconButton>
                </>
            }
    >
        <ListItemText primary={`${effect}${hasStatusEffect ? ` (${getTotalEnergyDrained(character)})` : ''}`} sx={textStyle}/>
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
            <Card sx={{overflow: 'scroll', width: '32rem'}}>
                <CardHeader subheader='Status Effects'/>
                <CardContent  sx={{display: 'flex', flexDirection: 'row'}}>
                    <List
                        dense
                        sx={{width: '50%'}}
                    >
                        {statusEffects.slice(0, statusEffects.length/2).map((eff) => {
                            return (
                                <StatusEffectRow
                                    key={eff}
                                    character={character}
                                    /* @ts-ignore */
                                    effect={StatusEffects[eff]}
                                    dispatch={dispatch}
                                />
                            );
                        })}
                    </List>
                    <List
                        dense
                        sx={{width: '50%'}}
                    >
                        {statusEffects.slice(-(statusEffects.length/2)).map((eff) => {
                            return (
                                <StatusEffectRow
                                    key={eff}
                                    character={character}
                                    /* @ts-ignore */
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
