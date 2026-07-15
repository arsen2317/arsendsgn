import localFont from 'next/font/local';
import { Forum } from 'next/font/google';
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

const forum = Forum({
  subsets: ['latin', 'cyrillic'],
  weight: ['400'],
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
