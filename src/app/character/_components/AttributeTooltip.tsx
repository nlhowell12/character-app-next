import { Modifier } from "@/_models";
import { Table, TableBody, TableRow, TableCell } from "@mui/material";
import { DisplayBox } from "./DisplayBox";

interface AttributeTooltipProps {
	modifiers: Modifier[]
}
export const AttributeTooltip = ({
	modifiers,
}: AttributeTooltipProps) => {
	return (
		<Table>
			<TableBody>
				<TableRow>
					{modifiers.map((mod) => {
						return (
							<TableCell key={mod.type + mod.value}>
								<DisplayBox
									displayTitle={mod.type}
									displayValue={mod.value || 0}
									modifiers={modifiers}
								/>
							</TableCell>
						);
					})}
				</TableRow>
			</TableBody>
		</Table>
	);
};
