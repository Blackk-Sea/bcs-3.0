import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'রিসোর্স লাইব্রেরি — বিসিএস প্রস্তুতি',
  description: 'বিসিএস প্রস্তুতির সব রিসোর্স এক জায়গায়। স্টাডি প্ল্যানার, রিসোর্স ট্র্যাকার ও প্রোগ্রেস মনিটর।',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg text-ink min-h-screen flex flex-col font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
