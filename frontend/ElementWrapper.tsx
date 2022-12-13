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
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DarkModeInfo } from './router'

function TopBar(barLabel, elemToShow){
    const [cookies, setCookie] = useCookies(["userType", "userEmail"]);
    const [unit, setUnit] = useState(0);
    const navigate = useNavigate();  

    useEffect(() => {if(unit == 1){navigate(-1)}}, [unit])

    const handleGoBack = () => {setUnit(unit+1)}
    var homeRef = "/";
    switch(cookies.userType){
        case "Student":
            homeRef = "/StudentPage";
            break;
        case "Teacher":
            homeRef = "/TeacherPage";
            break;
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
                width: '11%'
                }}
            >
                {barLabel}
            </Typography>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
                {barLabel}
              </Typography>
              {/* <Button color="inherit" onClick={DarkModeInfo()}> Dark Mode </Button> */}
              <Button color="inherit" onClick={handleGoBack}>Go Back</Button>
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