import { Character, CharacterClass, CharacterClassNames, DivineDomain } from '@/_models';
import {
    Card,
    Checkbox,
    Grid,
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
    togglePreferredDomainAction,
    updateClassAbilityAction,
} from '@/_reducer/characterReducer';
import * as R from 'ramda';
import { getAllegianceTotal, getClassAbilities, sortDomainAspects } from '@/_utils/classUtils';
import { CheckCircle } from '@mui/icons-material';

interface DomainAspectsTableProps {
    character: Character;
    dispatch: Dispatch<CharacterAction>;
}

export const DomainAspectsTable = ({
    character,
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

    const allegianceTotals = useMemo(() => getAllegianceTotal(character), [character]);
    const sortedDomains = useMemo(() => sortDomainAspects(character), [character]);
    const clericClassAbilities = getClassAbilities(character.classes)[CharacterClassNames.Cleric];
    return (
        !!clericClassAbilities && 
        <Grid container direction='row'>
        <Grid item xs={10}>
            <Card>
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
                            const isSelected = clericClassAbilities.some(
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
            </Card>
        </Grid>
        <Grid item xs={2}>
            <Card sx={{height: '100%'}} variant='outlined'>
                <Table size='small'>
                <TableBody>
                {sortedDomains.map(dom => {
                        const preferredDomain = character.classes.filter(x => x.name === CharacterClassNames.Cleric)[0].preferredDomains?.includes(dom);
                        /* @ts-ignore */
                        return dom !== DivineDomain.Cosmic && <TableRow key={dom} hover onClick={() => dispatch(togglePreferredDomainAction(dom))}><TableCell>{!!preferredDomain ? <Tooltip title='Preferred Domain'><CheckCircle color='primary' sx={{width: '1rem'}}/></Tooltip> : ''}</TableCell><TableCell>{DivineDomain[dom]}</TableCell><TableCell>{allegianceTotals[dom]}</TableCell></TableRow>
                    })}
                </TableBody> 
                </Table>
            </Card>            
        </Grid>
        </Grid>
    );
};
