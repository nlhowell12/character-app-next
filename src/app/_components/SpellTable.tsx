import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
    Checkbox,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    CharacterClassNames,
    AnyMagickType,
    SpellObject,
    MagickCategory,
    Character,
    Magick,
} from '@/_models';
import { camelToTitle } from '@/_utils/stringUtils';
import * as R from 'ramda';

interface SpellTableTooltipProps {
    description: string;
}
const SpellTooltip = ({ description }: SpellTableTooltipProps) => {
    return <Typography>{description}</Typography>;
};
export interface SpellTableProps {
    spells: SpellObject;
    characterSpellbook?: boolean;
    character: Character;
    onChange?: (spell: AnyMagickType, className: CharacterClassNames) => void;
    personal?: boolean;
}
export const SpellTable = ({
    spells,
    characterSpellbook,
    onChange,
    character,
    personal,
}: SpellTableProps) => {
    const [selectedClass, setSelectedClass] = useState<keyof SpellObject>(
        !!spells ? Object.keys(spells)[0] as keyof SpellObject : CharacterClassNames.Cleric
    );
    const [selectedSubtype, setSelectedSubtype] = useState<MagickCategory>(
        MagickCategory.Maneuver
    );
    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<AnyMagickType[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredRows, setFilteredRows] = useState<AnyMagickType[]>([]);
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    let initialLoad = useRef<boolean>(true);

    const hybridClasses: CharacterClassNames[] = [
        CharacterClassNames.Hexblade,
        CharacterClassNames.Oathsworn,
        CharacterClassNames.PsychicWarrior,
    ];
    const isHybridClass = hybridClasses.includes(selectedClass);

    const filterData = (col: string) => {
        const filteredColumns: string[] = [
            '_id',
            'category',
            'class',
            'description',
            'bonusType',
            'damageType',
        ];
        if (selectedSubtype !== MagickCategory.Maneuver) {
            filteredColumns.push('maneuverType');
        }
        return !filteredColumns.includes(col);
    };
    const filterBySubtype = (spells: AnyMagickType[]) => {
        const filter = (x: AnyMagickType) => {
            if (isHybridClass) {
                return x.category === selectedSubtype;
            }
            return true;
        };
        return R.filter(filter, spells);
    };

    const filterClass = selectedClass as keyof SpellObject;

    useEffect(() => {
        setSelectedSubtype(MagickCategory.Maneuver);
        if (!!spells) {
            let filteredSpells: AnyMagickType[] = [];
            if (!!characterSpellbook && !!initialLoad) {
                const includedClass = Object.keys(
                    spells
                )[0] as keyof SpellObject;
                setSelectedClass(includedClass);
                filteredSpells = !!spells[includedClass].length
                    ? filterBySubtype(spells[includedClass])
                    : [];
                initialLoad.current = false;
            } else {
                filteredSpells = !!spells[selectedClass].length
                    ? filterBySubtype(spells[selectedClass])
                    : [];
            }
            const columns = !!filteredSpells.length
                ? Object.keys(filteredSpells[0]).filter((x) => filterData(x))
                : [];
            setRows(filteredSpells);
            setColumns(columns);
        }
    }, [spells, selectedClass]);

    useEffect(() => {
        if (!!rows && isHybridClass && !!spells) {
            const filteredSpells: AnyMagickType[] = filterBySubtype(
                spells[filterClass]
            );
            const columns = Object.keys(filteredSpells[0]).filter((x) =>
                filterData(x)
            );
            setColumns(columns);
            setRows(filteredSpells);
        }
    }, [selectedSubtype]);

    useEffect(() => {
        const filteredRows = rows.filter((x: AnyMagickType) =>
            x.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        if (!!filteredRows && !!filteredRows.length) {
            setFilteredRows(filteredRows);
        }
    }, [searchValue, rows]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleClassChange = (event: SelectChangeEvent) => {
        setSelectedSubtype(MagickCategory.Maneuver);
        setSelectedClass(event.target.value as keyof SpellObject);
    };

    const handleSubtypeChange = (event: SelectChangeEvent) => {
        setSelectedSubtype(event.target.value as MagickCategory);
    };

    const handleSearchChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setSearchValue(event.target.value as string);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const spellcastingSearchOptions = !!spells
        ? R.filter(
              (x) => Object.keys(spells).includes(x),
              [
                  CharacterClassNames.Cleric,
                  CharacterClassNames.Fighter,
                  CharacterClassNames.Hexblade,
                  CharacterClassNames.Oathsworn,
                  CharacterClassNames.Psion,
                  CharacterClassNames.PsychicWarrior,
                  CharacterClassNames.Shadowcaster,
                  CharacterClassNames.SorcWiz,
              ]
          )
        : [];

    const spellTypeOptions = [
        MagickCategory.Maneuver,
        ...(selectedClass === CharacterClassNames.Hexblade
            ? [MagickCategory.Arcane]
            : []),
        ...(selectedClass === CharacterClassNames.Oathsworn
            ? [MagickCategory.Divine]
            : []),
        ...(selectedClass === CharacterClassNames.PsychicWarrior
            ? [MagickCategory.Psionic]
            : []),
    ];

    const isKnown = (spell: AnyMagickType) => R.any(R.propEq(spell.name, 'name'), character.spellBook[selectedClass])
    const rowSpell = (spell: AnyMagickType): Magick => R.find(R.propEq(spell.name, 'name'))(character.spellBook[selectedClass]) as Magick;

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Select
                onChange={handleClassChange}
                value={selectedClass}
                sx={{ marginRight: '1rem' }}
            >
                {spellcastingSearchOptions.map((x) => {
                    return (
                        <MenuItem value={x} key={x}>
                            {x}
                        </MenuItem>
                    );
                })}
            </Select>
            {hybridClasses.includes(selectedClass) ? (
                <Select
                    onChange={handleSubtypeChange}
                    value={selectedSubtype}
                    sx={{ marginRight: '1rem' }}
                >
                    {spellTypeOptions.map((x) => {
                        return (
                            <MenuItem value={x} key={x}>
                                {x}
                            </MenuItem>
                        );
                    })}
                </Select>
            ) : null}
            <TextField
                onChange={handleSearchChange}
                value={searchValue}
                placeholder={'Search by Name'}
            />
            {!!rows.length ? (
                <>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label='sticky table'>
                            <TableHead>
                                <TableRow>
                                    {!!characterSpellbook ? (
                                        <>
                                            {!personal ? (
                                                <TableCell>Known</TableCell>
                                            ) : (
                                                <TableCell>Prepared</TableCell>
                                            )}
                                        </>
                                    ) : null}
                                    {columns.map((column) => (
                                        <TableCell key={column} align='left'>
                                            {camelToTitle(column)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(!!filteredRows.length ? filteredRows : rows)
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row) => {
                                        return (
                                            <Tooltip
                                                followCursor
                                                title={
                                                    <SpellTooltip
                                                        description={
                                                            row.description
                                                        }
                                                    />
                                                }
                                                placement='right'
                                                key={row.name}
                                            >
                                                <TableRow hover key={row.name}>
                                                    {!!characterSpellbook ? (
                                                        <>
                                                            {!personal ? (
                                                                <TableCell>
                                                                    <Checkbox
                                                                        checked={
                                                                            isKnown(row)
                                                                        }
                                                                        onChange={() => !!onChange && onChange(row, selectedClass)}
                                                                        name='Known'
                                                                    />
                                                                </TableCell>
                                                            ) : (
                                                                <TableCell>
                                                                    <Checkbox
                                                                        checked={
                                                                            rowSpell(row).prepared
                                                                        }
                                                                        onChange={() => !!onChange && onChange(row, selectedClass)}
                                                                        name='Prepared'
                                                                    />
                                                                </TableCell>
                                                            )}
                                                        </>
                                                    ) : null}
                                                    {Object.entries(row)
                                                        .filter(([key, _]) =>
                                                            filterData(key)
                                                        )
                                                        .map(([_, val]) => {
                                                            return (
                                                                <TableCell
                                                                    key={
                                                                        _ + val
                                                                    }
                                                                >
                                                                    <Typography>
                                                                        {val}
                                                                    </Typography>
                                                                </TableCell>
                                                            );
                                                        })}
                                                </TableRow>
                                            </Tooltip>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component='div'
                        count={
                            !!filteredRows.length
                                ? filteredRows.length
                                : rows.length
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        height: '10rem',
                        width: '100%',
                        textAlign: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}
                >
                    <Typography>
                        You don't know any spells for this class
                    </Typography>
                </div>
            )}
        </Paper>
    );
};
