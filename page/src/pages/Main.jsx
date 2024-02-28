import { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";
import { useSelector, useDispatch } from "react-redux";
import instanceBase from "../axios/instanceBase";
import { useTranslation } from "react-i18next";
import ReviewPreview from "../components/ReviewPreview";
import CircularProgress from "@mui/material/CircularProgress";
import { getTags } from "../store/getTags";
import { useNavigate } from "react-router-dom";

export default function Main() {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tagsCloud = useSelector((state) => state.tags.tags);

    const [lastReviewsList, setLastReviewsList] = useState([]);
    const [mostRankedReviewsList, setMostRankedReviewsList] = useState([]);
    const [mostLikedReviewsList, setMostLikedReviewsList] = useState([]);

    const [activeSection, setActiveSection] = useState("last");
    const [contentLoaded, setContentLoaded] = useState(false);

    useEffect(() => {
        const getLastReviews = async () => {
            try {
                setContentLoaded(true);
                const last = await instanceBase.get("/get/lastReviews");
                setLastReviewsList(last.data);
                setContentLoaded(false);
            } catch (error) {
                setContentLoaded(false);
            }
        };
        getLastReviews();
    }, []);
    useEffect(() => {
        dispatch(getTags());
    }, [dispatch]);

    const getMostRankedReviews = async () => {
        try {
            setContentLoaded(true);
            const mostRanked = await instanceBase.get("/get/mostRankedReviews");
            setMostRankedReviewsList(mostRanked.data);
            setContentLoaded(false);
        } catch (error) {
            setContentLoaded(false);
        }
    };
    const getMostLikedReviews = async () => {
        try {
            setContentLoaded(true);
            const mostLiked = await instanceBase.get("/get/mostLikedReviews");
            setMostLikedReviewsList(mostLiked.data);
            setContentLoaded(false);
        } catch (error) {
            setContentLoaded(false);
        }
    };

    return (
        <div className="main">
            <div className="main__tagCloud">
                <TagCloud
                    style={{ cursor: "pointer" }}
                    minSize={10}
                    maxSize={15}
                    tags={tagsCloud}
                    onClick={(tag) =>
                        navigate(`search/tag/${tag.count}/${tag.value}`)
                    }
                />
            </div>
            <div className="main_switch">
                <p
                    onClick={() => {
                        setActiveSection("last");
                    }}
                    className={`main_switch_value ${
                        activeSection === "last" ? `active` : ``
                    }`}
                >
                    {t("main.last")}
                </p>
                <p
                    onClick={() => {
                        setActiveSection("mostRanked");
                        if (mostRankedReviewsList.length === 0) {
                            getMostRankedReviews();
                        }
                    }}
                    className={`main_switch_value ${
                        activeSection === "mostRanked" ? `active` : ``
                    }`}
                >
                    {t("main.mostRanked")}
                </p>
                <p
                    onClick={() => {
                        setActiveSection("mostLiked");
                        if (mostLikedReviewsList.length === 0) {
                            getMostLikedReviews();
                        }
                    }}
                    className={`main_switch_value ${
                        activeSection === "mostLiked" ? `active` : ``
                    }`}
                >
                    {t("main.mostLiked")}
                </p>
            </div>
            {contentLoaded ? (
                <div className="progress centerCol">
                    <CircularProgress size="10rem" />
                </div>
            ) : (
                <>
                    {activeSection === "last" && (
                        <div className="main_tabs">
                            {lastReviewsList.map((review) => {
                                return (
                                    <ReviewPreview
                                        data={review}
                                        key={review.id}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {activeSection === "mostRanked" && (
                        <div className="main_tabs">
                            {mostRankedReviewsList.map((review) => {
                                return (
                                    <ReviewPreview
                                        data={review}
                                        key={review.id}
                                    />
                                );
                            })}
                        </div>
                    )}
                    {activeSection === "mostLiked" && (
                        <div className="main_tabs">
                            {mostLikedReviewsList.map((review) => {
                                return (
                                    <ReviewPreview
                                        data={review}
                                        key={review.id}
                                    />
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
