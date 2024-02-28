import { Route, Routes } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import NotFound from "./pages/NotFound";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Review from "./pages/Review";
import Create from "./pages/Create";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import SearchPage from "./pages/SearchPage";
import useTheme from "./hooks/useTheme";
import useAuth from "./hooks/useAuth";
import PrivateAuth from "./hoc/PrivateAuth";

export default function App() {
    useAuth();
    useTheme();
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Main />} />
                <Route
                    path="profile"
                    element={
                        <PrivateAuth>
                            <Profile />
                        </PrivateAuth>
                    }
                />
                <Route path="review/:id" element={<Review />} />
                <Route
                    path="create/"
                    element={
                        <PrivateAuth>
                            <Create />
                        </PrivateAuth>
                    }
                />
                <Route
                    path="create/:id"
                    element={
                        <PrivateAuth>
                            <Create />
                        </PrivateAuth>
                    }
                />
                <Route
                    path="admin"
                    element={
                        <PrivateAuth>
                            <Admin />
                        </PrivateAuth>
                    }
                />
                <Route
                    path="search/tag/:tagId/:tagName"
                    element={<SearchPage />}
                />
                <Route path="search/string/:body" element={<SearchPage />} />
            </Route>
            <Route path="auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
