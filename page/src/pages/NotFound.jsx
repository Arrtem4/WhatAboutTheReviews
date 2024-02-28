import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="not-found">
            <div className="modal centerCol not-found">
                <h2>{t("modal.notFoundText")}</h2>
                <div className="button-component">
                    <Button
                        onClick={() => navigate("/")}
                        style={{ padding: "1rem 3rem" }}
                        variant="contained"
                    >
                        {t("modal.button")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
