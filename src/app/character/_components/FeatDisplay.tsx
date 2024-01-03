import { Feat } from '@/_models';
import { Card, Tooltip, Chip } from '@mui/material';

interface FeatDisplayProps {
    feats: Feat[],
    onDelete?: (feat: Feat) => void;
}
export const FeatDisplay = ({feats, onDelete}: FeatDisplayProps) => {
    return (
        <Card sx={{padding: '.5rem', borderRadius: '.5rem'}}>
        {feats.map((ft: Feat) => {
            return (
                    <Tooltip title={ft.definition} key={ft.name}>
                        <Chip
                        sx={{margin: '.25rem'}}
                        /* @ts-ignore */
                        label={ft.name}
                        variant='outlined'
                        onDelete={!!onDelete ? () => onDelete(ft) : undefined}
                    />
                    </Tooltip>
            );
        })}
        </Card>
    );
};
