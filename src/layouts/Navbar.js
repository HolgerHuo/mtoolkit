import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppBar, Box, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemText, Drawer, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import GitHubIcon from '@mui/icons-material/GitHub';

import {trackEvent} from '../utils/analyticsWrapper';
import './Navbar.css';

const drawerWidth = 240;

const toolList = [
    { itemName: '微信接龙考勤', itemTo: '/check-list' }
];

export default function NavFrame() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const navigate = useNavigate();

    return (
        <>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={() => setDrawerOpen(!drawerOpen)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component={NavLink} sx={{ fontFamily: 'Permanent Marker', textAlign: 'left', textDecoration: 'none', color: 'unset', fontWeight: 600, marginRight: '15px', ml: 2 }} to='/' onClick={() => setDrawerOpen(false)}>
                        MToolkit
                    </Typography>
                    <Typography variant="subtitle1" sx={{ textAlign: 'left', mt: 0.5, flexGrow: 1}} className='subtitle'>
                        全能的班长工具箱
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="gitHub link"
                        onClick={() => {
                            trackEvent('github', 'click');
                            setDrawerOpen(false);
                            }
                        }
                        href='https://github.com/holgerhuo/mtoolkit'
                        target='_blank'
                    >
                        <GitHubIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="go to about page"
                        onClick={() => {
                            setDrawerOpen(false);
                            navigate("/about");
                            }
                        }
                    >
                        <InfoIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="persistent"
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
            </Box>
        </>
    )
}