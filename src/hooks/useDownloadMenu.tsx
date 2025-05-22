import { useState } from "react";

export const useDownloadMenu = () => {
  const [openDownloadMenu, setOpenDownloadMenu] = useState(false);
  const toggleOpenDownloadMenu = () => setOpenDownloadMenu(prev => !prev);

  return { openDownloadMenu, toggleOpenDownloadMenu };
};