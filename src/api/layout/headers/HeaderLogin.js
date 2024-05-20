import React from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';
import logo from '../../../img/Logo.png';

const HeaderLogin = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Box 
          display="flex" 
          justifyContent="right " 
          width="100%"
          sx={{ 
            '@media (max-width: 768px)': { 
              padding: '10px 0'
            }
          }}
        >
          <img 
            src={logo} 
            alt="logo_kelvin"
            style={{
              maxWidth: '150px',
              width: '15%', 
              height: 'auto'
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HeaderLogin;