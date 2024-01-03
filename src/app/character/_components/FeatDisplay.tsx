import { Feat } from '@/_models';
import { Card, Tooltip, Chip } from '@mui/material';

interface FeatDisplayProps {
    feats: Feat[],
    onDelete?: (feat: Feat) => void;
}
export const FeatDisplay = ({feats, onDelete}: FeatDisplayProps) => {
    return (
        feats.map((ft: Feat) => {
            return (
                <Card
                    sx={{ margin: '0 .25rem .5rem', padding: '0 .5rem', backgroundImage: 'none', backgroundColor: 'inherit' }}
                    key={ft.name}
                >
                    <Tooltip title={ft.definition}>
                        <Chip
                        /* @ts-ignore */
                        label={ft.name}
                        variant='outlined'
                        onDelete={() => !!onDelete && onDelete(ft)}
                    />
                    </Tooltip>
                </Card>
            );
        })
    );
};
