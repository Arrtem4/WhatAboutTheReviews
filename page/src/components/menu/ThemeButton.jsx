import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import useTheme from "../../hooks/useTheme";

export default function ThemeButton() {
    const { theme, setTheme } = useTheme();
    const handleChange = (event, newAlignment) => {
        if (newAlignment === null) {
            setTheme("light");
        } else {
            setTheme(newAlignment);
        }
    };

    return (
        <div className="theme-button">
            <ToggleButtonGroup
                color="primary"
                value={theme}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
            >
                <ToggleButton value="light">
                    <LightModeIcon />
                </ToggleButton>
                <ToggleButton value="dark">
                    <NightlightIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
