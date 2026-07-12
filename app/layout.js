import { Commissioner } from 'next/font/google';
import localFont from 'next/font/local';
import { LangProvider } from '../context/LangContext';
import './globals.css';

const commissioner = Commissioner({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-body',
  display: 'swap',
});

const shylock = localFont({
  src: '../public/fonts/ShylockNbpPixel.ttf',
  variable: '--font-ui-var',
  display: 'block',
});


export const metadata = {
  title: 'Arsen Arakelyan — Product Designer',
  description: 'Product designer portfolio',
  other: { 'theme-color': '#faf6ef' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={`${commissioner.variable} ${shylock.variable}`}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
