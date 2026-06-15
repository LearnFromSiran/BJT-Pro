import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BJT Pro — Japanese Letter to Nepali Explainer',
  description:
    'Upload any Japanese letter and get a plain-Nepali explanation, action items, deadlines, risks, and an optional Japanese reply.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1d4ed8',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ne">
      <body>
        <div className="app-shell">{children}</div>
      </body>
    </html>
  );
}
