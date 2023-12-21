import { useOutsideAlerter } from '@/_utils/outsideMouseClick';
import {
	Card,
	TableCell,
	TextField,
	Tooltip,
	Typography,
	TypographyVariant,
} from '@mui/material';
import { useRef, useState } from 'react';

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
export const DisplayCell = ({
	variant = 'body1',
	onChange,
	editable = false,
	cellTitle,
	value,
	tooltip,
	tooltipPlacement,
} : DisplayCellProps) => {
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
	const textFieldStylingObject = {
		padding: '0 .5rem 0 .5rem'
	}
	useOutsideAlerter(cellRef, setOpenEdit);

	return !!tooltip ? (
		<Tooltip title={tooltip} placement={tooltipPlacement} followCursor>
			<TableCell sx={cellStylingObject} size='small'>
				<Card
					onClick={() => setOpenEdit(true)}
					onKeyDown={(e) => e.key === 'Enter' && setOpenEdit(false)}
					variant='outlined'
					ref={cellRef}
					sx={cardStylingObject}
				>
					{!!openEdit && !!onChange && !!editable ? (
						<TextField
							onChange={onChange}
							value={value}
							autoFocus
						></TextField>
					) : (
						<Typography sx={textFieldStylingObject} variant={variant}>{`${cellTitle} ${value}`}</Typography>
					)}
				</Card>
			</TableCell>
		</Tooltip>
	) : (
		<TableCell sx={cellStylingObject} size='small'>
			<Card
				onClick={() => setOpenEdit(true)}
				onKeyDown={(e) => e.key === 'Enter' && setOpenEdit(false)}
				variant='outlined'
				ref={cellRef}
				sx={cardStylingObject}
			>
				{!!openEdit && !!onChange && !!editable ? (
					<TextField
						onChange={onChange}
						value={value}
						autoFocus
						onFocus={(e) => e.target.select()}
					></TextField>
				) : (
					<Typography sx={textFieldStylingObject} variant={variant}>{`${cellTitle} ${value}`}</Typography>
				)}
			</Card>
		</TableCell>
	);
};
