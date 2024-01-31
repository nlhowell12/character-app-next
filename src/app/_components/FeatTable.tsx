import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material"
import { Feat } from "@/_models"

interface FeatTableProps {
    feats: Feat[];
    handleClick?: (feat: Feat) => void;
}
export const FeatTable = ({feats, handleClick}: FeatTableProps) => {
    return (
    <TableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    {!handleClick && <TableCell>Selected Option</TableCell>}
                    <TableCell>Prerequisites</TableCell>
                    <TableCell>Category</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {feats.map(feat => {
                    return (
                        <Tooltip title={feat.definition} key={feat.name}>
                            <TableRow hover={!!handleClick} onClick={!!handleClick ? () => handleClick(feat) : undefined}>
                                <TableCell>{feat.name}</TableCell>
                                {!handleClick && <TableCell>{!!feat.selectedOption ? feat.selectedOption : ''}</TableCell>}
                                <TableCell>{!!feat.prerequisites ? feat.prerequisites : ''}</TableCell>
                                <TableCell>{feat.category}</TableCell>
                            </TableRow>
                        </Tooltip>
                    )
                })}
            </TableBody>
        </Table>
    </TableContainer>
)}