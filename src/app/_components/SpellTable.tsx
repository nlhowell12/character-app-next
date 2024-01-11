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
    Button,
    Checkbox,
    FormControl,
    InputLabel,
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
import { NumberInput } from './NumberInput';
import { iconHoverStyling } from '@/_utils/theme';
import InfoIcon from '@mui/icons-material/Info';
import { getSpellDc } from '@/_utils/spellUtils';

interface SpellTableTooltipProps {
    character?: Character
    spell: AnyMagickType;
    useDex?: boolean;
}
const SpellTooltip = ({ character, spell, useDex }: SpellTableTooltipProps) => {
    const tableCellStyling = { borderBottom: 'none'};
        return (
        <Table>
            <TableRow>
                {!!character && !!(spell as Magick).savingThrow && <TableCell sx={{...tableCellStyling, borderRight: '1px solid grey'}}>
                    <Typography>DC</Typography>
                    <Typography>{getSpellDc(character, spell, useDex)}</Typography>
                </TableCell>}
                <TableCell sx={tableCellStyling}>
                    <Typography>{spell.description}</Typography>
                </TableCell>
            </TableRow>
        </Table>
    );
};
export interface SpellTableProps {
    spells: SpellObject;
    characterSpellbook?: boolean;
    character?: Character;
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
        !!spells
            ? (Object.keys(spells)[0] as keyof SpellObject)
            : CharacterClassNames.Cleric
    );
    const [selectedSubtype, setSelectedSubtype] = useState<MagickCategory>(
        MagickCategory.Maneuver
    );
    const [columns, setColumns] = useState<string[]>([]);
    const [rows, setRows] = useState<AnyMagickType[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [filteredRows, setFilteredRows] = useState<AnyMagickType[]>([]);
    const [onlyPrepared, setOnlyPrepared] = useState<AnyMagickType[]>([]);
    const [useDex, setUseDex] = useState<boolean>(false);

    const [columnFilter, setColumnFilter] = useState<{
        column: string;
        value: string;
    }>({ column: '', value: '' });

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    let initialLoad = useRef<boolean>(true);

    const maneuverClasses: CharacterClassNames[] = [
        CharacterClassNames.Hexblade,
        CharacterClassNames.Oathsworn,
        CharacterClassNames.PsychicWarrior,
        CharacterClassNames.Fighter
    ];
    const isHybridClass = maneuverClasses.includes(selectedClass);

    const handleOnlyPrepared = () => {
        if (!onlyPrepared.length) {
            const filter = (x: Magick) => x.prepared > 0;
            const onlyPreparedSpells = R.filter(filter, rows as Magick[]);
            setOnlyPrepared(onlyPreparedSpells);
        } else {
            setOnlyPrepared([]);
        }
    };
    const resetColumnFilter = () => {
        setColumnFilter({ column: '', value: '' });
    };
    const filterSelectCell = (column: string) => {
        const filterColumns = ['school', 'domain', 'path', 'discipline'];
        const filterSelectOptions = (column: string) => {
            let optionsSet = new Set<string>();
            filteredRows.forEach((x: AnyMagickType) =>
                /* @ts-ignore */
                optionsSet.add(x[column])
            );
            return optionsSet;
        };
        const handleColumnFilter = (e: SelectChangeEvent<string>) => {
            const {
                target: { value },
            } = e;
            if (!!value) {
                setColumnFilter({ column, value });
            } else {
                resetColumnFilter();
            }
        };
        if (filterColumns.includes(column)) {
            return (
                <FormControl sx={{ width: '100%' }}>
                    <InputLabel>{camelToTitle(column)}</InputLabel>
                    <Select
                        variant='standard'
                        label={camelToTitle(column)}
                        onChange={handleColumnFilter}
                        fullWidth
                        value={columnFilter.value}
                    >
                        <MenuItem value=''>Reset</MenuItem>
                        {Array.from(filterSelectOptions(column)).map((opt) => {
                            return (
                                <MenuItem key={opt} value={opt}>
                                    {opt}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            );
        }
        return camelToTitle(column);
    };

    const filterData = (col: string) => {
        const filteredColumns: string[] = [
            '_id',
            'category',
            'class',
            'description',
            'bonusType',
            'damageType',
            'prepared',
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
            if (!!onlyPrepared.length) {
                filteredSpells = onlyPrepared;
            }
            if (!!columnFilter.value) {
                filteredSpells = filteredSpells.filter(
                /* @ts-ignore */
                    (x) => x[columnFilter.column] === columnFilter.value
                );
            }
            const columns = !!filteredSpells.length
                ? Object.keys(filteredSpells[0]).filter((x) => filterData(x))
                : [];
            setRows(filteredSpells);
            setColumns(columns);
        }
    }, [spells, selectedClass, onlyPrepared, columnFilter]);

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
        resetColumnFilter();
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

    const isKnown = (spell: AnyMagickType) =>
        !!character
            ? R.any(
                  R.propEq(spell.name, 'name'),
                  character.spellBook[selectedClass]
              )
            : false;
    return (
        <Paper sx={{ width: '100%', overflow: 'scroll' }}>
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
            {isHybridClass ? (
                <>
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
                {selectedSubtype === MagickCategory.Maneuver && 
                <Button variant='outlined' sx={{marginRight: '1rem'}}onClick={() => setUseDex(!useDex)} color={useDex ? 'success' : undefined}>Use Dex for Maneuver</Button>
                }
                </>
               
            ) : null}
            <TextField
                onChange={handleSearchChange}
                value={searchValue}
                placeholder={'Search by Name'}
            />
            {!!rows.length ? (
                <>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table
                            stickyHeader
                            aria-label='sticky table'
                            size='small'
                        >
                            <TableHead>
                                <TableRow>
                                    {!!characterSpellbook ? (
                                        <>
                                            {!personal ? (
                                                <TableCell>Known</TableCell>
                                            ) : (
                                                <TableCell
                                                    onClick={handleOnlyPrepared}
                                                    sx={iconHoverStyling}
                                                >
                                                    Prepared / Used
                                                    {!!onlyPrepared.length && (
                                                        <Tooltip title='Only Showing Prepared'>
                                                            <InfoIcon
                                                                sx={{
                                                                    marginLeft:
                                                                        '.5rem',
                                                                }}
                                                                color='primary'
                                                            />
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            )}
                                        </>
                                    ) : null}
                                    {columns.map((column) => (
                                        <TableCell key={column} align='left'>
                                            {filterSelectCell(column)}
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
                                                        spell={
                                                            row
                                                        }
                                                        character={character}
                                                        useDex={useDex}
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
                                                                        checked={isKnown(
                                                                            row
                                                                        )}
                                                                        onChange={() =>
                                                                            !!onChange &&
                                                                            onChange(
                                                                                row,
                                                                                selectedClass
                                                                            )
                                                                        }
                                                                        name='Known'
                                                                    />
                                                                </TableCell>
                                                            ) : (
                                                                <TableCell>
                                                                    <NumberInput
                                                                        sx={{
                                                                            maxWidth:
                                                                                '4rem',
                                                                        }}
                                                                        value={
                                                                            (
                                                                                row as Magick
                                                                            )
                                                                                .prepared
                                                                        }
                                                                        label=''
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            !!onChange &&
                                                                            onChange(
                                                                                {
                                                                                    ...(row as Magick),
                                                                                    prepared:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                },
                                                                                selectedClass
                                                                            )
                                                                        }
                                                                    />
                                                                </TableCell>
                                                            )}
                                                        </>
                                                    ) : null}
                                                    {columns.map((val) => {
                                                        return (
                                                            <TableCell
                                                                key={
                                                                    row[
                                                                        val as keyof AnyMagickType
                                                                    ] + val
                                                                }
                                                            >
                                                                <Typography>
                                                                    {
                                                                        row[
                                                                            val as keyof AnyMagickType
                                                                        ]
                                                                    }
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
                        You dont know any spells for this class
                    </Typography>
                </div>
            )}
        </Paper>
    );
};
