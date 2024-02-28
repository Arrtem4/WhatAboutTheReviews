import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useLanguage from "../../hooks/useLanguage";
import i18n from "i18next";

export default function LangSelect() {
    const [language, setLanguage] = useLanguage("language", "en");

    const handleChange = (event) => {
        setLanguage(event.target.value);
        i18n.changeLanguage(event.target.value);
    };

    return (
        <div className="language-select">
            <Select value={language} onChange={handleChange} displayEmpty>
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="ru">RU</MenuItem>
            </Select>
        </div>
    );
}
