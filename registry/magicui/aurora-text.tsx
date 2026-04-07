"use client";

import { motion } from "motion/react";

export function AuroraText({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <motion.span
      className="relative inline-block bg-[linear-gradient(120deg,#7a5334_10%,#d3a16f_35%,#f6d8b7_50%,#b6875a_70%,#7a5334_95%)] bg-[length:220%_100%] bg-clip-text text-transparent"
      animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={{ duration: 9, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}
