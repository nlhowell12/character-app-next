import { Character, CharacterKeys, Feat } from '@/_models';
import { CharacterAction, updateAction } from '@/_reducer/characterReducer';
import { Add } from '@mui/icons-material';
import {
    Button,
    Typography,
    Dialog,
    Grid,
    CardHeader,
    Card,
    CardContent,
    TextField,
    CardActions,
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
    const [openRequiredOption, setOpenRequiredOption] = useState<boolean>(false);
    const [selectedFeat, setSelectedFeat] = useState<Feat>();
    
    const handleClose = (event: any, reason: any) => {
            setOpen(false);
    };
    const handleCloseRequiredOption = () => {
        setOpenRequiredOption(false);
        setSelectedFeat(undefined);
    }
    const handleAdd = (feat: Feat) => {
        if(feat.requiredOption && !feat.selectedOption){
            setSelectedFeat(feat)
            setOpenRequiredOption(true)
        } else {
            if(openRequiredOption){
                setOpenRequiredOption(false)
            }
            dispatch(updateAction(CharacterKeys.feats, [...character.feats, feat]));
        }
    };
    const handleDelete = (feat: Feat) => {
        const filter = (x: Feat) => feat.name === x.name && feat.selectedOption === x.selectedOption;
        if(feat.stackable && !feat.requiredOption){
            const index = R.findIndex(R.propEq(feat.name, 'name'))(character.feats);
            !!index && dispatch(
                updateAction(CharacterKeys.feats, R.remove(index, 1, character.feats))
            );
        } else {
            dispatch(
                updateAction(CharacterKeys.feats, R.reject(filter, character.feats))
            );
        }
    };
    const { feats } = useFeatsService();

    const handleRowClick = (feat: Feat) => {
        if(character.feats.some(x => x.name === feat.name)){
            if(feat.stackable){
                handleAdd(feat);
            } else {
                handleDelete(feat);
            }
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
            <Dialog open={openRequiredOption} onClose={handleCloseRequiredOption}>
                <Card>
                    <CardHeader>Add Required Selections for thie Feat</CardHeader>
                    {!!selectedFeat &&
                    <>
                    <CardContent>
                        <TextField label='Required Feat Option' value={selectedFeat?.selectedOption} onChange={(e) => setSelectedFeat({...selectedFeat, selectedOption: e.target.value})}/>
                    </CardContent>
                    <CardActions>
                        <Button disabled={!selectedFeat || !selectedFeat.selectedOption} onClick={() => handleAdd(selectedFeat)}>Set Option</Button>
                    </CardActions>
                    </>
                    }
                </Card>
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
