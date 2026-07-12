import { Commissioner, Handjet } from 'next/font/google';
import { LangProvider } from '../context/LangContext';
import './globals.css';

const commissioner = Commissioner({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const handjet = Handjet({
  subsets: ['latin', 'cyrillic'],
  axes: ['ELGR', 'ELSH'],
  variable: '--font-ui',
  display: 'swap',
});

export const metadata = {
  title: 'Arsen Arakelyan — Product Designer',
  description: 'Product designer portfolio',
  other: { 'theme-color': '#faf6ef' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${commissioner.variable} ${handjet.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
