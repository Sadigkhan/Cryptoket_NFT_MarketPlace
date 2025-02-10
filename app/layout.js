import "./globals.css";
import ThemeProvider from "@/context/Theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class">
          <div className="dark:bg-nft-dark bg-white min-h-screen">
            <Navbar />
            <div >
            {children}
            </div>
            <Footer />
          </div>
          <Script
            src="https://kit.fontawesome.com/6f55973034.js"
            crossorigin="anonymous"
          />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
