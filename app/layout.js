import "./globals.css";

export const metadata = {
  title: "MockFrame — Device Mockup & Screen Capture",
  description: "Create polished device mockup demos. Enter a URL, pick a device frame, interact with the live site, and capture screenshots or video.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
