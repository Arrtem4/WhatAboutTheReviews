import Button from "@mui/material/Button";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserButton() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userAuth = useSelector((state) => state.user.userAuth);
    const user = useSelector((state) => state.user.user);
    return (
        <div className="button-component">
            <Button
                className="centerRow"
                variant="contained"
                onClick={() => {
                    if (!userAuth) {
                        navigate("/auth");
                    } else {
                        navigate(
                            user?.role === "admin" ? "/admin" : "/profile"
                        );
                    }
                }}
            >
                <AccountCircleIcon className="icon" />
                {!userAuth && <p>{t("menu.buttonGuest")}</p>}
                {user?.role === "user" && <p>{t("menu.buttonProfile")}</p>}
                {user?.role === "admin" && <p>{t("menu.buttonAdmin")}</p>}
            </Button>
        </div>
    );
}
