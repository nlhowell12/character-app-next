import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

interface BasicTabsProps {
    children?: React.ReactNode;
}
export default function SpellbookTabsContainer({children}: BasicTabsProps) {
  const [value, setValue] = React.useState(0);

  const list = React.Children.toArray(children);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Class Spells" />
          <Tab label="Spell Book"/>
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {list[0]}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {list[1]}
      </CustomTabPanel>
    </Box>
  );
}
