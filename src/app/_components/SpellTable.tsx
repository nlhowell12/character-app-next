import React, { ChangeEvent, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { ClassNames, AnyMagickType, Spell, Maneuver, Mystery, Power, Prayer } from '@/_models';
import { camelToTitle } from '@/_utils/stringUtils';

const SpellTooltip: React.FC<{
	description: string;
	bonusType?: string;
	damageType?: string;
}> = ({ description }) => {
	return <Typography>{description}</Typography>;
};

export interface SpellObject {
	[ClassNames.Cleric]: Prayer[];
	[ClassNames.Hexblade]: Spell[];
	[ClassNames.Oathsworn]: Prayer[];
	[ClassNames.Fighter]: Maneuver[];
	[ClassNames.PsychicWarrior]: Power[];
	[ClassNames.Psion]: Power[];
	[ClassNames.Shadowcaster]: Mystery[];
	[ClassNames.SorcWiz]: Spell[];
}

export const SpellTable: React.FC = () => {
	const [selectedClass, setSelectedClass] = useState<ClassNames>(
		ClassNames.Cleric
	);
	const [columns, setColumns] = useState<string[]>([]);
	const [rows, setRows] = useState<AnyMagickType[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const [filteredRows, setFilteredRows] = useState<AnyMagickType[]>([]);
	const [page, setPage] = useState<number>(0);
	const [rowsPerPage, setRowsPerPage] = useState<number>(10);
	const spells: SpellObject = {} as SpellObject; //implement database call here

	const filterData = (col: string) => {
		const filteredColumns: string[] = [
			'_id',
			'category',
			'class',
			'description',
			'bonusType',
			'damageType',
		];
		return !filteredColumns.includes(col);
	};
	useEffect(() => {
		if (!!spells) {
			const filterClass = selectedClass as keyof SpellObject;
			const columns = Object.keys(spells[filterClass][0]).filter((x) =>
				filterData(x)
			);
			setRows(spells[filterClass]);
			setColumns(columns);
		}
	}, [spells, selectedClass]);

	useEffect(() => {
		const filteredRows = rows.filter((x: AnyMagickType) =>
			x.name.toLowerCase().includes(searchValue.toLowerCase())
		);
		setFilteredRows(filteredRows);
	}, [searchValue, rows]);

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleClassChange = (event: SelectChangeEvent) => {
		setSelectedClass(event.target.value as ClassNames);
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

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<Select
				onChange={handleClassChange}
				value={selectedClass}
				children={Object.keys(ClassNames).map((x) => {
					return (
						<MenuItem value={x} key={x}>
							{x}
						</MenuItem>
					);
				})}
				sx={{ marginRight: '1rem' }}
			/>
			<TextField
				onChange={handleSearchChange}
				value={searchValue}
				placeholder={'Search by Name'}
			/>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label='sticky table'>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell key={column} align='left'>
									{camelToTitle(column)}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{(!!filteredRows.length ? filteredRows : rows)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<Tooltip
										followCursor
										title={<SpellTooltip description={row.description} />}
										placement='right'
										key={row.name}
									>
										<TableRow hover key={row.name}>
											{Object.entries(row)
												.filter(([key, _]) => filterData(key))
												.map(([_, val]) => {
													return (
														<TableCell key={_ + val}>
															<Typography>{val}</Typography>
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
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};
