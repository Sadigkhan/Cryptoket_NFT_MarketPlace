import "./globals.css";
import ThemeProvider from "@/context/Theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { NFTProvider } from "@/context/NFTContext";

const RootLayout = ({ children }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">
        <NFTProvider>
          <ThemeProvider attribute="class" defaultTheme="system">
            <div className="min-h-screen bg-white dark:bg-nft-dark">
              <Navbar />
              <div>{children}</div>
              <Footer />
            </div>
            <Script
              src="https://kit.fontawesome.com/6f55973034.js"
              crossOrigin="anonymous"
            />
          </ThemeProvider>
        </NFTProvider>
      </body>
    </html>
  );
};

export default RootLayout;
