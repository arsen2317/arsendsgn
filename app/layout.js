import localFont from 'next/font/local';
import { LangProvider } from '../context/LangContext';
import './globals.css';

const uiFont = localFont({
  src: '../public/fonts/FFVIIVector_x95.woff2',
  variable: '--font-ui',
  display: 'swap',
  declarations: [{ prop: 'size-adjust', value: '148%' }],
});

const fkRaster = localFont({
  src: '../public/fonts/FKRasterGrotesk.woff2',
  variable: '--font-raster',
  display: 'swap',
});

/* Self-hosted instead of next/font/google: that loader fetches the font's
   CSS + files live from fonts.googleapis.com/fonts.gstatic.com on every
   `next build` (no persistent cache across builds, only an in-memory Map
   for the duration of a single build process), with no timeout outside dev
   mode. Deploys run `next build` directly on the VPS — if Google is
   unreachable/degraded from there, that fetch can hang or retry for a long
   time. Downloaded the single (non-subsetted-by-script) Forum woff2 once
   and self-host it, same as the other two fonts. */
const forum = localFont({
  src: '../public/fonts/Forum-Regular.woff2',
  variable: '--font-body',
  display: 'swap',
});

export const metadata = {
  title: 'Arsen Arakelyan — Product Designer',
  description: 'Product designer portfolio',
  other: { 'theme-color': '#faf6ef' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${uiFont.variable} ${fkRaster.variable} ${forum.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
