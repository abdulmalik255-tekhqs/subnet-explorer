import { useEffect, useState } from "react";

const getCurrentTheme = () => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return document.documentElement.getAttribute("data-theme") || "light";
};

const useTheme = () => {
  const [theme, setTheme] = useState(getCurrentTheme);

  useEffect(() => {
    const handleThemeChange = (event) => {
      if (event?.detail === "light" || event?.detail === "dark") {
        setTheme(event.detail);
        return;
      }

      setTheme(getCurrentTheme());
    };

    window.addEventListener("themechange", handleThemeChange);
    window.addEventListener("storage", handleThemeChange);

    return () => {
      window.removeEventListener("themechange", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
    };
  }, []);

  return {
    theme,
    isDarkTheme: theme === "dark",
  };
};

export default useTheme;
