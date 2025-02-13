import {
    BonusTypes,
    Character,
    Modifier,
    RankedSkill,
    SkillTypes,
} from '@/_models';
import { ModiferSourceBonusObject } from '@/_utils/defenseUtils';
import {
    getArmorCheckPenalties,
    getTotalSkillValue,
    getSkillBonusObject,
    getModsForSkill,
    canUseUntrained,
} from '@/_utils/skillIUtils';
import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    tooltipClasses,
    TooltipProps,
    Typography,
    useTheme,
} from '@mui/material';
import Block from '@mui/icons-material/Block';
import { styled } from '@mui/material/styles';

interface SkillDisplayProps {
    character: Character;
}

interface SkillCellProps {
    children: React.ReactNode;
}
interface SkillsTooltipProps {
    skill: RankedSkill;
    character: Character;
}

const SkillCell = ({ children }: SkillCellProps) => {
    return (
        <TableCell size='small' align='center'>
            {children}
        </TableCell>
    );
};
const NoMaxWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 'none',
    },
});
const SkillsTooltip = ({ skill, character }: SkillsTooltipProps) => {
    const skillMods = getSkillBonusObject(skill, character);
    const untypedMods = getModsForSkill(skill, character).filter(
        (x) => x.type === BonusTypes.Untyped
    );
    const untypedBonusObject: ModiferSourceBonusObject =
        {} as ModiferSourceBonusObject;
    untypedMods.forEach((mod: Modifier) => {
        if (!untypedBonusObject[mod.source]) {
            untypedBonusObject[mod.source] = mod.value;
        } else {
            untypedBonusObject[mod.source] += mod.value;
        }
    });
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
                            {skill.name === SkillTypes.Athletics && (
                                <Typography variant='caption'>
                                    Double for Swimming
                                </Typography>
                            )}
                            <Typography>
                                {getArmorCheckPenalties(character.equipment)}
                            </Typography>
                        </SkillCell>
                    ) : null}
                    {Object.entries(skillMods).map(([key, value]) => {
                        return (
                            key !== BonusTypes.Untyped && (
                                <SkillCell key={key + value}>
                                    <Typography>{key}</Typography>
                                    <Typography>{value}</Typography>
                                </SkillCell>
                            )
                        );
                    })}
                    {Object.entries(untypedBonusObject).map(([key, value]) => {
                        return (
                            <SkillCell key={key + value}>
                                <Typography>{key}</Typography>
                                <Typography>{value}</Typography>
                            </SkillCell>
                        );
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
            sx={{
                overflow: 'scroll',
                width: 'fit-content',
                [theme.breakpoints.up('xl')]: {
                    maxHeight: '65vh',
                },
            }}
        >
            <Table>
                <TableBody>
                    {Object.entries(character.skills).map(
                        ([skillName, skill]) => {
                            return (
                                <NoMaxWidthTooltip
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
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Typography>
                                                    {skill.name}
                                                </Typography>
                                                {!canUseUntrained(skill) && (
                                                    <Tooltip title='Cannot use Untrained'>
                                                        <Block
                                                            sx={{
                                                                marginLeft:
                                                                    '.25rem',
                                                                color: 'red',
                                                            }}
                                                        />
                                                    </Tooltip>
                                                )}
                                            </div>
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
                                </NoMaxWidthTooltip>
                            );
                        }
                    )}
                </TableBody>
            </Table>
        </Card>
    );
};
