/* This navBar layout is pretty much unfinished.
   To be improved
*/

import { useEffect, useState } from 'react';
import { AppBar, Box, Container, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, Drawer, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, NavLink } from 'react-router-dom';

const navItems = [
    { itemName: '微信接龙考勤', itemTo: '/check-list' }
];

function Navbar(props) {
    return (
        <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={props.handleDrawerToggle}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component={NavLink} sx={{ fontFamily: 'Permanent Marker', textAlign: 'left', textDecoration: 'none', color: 'unset', fontWeight: 600, marginRight: '15px' }} to='/'>
                    MToolkit
                </Typography>
                <Typography variant="subtitle1" sx={{ textAlign: 'left' }} to='/'>
                    全能的班长工具箱
                </Typography>
            </Toolbar>
        </AppBar>
    );
}

function Sidebar(props) {
    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {navItems.map((i) => (
                    <ListItem key={i.itemName} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }} component={Link} to={i.itemTo} onClick={props.onClick} >
                            <ListItemText primary={i.itemName} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: props.drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="persistent"
                sx={{
                    width: props.drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: props.drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                open={props.open}
                onClose={props.handleDrawerToggle}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                {drawer}
            </Drawer>
        </Box>
    )
}

export default function NavFrame(props) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleListClick = () => {
        if (window.innerWidth < 600) {
            handleDrawerToggle()
        }
    }

    const drawerWidth = 240;

    const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            flexGrow: 1,
            padding: theme.spacing(3),
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: `-${drawerWidth}px`,
            ...(open && {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                marginLeft: 0,
            }),
        }),
    );

    useEffect(() => {
        if (window.innerWidth >= 600) {
            setDrawerOpen(!drawerOpen);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Navbar open={drawerOpen} handleDrawerToggle={handleDrawerToggle} />
            <Sidebar open={drawerOpen} handleDrawerToggle={handleDrawerToggle} drawerWidth={drawerWidth} onClick={handleListClick} />
            <Main open={drawerOpen}>
                <Container maxWidth='sm'>
                    <Toolbar />
                    {props.children}
                </Container>
            </Main>
        </>
    )
}