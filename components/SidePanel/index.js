import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Header from './Header';
import Profile from '../Profile';

import styles from './index.module.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    text: {
      disabled: 'white',
    },
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#c57e9e',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#d47256',
          fontWeight: 900,
          marginTop: '-20px !important',
        },
      },
    },
  },
});

const SidePanel = () => {
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.panel}>
        <Header openDrawer={openDrawer} />
        <Drawer
          anchor="left"
          open={open}
          hideBackdrop
          classes={{
            paper: styles.drawer
          }}
          ModalProps={{
            keepMounted: true,
          }}
          SlideProps={{
            timeout: 300
          }}
        >
          <Profile closeDrawer={closeDrawer} />
        </Drawer>
      </div>
    </ThemeProvider>
  )
};

export default SidePanel;
