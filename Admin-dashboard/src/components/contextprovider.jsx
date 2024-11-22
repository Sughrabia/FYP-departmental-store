import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme(); 

function contextprovider( {children}) {
  return (
    <ThemeProvider theme={theme}>
        {children}
    </ThemeProvider>
  );
}

export default contextprovider;
