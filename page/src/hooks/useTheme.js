import { useLayoutEffect, useState } from "react";

export default function useTheme() {
    const [theme, setTheme] = useState(
        localStorage.getItem("data-theme") || "light"
    );

    useLayoutEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("data-theme", theme);
    }, [theme]);
    return { theme, setTheme };
}
