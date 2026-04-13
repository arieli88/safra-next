"use client";

import { useEffect } from "react";

export function HomeConsoleSignature() {
  useEffect(() => {
    console.log(
      "%cנבנה על ידי\n%c😉%cאריאל פלישבסקי%c🔥",
      "font-size: 18px; color: #fff; padding: 4px 8px; border-radius: 4px;",
      "font-size: 18px; color: #f0c674;",
      "font-size: 20px; font-weight: bold; background: linear-gradient(90deg, #ff7e5f, #feb47b); -webkit-background-clip: text; color: transparent;",
      "font-size: 20px;",
    );

    const art = `
 _____                                             _____ 
( ___ )                                           ( ___ )
 |   |~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|   | 
 |   |    _           _         _   _   ___   ___  |   | 
 |   |   /_\\    _ _  (_)  ___  | | (_) ( _ ) ( _ ) |   | 
 |   |  / _ \\  | '_| | | / -_) | | | | / _ \\ / _ \\\ |   | 
 |   | /_/ \\_\\\ |_|   |_| \\\\___||_| |_| \\___/ \\\___/ |   | 
 |___|~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~|___| 
(_____)                                           (_____)
`;

    console.log(
      `%c${art}`,
      "color: orange; font-family: monospace; font-size:10px; font-weight: bold; line-height: 1;",
    );
  }, []);

  return null;
}
