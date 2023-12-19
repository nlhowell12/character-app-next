import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { Character, RankedSkill } from '../../models';
import {
    getArmorCheckPenalties,
    getSkillModifiers,
    getSkillSynergies,
    getTotalSkillValue,
} from '../../utils/skillIUtils';

interface SkillDisplayProps {
    character: Character;
}

const useStyles = makeStyles(() => ({
    skillDisplay: {
        width: 'fit-content',
    },
}));

const SkillCell: React.FC = (props) => {
    return (
        <TableCell size='small' align='center'>
            {props.children}
        </TableCell>
    );
};
const SkillsTooltip: React.FC<{ skill: RankedSkill; character: Character }> = ({
    skill,
    character,
}) => {
    const synergy = getSkillSynergies(skill, character);
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
                    {!!synergy ? (
                        <SkillCell>
                            <Typography>Synergy</Typography>
                            <Typography>{synergy}</Typography>
                        </SkillCell>
                    ) : null}
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

export const SkillDisplay: React.FC<SkillDisplayProps> = ({ character }) => {
    const classes = useStyles();
    return (
        <Card
            className={classes.skillDisplay}
            sx={{ overflow: 'scroll', maxHeight: '100%' }}
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
