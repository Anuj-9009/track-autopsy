/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "error-container": "#ffdad6",
        "secondary": "#735a30",
        "on-error": "#ffffff",
        "on-secondary-fixed": "#271900",
        "surface-container-lowest": "#ffffff",
        "primary-fixed-dim": "#ffb4a9",
        "on-secondary-container": "#785f34",
        "outline": "#8a716e",
        "secondary-fixed-dim": "#e2c28f",
        "on-primary": "#ffffff",
        "on-primary-fixed": "#410001",
        "primary": "#5d0705",
        "surface-tint": "#a33c31",
        "tertiary": "#3c2703",
        "on-background": "#1d1b18",
        "surface-container": "#f3ede7",
        "on-surface-variant": "#57423f",
        "surface-bright": "#fff8f3",
        "tertiary-container": "#553d16",
        "surface-variant": "#e7e1dc",
        "inverse-surface": "#32302d",
        "outline-variant": "#ddc0bc",
        "on-secondary-fixed-variant": "#59431b",
        "background": "#fff8f3",
        "surface": "#fff8f3",
        "on-tertiary-fixed-variant": "#5b421b",
        "on-primary-container": "#ff8f80",
        "on-tertiary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-tertiary-container": "#cba878",
        "on-primary-fixed-variant": "#83251c",
        "surface-container-high": "#ede7e2",
        "tertiary-fixed-dim": "#e5c18e",
        "surface-container-highest": "#e7e1dc",
        "on-error-container": "#93000a",
        "on-surface": "#1d1b18",
        "surface-container-low": "#f9f2ed",
        "surface-dim": "#dfd9d4",
        "tertiary-fixed": "#ffddb0",
        "secondary-fixed": "#ffdeab",
        "inverse-on-surface": "#f6f0ea",
        "on-tertiary-fixed": "#291800",
        "primary-fixed": "#ffdad5",
        "secondary-container": "#fddba6",
        "error": "#ba1a1a",
        "inverse-primary": "#ffb4a9",
        "primary-container": "#7c2018"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "spacing": {
        "gutter-mobile": "0.75rem",
        "margin": "2rem",
        "gutter": "1.25rem",
        "space-md": "1rem",
        "space-xs": "0.25rem",
        "space-xl": "2.5rem",
        "margin-mobile": "1rem",
        "space-sm": "0.5rem",
        "space-lg": "1.5rem"
      },
      "fontFamily": {
        "body-sm": ["Courier Prime"],
        "label-lg": ["Space Mono"],
        "body-lg": ["Courier Prime"],
        "label-sm": ["Space Mono"],
        "headline-lg": ["Courier Prime"],
        "headline-xl": ["Courier Prime"],
        "body-md": ["Courier Prime"],
        "headline-lg-mobile": ["Courier Prime"],
        "headline-md": ["Courier Prime"],
        "label-md": ["Space Mono"],
        "headline-xl-mobile": ["Courier Prime"]
      },
      "fontSize": {
        "body-sm": [
          "11px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "label-lg": [
          "12px",
          {
            "lineHeight": "16px",
            "letterSpacing": "0.14em",
            "fontWeight": "700"
          }
        ],
        "body-lg": [
          "15px",
          {
            "lineHeight": "22px",
            "letterSpacing": "0.01em",
            "fontWeight": "400"
          }
        ],
        "label-sm": [
          "9px",
          {
            "lineHeight": "12px",
            "letterSpacing": "0.18em",
            "fontWeight": "700"
          }
        ],
        "headline-lg": [
          "28px",
          {
            "lineHeight": "34px",
            "letterSpacing": "0.04em",
            "fontWeight": "700"
          }
        ],
        "headline-xl": [
          "38px",
          {
            "lineHeight": "44px",
            "letterSpacing": "0.06em",
            "fontWeight": "700"
          }
        ],
        "body-md": [
          "13px",
          {
            "lineHeight": "19px",
            "letterSpacing": "0em",
            "fontWeight": "400"
          }
        ],
        "headline-lg-mobile": [
          "22px",
          {
            "lineHeight": "28px",
            "letterSpacing": "0.02em",
            "fontWeight": "700"
          }
        ],
        "headline-md": [
          "20px",
          {
            "lineHeight": "26px",
            "letterSpacing": "0.02em",
            "fontWeight": "700"
          }
        ],
        "label-md": [
          "10px",
          {
            "lineHeight": "14px",
            "letterSpacing": "0.12em",
            "fontWeight": "700"
          }
        ],
        "headline-xl-mobile": [
          "26px",
          {
            "lineHeight": "32px",
            "letterSpacing": "0.04em",
            "fontWeight": "700"
          }
        ]
      }
    },
  },
  plugins: [],
}
