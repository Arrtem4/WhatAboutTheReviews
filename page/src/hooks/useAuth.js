import { useDispatch } from "react-redux";
import { setUser } from "../store/user";
import instanceBase from "../axios/instanceBase";

export default function useAuth() {
    const dispatch = useDispatch();

    const auth = async () => {
        try {
            const res = await instanceBase.get("/auth/login/success");
            if (res.data === "guest") {
                dispatch(setUser({ user: {}, userAuth: false }));
            } else {
                dispatch(setUser({ user: res.data, userAuth: true }));
            }
        } catch (error) {
            console.log(error);
            dispatch(setUser({ user: {}, userAuth: false }));
        }
    };
    auth();
}
