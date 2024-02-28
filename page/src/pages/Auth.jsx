import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import Google from "../img/google.png";
import Github from "../img/github.png";

const Login = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const google = () => {
        window.open(`${import.meta.env.VITE_BASE_URL}/auth/google`, "_self");
    };
    const github = () => {
        window.open(`${import.meta.env.VITE_BASE_URL}/auth/github`, "_self");
    };
    return (
        <div className="auth centerCol">
            {loading ? (
                <div className="auth_loader">
                    <CircularProgress size="12rem" />
                </div>
            ) : (
                <div className="modal centerCol">
                    <div className="login centerCol">
                        <h2>{t("modal.auth")}</h2>
                        <div
                            className="loginButton google"
                            onClick={() => {
                                setLoading(true);
                                google();
                            }}
                        >
                            <img src={Google} alt="Google" className="icon" />
                            <p>Google</p>
                        </div>
                        <div
                            className="loginButton github"
                            onClick={() => {
                                setLoading(true);
                                github();
                            }}
                        >
                            <img src={Github} alt="Github" className="icon" />
                            <p>Github</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
