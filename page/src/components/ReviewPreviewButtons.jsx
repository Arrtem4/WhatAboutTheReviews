import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "react-i18next";
import instanceBase from "../axios/instanceBase";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";
import { useDispatch } from "react-redux";
import { deleteReview } from "../store/user";
import { useState } from "react";

export default function ReviewPreviewButtons({ id }) {
    ReviewPreviewButtons.propTypes = {
        id: PropTypes.number,
    };
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [loader, setLoader] = useState(false);

    const handlerDeleteReview = async () => {
        try {
            setLoader(true);
            const res = await instanceBase.delete(`/delete/review?id=${id}`);
            if (res.status === 200) {
                dispatch(deleteReview(id));
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="review-preview-buttons_buttons">
            <div
                onClick={() => {
                    navigate(`/create/${id}`);
                }}
                className="review-preview-buttons_buttons_button edit"
            >
                {t("profile.edit")}
            </div>
            {loader ? (
                <div className="review-preview-buttons_buttons_button del centerCol">
                    <CircularProgress size="2rem" color="inherit" />
                </div>
            ) : (
                <div
                    onClick={() => handlerDeleteReview()}
                    className="review-preview-buttons_buttons_button del"
                >
                    {t("profile.delete")}
                </div>
            )}
        </div>
    );
}
