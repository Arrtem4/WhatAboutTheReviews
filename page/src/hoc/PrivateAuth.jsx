import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PropTypes } from "prop-types";

export default function PrivateAuth({ children }) {
    PrivateAuth.propTypes = {
        children: PropTypes.element,
    };
    const userAuth = useSelector((state) => state.user.userAuth);
    if (!userAuth) {
        return <Navigate to="/" />;
    }
    return children;
}
