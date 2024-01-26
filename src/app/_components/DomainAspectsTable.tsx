import { CharacterClass, CharacterClassNames } from '@/_models';
import {
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import useClassAbilityService from '../api/_services/useClassAbilityService';
import { Dispatch, useMemo } from 'react';
import { CharacterAction } from '@/_reducer/characterReducer';
import * as R from 'ramda';

interface DomainAspectsTableProps {
    classInfo: CharacterClass;
    dispatch: Dispatch<CharacterAction>;
}

export const DomainAspectsTable = ({ classInfo, dispatch }: DomainAspectsTableProps) => {
    const { classAbilities } = useClassAbilityService();
    const sortByDomain = useMemo(() => R.sortBy(R.prop('domain')), []);
    return (
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
                {sortByDomain(classAbilities[CharacterClassNames.Cleric].domainAspects).map(
                    (asp) => {
                        const isSelected = classInfo.classAbilities.some(x => x.domain === asp.domain && x.level === asp.level);
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
                                            onChange={() => {}}
                                            name='Selected'
                                            sx={{padding: 0}}
                                        />
                                    </TableCell>
                                    <TableCell>{asp.level}</TableCell>
                                    <TableCell>{asp.domain}</TableCell>
                                    <TableCell>{asp.allegianceValue}</TableCell>
                                </TableRow>
                            </Tooltip>
                        );
                    }
                )}
            </TableBody>
        </Table>
    );
};
