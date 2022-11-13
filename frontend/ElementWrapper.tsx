import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Login from './Login';
import { useCookies } from 'react-cookie';


function TopBar(barLabel, elemToShow){
    const [cookies, setCookie] = useCookies(["userType", "userEmail"]);
    var homeRef = "/";
    switch(cookies.userType){
        case "Student":
            homeRef = "/UserPage";
        case "Teacher":
            homeRef = "/TeacherPage";
    }

    return (
        <div>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
                <Typography
                variant="h6"
                noWrap
                component="a"
                href={homeRef}
                sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                //letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
                }}
            >
                Project
            </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                {barLabel}
              </Typography>
              <Button color="inherit" href="\login">Login</Button>
              <Button color="inherit" href="\logout">Logout</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <br/>
        {elemToShow}
        </div>
      );
}

export default TopBar;