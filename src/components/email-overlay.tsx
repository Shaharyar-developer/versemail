"use client";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

type Direction = "horizontal" | "vertical";

export const EmailOverlay = () => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const direction: Direction = isMobile ? "vertical" : "horizontal";
  const DirectionClass = direction === "vertical" ? " flex-col " : " flex-row ";
  return (
    <motion.nav className="absolute left-12 bottom-12">
      <Button variant={"default"} className=" aspect-square">
        <Plus />
      </Button>
      <motion.div className={`flex ${DirectionClass} `}></motion.div>
    </motion.nav>
  );
};
