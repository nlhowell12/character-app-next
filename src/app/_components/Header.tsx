'use client'

import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuBook from '@mui/icons-material/MenuBook';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Home from '@mui/icons-material/Home';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useState } from 'react';
import { SpellTable } from './SpellTable';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	ListItemButton,
} from '@mui/material';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create('width', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: 'hidden',
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up('sm')]: {
		width: `calc(${theme.spacing(9)} + 1px)`,
	},
});

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(['width', 'margin'], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	...(open && {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	}),
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: 'nowrap',
	boxSizing: 'border-box',
	...(open && {
		...openedMixin(theme),
		'& .MuiDrawer-paper': openedMixin(theme),
	}),
	...(!open && {
		...closedMixin(theme),
		'& .MuiDrawer-paper': closedMixin(theme),
	}),
}));

export default function Header() {
	const [open, setOpen] = useState(false);
	const [spellOpen, setSpellOpen] = useState<boolean>(false);
	const [warning, setWarning] = useState<string>('');
	const router = useRouter();

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleSpellToggle = () => {
		setSpellOpen(!spellOpen);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};

	const handleHome = () => {
		if (location.pathname.includes('/createCharacter') && !warning) {
			setWarning('You will lose all progress if you continue.');
		} else {
			setWarning('');
			router.push('/');
		}
	};

	const handleDialogClose = () => {
		setWarning('');
	};
	return (
		<Box sx={{ display: 'flex' }}>
			<CssBaseline />
			<AppBar position='fixed' open={open}>
				<Toolbar>
					<IconButton
						color='inherit'
						aria-label='open drawer'
						onClick={handleDrawerOpen}
						edge='start'
						title='Open'
						sx={{
							marginRight: '36px',
							...(open && { display: 'none' }),
						}}
					>
						<ChevronRightIcon />
					</IconButton>
					<Typography variant='body1' noWrap component='div'>
						Rhedrah Character Sheet
					</Typography>
				</Toolbar>
			</AppBar>
			<Drawer variant='permanent' open={open}>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose} title='Close'>
						<ChevronLeftIcon />
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List>
					<ListItemButton  onClick={handleHome}>
						<ListItemIcon title='Home'>
							<Home />
						</ListItemIcon>
						<ListItemText primary={'Home'} />
					</ListItemButton>
					<ListItemButton  onClick={handleSpellToggle}>
						<ListItemIcon title='Full Spell List'>
							<MenuBook />
						</ListItemIcon>
						<ListItemText primary={'Full Spell List'} />
					</ListItemButton>
				</List>
			</Drawer>
			<Dialog
				open={spellOpen}
				onClose={handleSpellToggle}
				fullWidth
				maxWidth='lg'
				keepMounted
			>
				<SpellTable />
			</Dialog>
			<Dialog
				open={!!warning}
				onClose={handleDialogClose}
				aria-labelledby='alert-dialog-title'
				aria-describedby='alert-dialog-description'
			>
				<DialogTitle id='alert-dialog-title'>
					{'Leaving Character Creation!'}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id='alert-dialog-description'>
						{warning}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button variant='outlined' onClick={handleDialogClose}>
						Stay on Page
					</Button>
					<Button variant='outlined' onClick={handleHome} autoFocus>
						Leave Page
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}
