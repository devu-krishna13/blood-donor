import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../Assets/logo1.png';
import SearchBar from './SearchBar';

function UserNav({ onSearch }) {
  const location = useLocation();

  // Paths where the search bar should not appear
  const noSearchBarPaths = [
    '/UserDashboard',
    '/user-profile',
    '/user-edit-profile',
    '/user-view-notifications',
    '/user-blood-request',
    '/user-edit-request',
  ];

  const shouldShowSearchBar = !noSearchBarPaths.includes(location.pathname);

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#f36262',
        color: 'black',
        boxShadow: 1,
        zIndex: 1201, // above side menu if any
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          px: 2,
          maxWidth: '1200px',
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 60, md: 80 },
            px: 0,
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo and Home Link */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src={Logo}
              alt="Logo"
              sx={{
                height: { xs: 40, md: 60 },
                width: { xs: 40, md: 60 },
                mr: 1,
              }}
            />
            <Box
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.2rem', md: '1.5rem' },
                color: '#fff',
              }}
            >
              Blood Connect
            </Box>
          </Box>

          {/* Search Bar */}
          {shouldShowSearchBar && (
            <Box>
              <SearchBar onSearch={onSearch} />
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default UserNav;
