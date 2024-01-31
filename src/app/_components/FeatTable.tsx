import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import { Feat } from '@/_models';
import { useEffect, useState } from 'react';

interface FeatTableProps {
    feats: Feat[];
    handleClick?: (feat: Feat) => void;
}
export const FeatTable = ({ feats, handleClick }: FeatTableProps) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredRows, setFilteredRows] = useState<Feat[]>([]);

    useEffect(() => {
        const filteredRows = feats.filter((x: Feat) =>
            x.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        if (!!filteredRows && !!filteredRows.length) {
            setFilteredRows(filteredRows);
        }
    }, [searchValue]);

    return (
        <Card>
            <TextField
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                placeholder={'Search by Name'}
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            {!handleClick && (
                                <TableCell>Selected Option</TableCell>
                            )}
                            <TableCell>Prerequisites</TableCell>
                            <TableCell>Category</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(!!filteredRows.length ? filteredRows : feats).map((feat) => {
                            return (
                                <Tooltip
                                    title={feat.definition}
                                    key={feat.name}
                                >
                                    <TableRow
                                        hover={!!handleClick}
                                        onClick={
                                            !!handleClick
                                                ? () => handleClick(feat)
                                                : undefined
                                        }
                                    >
                                        <TableCell>{feat.name}</TableCell>
                                        {!handleClick && (
                                            <TableCell>
                                                {!!feat.selectedOption
                                                    ? feat.selectedOption
                                                    : ''}
                                            </TableCell>
                                        )}
                                        <TableCell>
                                            {!!feat.prerequisites
                                                ? feat.prerequisites
                                                : ''}
                                        </TableCell>
                                        <TableCell>{feat.category}</TableCell>
                                    </TableRow>
                                </Tooltip>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};
