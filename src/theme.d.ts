import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    admin: PaletteColor; 
  }

  interface PaletteOptions {
    admin?: PaletteColorOptions; 
  }
}

export {};