import { CharacterClass, CharacterClassNames } from '@/_models';
import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import useClassAbilityService from '../api/_services/useClassAbilityService';
import { Dispatch, useMemo, useState } from 'react';
import {
    CharacterAction,
    updateClassAbilityAction,
} from '@/_reducer/characterReducer';
import * as R from 'ramda';

interface DomainAspectsTableProps {
    classInfo: CharacterClass;
    dispatch: Dispatch<CharacterAction>;
}

export const DomainAspectsTable = ({
    classInfo,
    dispatch,
}: DomainAspectsTableProps) => {
    const { classAbilities } = useClassAbilityService();
    const sortByDomain = useMemo(() => R.sortBy(R.prop('domain')), []);
    const domainAspects =
        classAbilities[CharacterClassNames.Cleric].domainAspects;
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    return (
        <>
            <Table stickyHeader size='small'>
                <TableHead>
                    <TableRow>
                        <TableCell>Selected</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Domain</TableCell>
                        <TableCell>Allegiance Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortByDomain(domainAspects)
                        .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                        )
                        .map((asp) => {
                            const isSelected = classInfo.classAbilities.some(
                                (x) =>
                                    x.domain === asp.domain &&
                                    x.level === asp.level
                            );
                            return (
                                <Tooltip
                                    followCursor
                                    title={asp.description}
                                    placement='right'
                                    key={`${asp.domain}${asp.level}`}
                                >
                                    <TableRow key={uuidv4()} hover>
                                        <TableCell>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() =>
                                                    dispatch(
                                                        updateClassAbilityAction(
                                                            CharacterClassNames.Cleric,
                                                            asp
                                                        )
                                                    )
                                                }
                                                name='Selected'
                                                sx={{ padding: 0 }}
                                            />
                                        </TableCell>
                                        <TableCell>{asp.level}</TableCell>
                                        <TableCell>{asp.domain}</TableCell>
                                        <TableCell>
                                            {asp.allegianceValue}
                                        </TableCell>
                                    </TableRow>
                                </Tooltip>
                            );
                        })}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={domainAspects.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};
