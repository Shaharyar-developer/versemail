"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const EmailOverlay = () => {
  return (
    <motion.nav className="">
      <Button variant={"default"} className="w-full">
        <Plus />
      </Button>
      <motion.div className={``}></motion.div>
    </motion.nav>
  );
};
