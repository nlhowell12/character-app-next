import { Character, CharacterKeys, Feat } from '@/_models';
import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
import { Add } from '@mui/icons-material';
import {
    Button,
    Typography,
    Dialog,
    Grid,
} from '@mui/material';
import { Dispatch, useState } from 'react';
import * as R from 'ramda';
import { FeatDisplay } from '@/app/character/_components/FeatDisplay';
import useFeatsService from '@/app/api/_services/useFeatsService';
import { FeatTable } from '@/app/_components/FeatTable';
interface FeatSelectorProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const FeatSelector = ({ character, dispatch }: FeatSelectorProps) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleClose = (event: any, reason: any) => {
            setOpen(false);
    };
    const handleAdd = (feat: Feat) => {
        dispatch(updateAction(CharacterKeys.feats, [...character.feats, feat]));
    };
    const handleDelete = (feat: Feat) => {
        const filter = R.propEq(feat.name, 'name');
        dispatch(
            updateAction(CharacterKeys.feats, R.reject(filter, character.feats))
        );
    };
    const { feats } = useFeatsService();

    const handleRowClick = (feat: Feat) => {
        if(character.feats.some(x => x.name === feat.name)){
            handleDelete(feat)
        } else {
            handleAdd(feat)
        }
    }
    return (
        <div
            style={{
                margin: '0 .5rem',
            }}
        >
            <Button variant='outlined' onClick={() => setOpen(true)}>
                <Typography>Add Feat</Typography>
                <Add />
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth={false}>
                <FeatTable feats={feats} handleClick={handleRowClick}/>
            </Dialog>
            {!!character.feats.length && (
                <Grid
                    direction='column'
                    display='flex'
                    sx={{ marginTop: '.5rem' }}
                    container
                >
                    <FeatDisplay
                        feats={character.feats}
                        onDelete={handleDelete}
                    />
                </Grid>
            )}
        </div>
    );
};
