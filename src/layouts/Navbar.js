import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, Drawer, Divider, Fab, Fade, useScrollTrigger, Slide } from '@mui/material';
import { Menu as MenuIcon, Info as InfoIcon, GitHub as GitHubIcon, KeyboardArrowUp as KeyboardArrowUpIcon } from '@mui/icons-material';

import { trackEvent } from '../utils/analyticsWrapper';
import './Navbar.css';

const drawerWidth = 240;

const toolList = [
    { itemName: '微信接龙考勤', itemTo: '/check-list' }
];

function ScrollTop(props) {
    const trigger = useScrollTrigger({
        target: window,
        disableHysteresis: true,
        threshold: 100,
    });

    const handleClick = (event) => {
        const anchor = (event.target.ownerDocument || document).querySelector(
            '#back-to-top-anchor',
        );

        if (anchor) {
            anchor.scrollIntoView({
                block: 'center',
            });
        }
    };

    return (
        <Fade in={trigger}>
            <Box
                onClick={handleClick}
                role="presentation"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
            >
                {props.children}
            </Box>
        </Fade>
    );
}

function HideOnScroll(props) {
    const trigger = useScrollTrigger({
        target: window,
    });

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {props.children}
        </Slide>
    );
}

export default function NavFrame() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <HideOnScroll>
                <AppBar position="fixed">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => setDrawerOpen(!drawerOpen)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component={NavLink} sx={{ fontFamily: 'Permanent Marker', textAlign: 'left', textDecoration: 'none', color: 'unset', fontWeight: 600, marginRight: '15px', ml: 2 }} to='/' >
                            MToolkit
                        </Typography>
                        <Typography variant="subtitle1" sx={{ textAlign: 'left', mt: 0.2, flexGrow: 1 }} className='subtitle'>
                            全能的班长工具箱
                        </Typography>
                        <IconButton
                            color="inherit"
                            aria-label="gitHub link"
                            onClick={() => { trackEvent('github', 'click') }}
                            href='https://github.com/holgerhuo/mtoolkit'
                            target='_blank'
                        >
                            <GitHubIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="go to about page"
                            onClick={() => navigate("/about")}
                        >
                            <InfoIcon />
                        </IconButton>
                    </Toolbar>
                </AppBar>
            </HideOnScroll>
            <Drawer
                variant="temporary"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                ModalProps={{
                    keepMounted: true,
                }}
            >
                <div className='sidebar-items'>
                    <Typography variant="h6" sx={{ my: 2, fontFamily: 'Permanent Marker', textAlign: 'center' }}>
                        MToolkit
                    </Typography>
                    <Divider />
                    <List>
                        {toolList.map((i) => (
                            <ListItem key={i.itemName} disablePadding>
                                <ListItemButton sx={{ textAlign: 'center' }} component={NavLink} to={i.itemTo} onClick={() => setDrawerOpen(!drawerOpen)} >
                                    <ListItemText primary={i.itemName} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Drawer>
            <ScrollTop>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
            <div id='back-to-top-anchor' />
        </>
    )
}