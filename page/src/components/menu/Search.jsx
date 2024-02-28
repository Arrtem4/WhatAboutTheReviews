import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from "@mui/icons-material/Search";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import instanceBase from "../../axios/instanceBase";
import { useNavigate } from "react-router-dom";

export default function Search() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [titles, setTitles] = useState([]);
    const [textFieldValue, setTextFieldValue] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(true);

    const autocompleteLoading = async (searchString) => {
        try {
            setLoading(true);
            const response = await instanceBase.get(
                `/get/searchAutocomplete?searchString=${searchString}`
            );
            if (response.status === 200) {
                setLoading(false);
                setTitles(response.data);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
    const search = (searchString) => {
        navigate(`/search/string/${searchString}`);
    };

    return (
        <div className="search">
            <Autocomplete
                freeSolo
                disablePortal
                value={textFieldValue}
                fullWidth
                options={titles?.map((option) => option)}
                onChange={(_, value) => {
                    setTextFieldValue(value?.trim());
                }}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                onHighlightChange={(_, option, reason) => {
                    if (reason === "touch") {
                        search(option);
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        onKeyDown={(e) => {
                            if (e.key === "Escape" && textFieldValue) {
                                setTextFieldValue("");
                                setTitles([]);
                            }
                            if (e.key === "Enter" && textFieldValue && !open) {
                                setTitles([]);
                                search(textFieldValue);
                            }
                        }}
                        onChange={(e) => {
                            let searchString = e.target.value.trim();
                            setTextFieldValue(searchString);
                            if (searchString) {
                                autocompleteLoading(searchString);
                            } else if (!searchString && titles.length) {
                                setTitles([]);
                            }
                        }}
                        {...params}
                        label={
                            <SearchIcon
                                style={{
                                    transform: "translate(0rem, -.2rem)",
                                    fontSize: "2.5rem",
                                }}
                            />
                        }
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <div className="button-component">
                                    <Button
                                        style={{ fontSize: "1.6rem" }}
                                        className="centerRow"
                                        variant="contained"
                                        disabled={textFieldValue ? false : true}
                                        onClick={() => {
                                            setTitles([]);
                                            search(textFieldValue);
                                        }}
                                    >
                                        {loading ? (
                                            <CircularProgress
                                                size="3rem"
                                                style={{ color: "white" }}
                                            />
                                        ) : (
                                            <p>{t("menu.search")}</p>
                                        )}
                                    </Button>
                                </div>
                            ),
                        }}
                    />
                )}
            />
        </div>
    );
}
