import { Character, RankedSkill } from '@/_models';
import { getSkillModifiers, getArmorCheckPenalties, getTotalSkillValue } from '@/_utils/skillIUtils';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
interface SkillDisplayProps {
    character: Character;
};

interface SkillCellProps {
    children: React.ReactNode;
};
interface SkillsTooltipProps {
    skill: RankedSkill; 
    character: Character
};

const SkillCell = ({children}: SkillCellProps) => {
    return (
        <TableCell size='small' align='center'>
            {children}
        </TableCell>
    );
};
const SkillsTooltip = (
    {
        skill,
        character
    }: SkillsTooltipProps
) => {
    // const synergy = getSkillSynergies(skill, character);
    const miscMods = getSkillModifiers(skill, character);
    return (
        <Table>
            <TableBody>
                <TableRow>
                    <SkillCell>
                        <Typography>Ranks</Typography>
                        <Typography>{skill.ranks || 0}</Typography>
                    </SkillCell>
                    {!!skill.armorCheckPenalty ? (
                        <SkillCell>
                            <Typography>Armor Penalty</Typography>
                            <Typography>
                                {getArmorCheckPenalties(character.equipment)}
                            </Typography>
                        </SkillCell>
                    ) : null}
                    {/* {!!synergy ? (
                        <SkillCell>
                            <Typography>Synergy</Typography>
                            <Typography>{synergy}</Typography>
                        </SkillCell>
                    ) : null} */}
                    {!!miscMods ? (
                        <SkillCell>
                            <Typography>Misc</Typography>
                            <Typography>{miscMods}</Typography>
                        </SkillCell>
                    ) : null}
                </TableRow>
            </TableBody>
        </Table>
    );
};

export const SkillDisplay = ({ character }: SkillDisplayProps) => {
    return (
        <Card
            sx={{ overflow: 'scroll', maxHeight: '65vh', width: 'fit-content' }}
        >
            <Table>
                <TableBody>
                    {Object.entries(character.skills).map(
                        ([skillName, skill]) => {
                            return (
                                <Tooltip
                                    key={skillName}
                                    followCursor
                                    title={
                                        <SkillsTooltip
                                            skill={skill}
                                            character={character}
                                        />
                                    }
                                    placement='left'
                                >
                                    <TableRow key={skillName}>
                                        <SkillCell>
                                            <Typography>
                                                {skill.name}
                                            </Typography>
                                        </SkillCell>
                                        <SkillCell>
                                            <Typography variant='caption'>
                                                {skill.linkedAttribute.slice(
                                                    0,
                                                    3
                                                )}
                                            </Typography>
                                        </SkillCell>
                                        <SkillCell>
                                            <Typography variant='caption'>
                                                Total
                                            </Typography>
                                            <Typography variant='body1'>
                                                {getTotalSkillValue(
                                                    character,
                                                    skill
                                                )}
                                            </Typography>
                                        </SkillCell>
                                    </TableRow>
                                </Tooltip>
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </Card>
    );
};
