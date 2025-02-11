"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useState, useEffect } from "react";

import React from "react";

const ThemeProvider = ({ children, ...props }) => {
  const [mounted,setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  } else {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
  }
};

export default ThemeProvider;
