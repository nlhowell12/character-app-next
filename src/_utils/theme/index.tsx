import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";

export const numberInputStyling = {
  maxWidth: '100%',
  '& input[type=number]': {
      '-moz-appearance': 'textfield',
  },
  '& input[type=number]::-webkit-outer-spin-button':
      {
          '-webkit-appearance': 'none',
          margin: 0,
      },
  '& input[type=number]::-webkit-inner-spin-button':
      {
          '-webkit-appearance': 'none',
          margin: 0,
      },
};

export default createTheme({
  palette,
});
