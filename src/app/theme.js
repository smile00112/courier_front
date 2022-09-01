import { createTheme } from '@mui/material/styles';
import { ruRU } from '@mui/material/locale';
const theme = createTheme(
  {
    typography: {
      useNextVariants: true,
      fontFamily: "Tahoma",
      fontSize: 14,
    },
  },
  ruRU
);

export default theme;
