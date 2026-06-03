const ikonProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export const GozAcik = ({ boyut = 18 }) => (
  <svg {...ikonProps} width={boyut} height={boyut} viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const GozKapali = ({ boyut = 18 }) => (
  <svg {...ikonProps} width={boyut} height={boyut} viewBox="0 0 24 24">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <path d="M10.73 10.73a3 3 0 0 0 4.24 4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const KitapIkon = ({ boyut = 24, renk = 'currentColor' }) => (
  <svg {...ikonProps} width={boyut} height={boyut} viewBox="0 0 24 24" stroke={renk}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);
