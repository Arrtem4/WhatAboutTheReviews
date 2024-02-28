import { Outlet } from "react-router-dom";
import Menu from "../components/menu/Menu";

export default function MainLayout() {
    return (
        <div className="main-layout">
            <section className="main-layout_menu">
                <Menu />
            </section>
            <section className="main-layout_outlet">
                <Outlet />
            </section>
        </div>
    );
}
