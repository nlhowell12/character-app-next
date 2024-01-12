import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
import {
    Card,
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
    return (
        <ListItem
            secondaryAction={
                <IconButton onClick={handleClick}>
                    {hasStatusEffect ? (
                        <HighlightOffIcon color='error' />
                    ) : (
                        <AddCircleOutlineIcon />
                    )}
                </IconButton>
            }
        >
            <ListItemText primary={effect} />
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
    return (
        <Dialog open={open} onClose={onClose}>
            <Card>
                <List
                    dense
                    subheader={
                        <ListSubheader component='div' id='nested-list-subheader'>
                            Status Effects
                        </ListSubheader>
                    }
                >
                    {Object.keys(StatusEffects).map((eff) => {
                        return (
                            <StatusEffectRow
                                character={character}
                                effect={eff}
                                dispatch={dispatch}
                            />
                        );
                    })}
                </List>
            </Card>
        </Dialog>
       
    );
};
