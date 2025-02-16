import {
    Card,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
} from '@mui/material';
import { Feat, FeatCategory } from '@/_models';
import { useEffect, useState } from 'react';
import * as R from 'ramda';
interface FeatTableProps {
    feats: Feat[];
    handleClick?: (feat: Feat) => void;
}
export const FeatTable = ({ feats, handleClick }: FeatTableProps) => {
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredRows, setFilteredRows] = useState<Feat[]>([]);
    const [columnFilter, setColumnFilter] = useState<FeatCategory | string>('');

    useEffect(() => {
        if (!!columnFilter) {
            setColumnFilter('');
        }
        if (!!searchValue) {
            const rows = feats.filter((x: Feat) =>
                x.name.toLowerCase().includes(searchValue.toLowerCase())
            );
            if (!!rows && !!rows.length) {
                setFilteredRows(rows);
            }
        } else {
            setFilteredRows(feats);
        }
    }, [searchValue]);

    useEffect(() => {
        if (!!searchValue) {
            setSearchValue('');
        }
        if (!!columnFilter) {
            const filter = (x: Feat) => x.category === columnFilter;
            const rows = R.filter(filter, feats);
            setFilteredRows(rows);
        } else {
            setFilteredRows(feats);
        }
    }, [columnFilter]);

    return (
        <Card sx={{ overflow: 'scroll' }}>
            <TextField
                onChange={(e) => setSearchValue(e.target.value)}
                value={searchValue}
                placeholder={'Search by Name'}
            />
            <TableContainer>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            {!handleClick && (
                                <TableCell>Selected Option</TableCell>
                            )}
                            <TableCell>Prerequisites</TableCell>
                            <TableCell>
                                <FormControl sx={{ width: '100%' }}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        variant='standard'
                                        label='Category'
                                        onChange={(e) =>
                                            setColumnFilter(e.target.value)
                                        }
                                        fullWidth
                                        value={columnFilter}
                                    >
                                        <MenuItem value={''}>Reset</MenuItem>
                                        {Object.keys(FeatCategory).map((x) => {
                                            return (
                                                <MenuItem key={x} value={x}>
                                                    {x}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(!!filteredRows.length ? filteredRows : feats).map(
                            (feat) => {
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
                                            <TableCell>
                                                {feat.category}
                                            </TableCell>
                                        </TableRow>
                                    </Tooltip>
                                );
                            }
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    );
};
