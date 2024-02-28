import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";
import { useTranslation } from "react-i18next";
import { setUser } from "../../store/user";
import { useDispatch } from "react-redux";
import instanceBase from "../../axios/instanceBase";
import { useNavigate } from "react-router-dom";

export default function LogoutButton() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const logout = async () => {
        const res = await instanceBase.get("/auth/logout");
        if (res.status === 200) {
            dispatch(setUser({}));
            navigate("/");
        }
    };
    return (
        <div className="button-component">
            <Button
                className="centerRow"
                onClick={() => logout()}
                variant="contained"
            >
                <LogoutIcon className="icon" />
                <p>{t("menu.logout")}</p>
            </Button>
        </div>
    );
}
