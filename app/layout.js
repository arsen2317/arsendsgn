import localFont from 'next/font/local';
import { Commissioner } from 'next/font/google';
import { LangProvider } from '../context/LangContext';
import './globals.css';

// UI font — clean sans, supports Cyrillic
const commissioner = Commissioner({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-ui',
  display: 'swap',
});

// Display/decorative font — loaded via @font-face in globals.css
// so we can control size-adjust without Next.js transformation

export const metadata = {
  title: 'Arsen Arakelyan — Product Designer',
  description: 'Product designer portfolio',
  other: { 'theme-color': '#faf6ef' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" className={commissioner.variable}>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
