"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useQueryState } from "nuqs";
export const EmailOverlay = () => {
  const [_, setSelectionId] = useQueryState("selectionId");
  return (
    <motion.nav className="">
      <Button
        onClick={() => setSelectionId("new")}
        variant={"default"}
        className="w-full"
      >
        <Plus />
      </Button>
      <motion.div className={``}></motion.div>
    </motion.nav>
  );
};
