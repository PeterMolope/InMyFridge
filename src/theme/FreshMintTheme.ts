import { vars } from "nativewind";

export interface ThemeFonts {
  heading: {
    family: string;
    weights: Record<string, string>;
  };
  body: {
    family: string;
    weights: Record<string, string>;
  };
  mono: {
    family: string;
    weights: Record<string, string>;
  };
}

export const themeFonts: ThemeFonts = {
  heading: {
    family: 'SpaceMono',
    weights: {
      normal: 'SpaceMono',
      medium: 'SpaceMono',
      semibold: 'SpaceMono',
      bold: 'SpaceMono',
    },
  },
  body: {
    family: 'SpaceMono',
    weights: {
      normal: 'SpaceMono',
      medium: 'SpaceMono',
      semibold: 'SpaceMono',
    },
  },
  mono: {
    family: 'SpaceMono',
    weights: {
      normal: 'SpaceMono',
      medium: 'SpaceMono',
    },
  },
};

// Cyber-Neon Theme for Fridge App
// Primary: Neon Green (#8EFF71 - 142 255 113)
export const lightTheme = vars({
  "--radius": "2",

  "--background": "250 253 250",
  "--foreground": "20 20 23",

  "--card": "255 255 255",
  "--card-foreground": "20 20 23",

  "--popover": "255 255 255",
  "--popover-foreground": "20 20 23",

  "--primary": "142 255 113", // Neon Green
  "--primary-foreground": "13 97 0",

  "--secondary": "144 249 163", // Secondary Green
  "--secondary-foreground": "0 95 40",

  "--muted": "243 244 246",
  "--muted-foreground": "115 115 120",

  "--accent": "240 253 250",
  "--accent-foreground": "20 184 166",

  "--destructive": "239 68 68",

  "--border": "229 231 235",
  "--input": "243 244 246",
  "--ring": "142 255 113",

  // Surface colors from HTML design
  "--surface": "14 14 14",
  "--surface-dim": "14 14 14",
  "--surface-bright": "44 44 44",
  "--surface-container-lowest": "0 0 0",
  "--surface-container-low": "19 19 19",
  "--surface-container": "25 25 25",
  "--surface-container-high": "31 31 31",
  "--surface-container-highest": "38 38 38",
  "--surface-variant": "38 38 38",

  "--on-surface": "255 255 255",
  "--on-surface-variant": "171 171 171",

  "--outline": "117 117 117",
  "--outline-variant": "72 72 72",

  "--primary-container": "47 248 1",
  "--on-primary-container": "11 88 0",
  "--primary-fixed": "47 248 1",
  "--on-primary-fixed": "6 66 0",
  "--primary-fixed-dim": "43 232 0",
  "--on-primary-fixed-variant": "13 98 0",

  "--secondary-container": "0 109 47",
  "--on-secondary-container": "228 255 226",
  "--secondary-fixed": "144 249 163",
  "--on-secondary-fixed": "0 74 30",
  "--secondary-fixed-dim": "130 234 150",
  "--on-secondary-fixed-variant": "0 106 46",

  "--tertiary": "136 246 255",
  "--on-tertiary": "0 93 98",
  "--tertiary-container": "23 238 250",
  "--on-tertiary-container": "0 84 88",
  "--tertiary-fixed": "23 238 250",
  "--on-tertiary-fixed": "0 63 67",
  "--tertiary-fixed-dim": "0 222 234",
  "--on-tertiary-fixed-variant": "0 94 99",

  "--error": "255 115 81",
  "--on-error": "69 9 0",
  "--error-container": "185 41 2",
  "--on-error-container": "255 210 200",

  "--inverse-surface": "249 249 249",
  "--inverse-on-surface": "85 85 85",
  "--inverse-primary": "16 111 0",

  "--chart-1": "142 255 113",
  "--chart-2": "249 115 22",
  "--chart-3": "34 197 94",
  "--chart-4": "168 85 247",
  "--chart-5": "236 72 153",

  "--sidebar": "250 253 250",
  "--sidebar-foreground": "20 20 23",
  "--sidebar-primary": "142 255 113",
  "--sidebar-primary-foreground": "13 97 0",
  "--sidebar-accent": "240 253 250",
  "--sidebar-accent-foreground": "142 255 113",
  "--sidebar-border": "229 231 235",
  "--sidebar-ring": "142 255 113",
});

export const darkTheme = vars({
  "--radius": "2",

  "--background": "14 14 14",
  "--foreground": "255 255 255",

  "--card": "38 38 38",
  "--card-foreground": "255 255 255",

  "--popover": "45 45 48",
  "--popover-foreground": "255 255 255",

  "--primary": "142 255 113", // Neon Green
  "--primary-foreground": "13 97 0",

  "--secondary": "144 249 163", // Secondary Green
  "--secondary-foreground": "0 95 40",

  "--muted": "39 39 42",
  "--muted-foreground": "163 163 168",

  "--accent": "52 52 55",
  "--accent-foreground": "255 255 255",

  "--destructive": "248 113 113",

  "--border": "48 48 51",
  "--input": "39 39 42",
  "--ring": "142 255 113",

  // Surface colors from HTML design
  "--surface": "14 14 14",
  "--surface-dim": "14 14 14",
  "--surface-bright": "44 44 44",
  "--surface-container-lowest": "0 0 0",
  "--surface-container-low": "19 19 19",
  "--surface-container": "25 25 25",
  "--surface-container-high": "31 31 31",
  "--surface-container-highest": "38 38 38",
  "--surface-variant": "38 38 38",

  "--on-surface": "255 255 255",
  "--on-surface-variant": "171 171 171",

  "--outline": "117 117 117",
  "--outline-variant": "72 72 72",

  "--primary-container": "47 248 1",
  "--on-primary-container": "11 88 0",
  "--primary-fixed": "47 248 1",
  "--on-primary-fixed": "6 66 0",
  "--primary-fixed-dim": "43 232 0",
  "--on-primary-fixed-variant": "13 98 0",

  "--secondary-container": "0 109 47",
  "--on-secondary-container": "228 255 226",
  "--secondary-fixed": "144 249 163",
  "--on-secondary-fixed": "0 74 30",
  "--secondary-fixed-dim": "130 234 150",
  "--on-secondary-fixed-variant": "0 106 46",

  "--tertiary": "136 246 255",
  "--on-tertiary": "0 93 98",
  "--tertiary-container": "23 238 250",
  "--on-tertiary-container": "0 84 88",
  "--tertiary-fixed": "23 238 250",
  "--on-tertiary-fixed": "0 63 67",
  "--tertiary-fixed-dim": "0 222 234",
  "--on-tertiary-fixed-variant": "0 94 99",

  "--error": "255 115 81",
  "--on-error": "69 9 0",
  "--error-container": "185 41 2",
  "--on-error-container": "255 210 200",

  "--inverse-surface": "249 249 249",
  "--inverse-on-surface": "85 85 85",
  "--inverse-primary": "16 111 0",

  "--chart-1": "142 255 113",
  "--chart-2": "251 146 60",
  "--chart-3": "74 222 128",
  "--chart-4": "192 132 252",
  "--chart-5": "251 113 133",

  "--sidebar": "38 38 38",
  "--sidebar-foreground": "255 255 255",
  "--sidebar-primary": "142 255 113",
  "--sidebar-primary-foreground": "13 97 0",
  "--sidebar-accent": "39 39 42",
  "--sidebar-accent-foreground": "255 255 255",
  "--sidebar-border": "48 48 51",
  "--sidebar-ring": "142 255 113",
});
