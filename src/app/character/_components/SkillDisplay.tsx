import { BonusTypes, Character, RankedSkill } from '@/_models';
import { getArmorCheckPenalties, getTotalSkillValue, getSkillBonusObject, getModsForSkill } from '@/_utils/skillIUtils';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
    useTheme
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
    const skillMods = getSkillBonusObject(skill, character);
    const untypedMods = getModsForSkill(skill, character).filter(x => x.type === BonusTypes.Untyped);
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
                    {Object.entries(skillMods).map(([key, value]) => {
                        return (
                            key !== BonusTypes.Untyped && 
                            <SkillCell key={key + value}>
                                <Typography>{key}</Typography>
                                <Typography>{value}</Typography>
                            </SkillCell>
                        )
                    })}
                    {untypedMods.map(mod => {
                        return (
                        <SkillCell key={mod.source}>
                            <Typography>{mod.source}</Typography>
                            <Typography>{mod.value}</Typography>
                        </SkillCell>)
                    })}
                </TableRow>
            </TableBody>
        </Table>
    );
};

export const SkillDisplay = ({ character }: SkillDisplayProps) => {
    const theme = useTheme();
    return (
        <Card
            sx={{ overflow: 'scroll', width: 'fit-content', [theme.breakpoints.up('xl')]: {
                maxHeight: '65vh'
            } }}
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
