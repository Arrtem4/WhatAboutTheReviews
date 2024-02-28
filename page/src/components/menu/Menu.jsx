import ThemeButton from "./ThemeButton";
import LangSelect from "./LanguageSelect";
import Search from "./Search";
import UserButton from "./UserButton";
import LogoutButton from "./LogoutButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import image from "../../img/logo.png";

export default function Menu() {
    const location = useLocation();
    const navigate = useNavigate();
    const userAuth = useSelector((state) => state.user.userAuth);
    return (
        <div className="menu">
            <div
                onClick={() => {
                    navigate("/");
                }}
                className="menu_logo"
            >
                <img src={image} alt="" />
            </div>
            <Search />
            <div className="menu_respond-button-box">
                <ThemeButton />
                <LangSelect />
                {userAuth &&
                (location.pathname.includes("profile") ||
                    location.pathname.includes("admin")) ? (
                    <LogoutButton />
                ) : (
                    <UserButton />
                )}
            </div>
        </div>
    );
}
