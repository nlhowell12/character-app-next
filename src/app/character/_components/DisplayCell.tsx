import {
	Card,
	TableCell,
	TextField,
	Tooltip,
	Typography,
	TypographyVariant,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useRef, useState } from 'react';
import { useOutsideAlerter } from '../../utils/outsideMouseClick';

const useStyles = makeStyles((theme) => ({
	table: {},
	tableRow: {
		border: 'none',
	},
	tableCell: {},
	cellRoot: {
		padding: '0 .5rem 0 0',
	},
	displayCard: {
		padding: '.5rem',
	},
	tableContainer: {
		marginLeft: '1rem',
	},
	tableRowRoot: {
		borderBottom: 'none',
	},
}));

interface DisplayCellProps {
	variant?: TypographyVariant;
	onChange?: React.Dispatch<React.SetStateAction<any>>;
	editable?: boolean;
	cellTitle: string;
	value: string | number | string[];
	tooltip?: any;
	tooltipPlacement?:
		| 'bottom'
		| 'left'
		| 'right'
		| 'top'
		| 'bottom-end'
		| 'bottom-start'
		| 'left-end'
		| 'left-start'
		| 'right-end'
		| 'right-start'
		| 'top-end'
		| 'top-start'
		| undefined;
}
export const DisplayCell: React.FC<DisplayCellProps> = ({
	variant = 'body1',
	onChange,
	editable = false,
	cellTitle,
	value,
	tooltip,
	tooltipPlacement,
}) => {
	const classes = useStyles();
	const [openEdit, setOpenEdit] = useState(false);
	const cellRef = useRef(null);

	const cellStylingObject = {
		borderBottom: 'none',
		padding: '0 .5rem .5rem 0',
		cursor: !!editable ? 'pointer' : 'default',
	};

	const cardStylingObject = {
		'&:hover': {
			borderColor: !!editable ? '#666666' : undefined,
		},
	};

	useOutsideAlerter(cellRef, setOpenEdit);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		!!onChange && onChange(event.target.value);
	};

	return !!tooltip ? (
		<Tooltip title={tooltip} placement={tooltipPlacement} followCursor>
			<TableCell sx={cellStylingObject} size='small'>
				<Card
					onClick={() => setOpenEdit(true)}
					onKeyDown={(e) => e.key === 'Enter' && setOpenEdit(false)}
					className={classes.displayCard}
					variant='outlined'
					ref={cellRef}
					sx={cardStylingObject}
				>
					{!!openEdit && !!onChange && !!editable ? (
						<TextField
							onChange={handleChange}
							value={value}
							autoFocus
						></TextField>
					) : (
						<Typography variant={variant}>{`${cellTitle} ${value}`}</Typography>
					)}
				</Card>
			</TableCell>
		</Tooltip>
	) : (
		<TableCell sx={cellStylingObject} size='small'>
			<Card
				onClick={() => setOpenEdit(true)}
				onKeyDown={(e) => e.key === 'Enter' && setOpenEdit(false)}
				className={classes.displayCard}
				variant='outlined'
				ref={cellRef}
				sx={cardStylingObject}
			>
				{!!openEdit && !!onChange && !!editable ? (
					<TextField
						onChange={handleChange}
						value={value}
						autoFocus
						onFocus={(e) => e.target.select()}
					></TextField>
				) : (
					<Typography variant={variant}>{`${cellTitle} ${value}`}</Typography>
				)}
			</Card>
		</TableCell>
	);
};
