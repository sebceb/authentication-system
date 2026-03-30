import './globals.css'; // Adjust this path if your global CSS file is located elsewhere

// Metadata for the page, which will be injected into the <head>
export const metadata = {
  title: 'minDISPOSE', // Customize your application title
  description: 'Mindanao Digital Waste Mapping v1.0', // Customize your application description
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}