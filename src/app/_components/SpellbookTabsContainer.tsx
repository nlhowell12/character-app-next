import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box>{children}</Box>}
        </div>
    );
}

interface BasicTabsProps {
    children?: React.ReactNode;
}
export default function SpellbookTabsContainer({ children }: BasicTabsProps) {
    const [value, setValue] = React.useState(0);

    const list = React.Children.toArray(children);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const showMartial = list.length > 2;

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange}>
                    <Tab label='Class Spells' />
                    <Tab label='Spell Book' />
                    {showMartial && <Tab label='Martial Queue' />}
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                {list[0]}
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                {list[1]}
            </CustomTabPanel>
            {showMartial && <CustomTabPanel value={value} index={2}>
                {list[2]}
            </CustomTabPanel>}
        </Box>
    );
}
