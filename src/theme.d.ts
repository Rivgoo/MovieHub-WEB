import { PaletteColor, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    admin: PaletteColor & {
        navBackground?: string;
    };
  }

  interface PaletteOptions {
    admin?: PaletteColorOptions & {
        navBackground?: string;
    };
  }
}

export {};