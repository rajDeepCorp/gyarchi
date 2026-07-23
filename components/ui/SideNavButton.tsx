// components/ui/SideNavButton.tsx

import React from 'react';
import { LiaGripLinesSolid, LiaTimesSolid } from "react-icons/lia";
import { motion } from "motion/react"

interface SideNavButtonProps {
  isNavOpen: boolean;
  setIsNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAnimateNav: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideNavButton = ({
  isNavOpen,
  setIsNavOpen,
  setAnimateNav,
}: SideNavButtonProps) => {

  const handleOpen = (): void => {
    setAnimateNav(true);
    setIsNavOpen(true);
  };

  const handleClose = () => {
    setAnimateNav(false);
    setTimeout(() => setIsNavOpen(false), 250);
  };


  return (
    <>
      {!isNavOpen && (
        <motion.button
          key="open-button"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={handleOpen}
          className="relative origin-center z-20 sm:p-4 p-3 scale-x-200"
        >
          <LiaGripLinesSolid />
        </motion.button>
      )}
      {isNavOpen && (
        <motion.button
          key="close-button"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={handleClose}
          className="relative bg-stone-700 z-10 sm:p-4 p-3 rounded-full"
        >
          <LiaTimesSolid />
        </motion.button>
      )}
    </>
  )
}

export default SideNavButton
