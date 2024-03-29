import { createTheme } from "@mui/material";
import '@fontsource/josefin-sans/variable.css';

declare module '@mui/material/styles' {
  interface Palette {
    reddish: Palette['primary'];
  }
  interface PaletteOptions {
    reddish: PaletteOptions['primary'];
  }
}

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ce93d8'
    },
    reddish: {
      main: '#f54b38'
    }
  },
  shape: {
    borderRadius: 24
  },
  typography: {
    h1: {fontFamily: 'Josefin SansVariable', fontWeight: 200},
    h2: {fontFamily: 'Josefin SansVariable', fontWeight: 300},
    h3: {fontFamily: 'Josefin SansVariable', fontWeight: 350},
    h4: {fontFamily: 'Josefin SansVariable', fontWeight: 400},
    h5: {fontFamily: 'Josefin SansVariable', fontWeight: 500},
    h6: {fontFamily: 'Josefin SansVariable', fontWeight: 600},
  },
  // components: {
  //   MuiCircularProgress: {
  //     defaultProps: {
  //       disableShrink: true
  //     },
  //     styleOverrides: {
  //       circle: {
  //         background: 'red'
  //       }
  //     }
  //   }
  // }
});