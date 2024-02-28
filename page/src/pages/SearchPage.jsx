import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import instanceBase from "../axios/instanceBase";
import ReviewPreview from "../components/ReviewPreview";
import CircularProgress from "@mui/material/CircularProgress";

export default function SearchPage() {
    const { t } = useTranslation();
    const param = useParams();

    const [loading, setLoading] = useState(true);
    const [reviewsList, setReviewsList] = useState([]);

    useEffect(() => {
        if (param.tagId) {
            const searchByTag = async () => {
                try {
                    const result = await instanceBase.get(
                        `/get/searchByTag?tagId=${param.tagId}`
                    );
                    if (result.status === 200) {
                        setLoading(false);
                        setReviewsList(result.data);
                    }
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            };
            searchByTag();
        }
    }, [param.tagId]);
    useEffect(() => {
        if (param.body) {
            const searchByString = async () => {
                try {
                    const result = await instanceBase.get(
                        `/get/searchByString?body=${param.body}`
                    );
                    if (result.status === 200) {
                        setLoading(false);
                        setReviewsList(result.data);
                    }
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            };
            searchByString();
        }
    }, [param.body]);

    return (
        <div className="searchPage">
            <div className="searchPage__title-wrapper">
                <p className="searchPage__title-wrapper_title">
                    {t("searchPage.title")}
                </p>
                <p className="searchPage__title-wrapper_tagName">
                    {param.body ? `${param.body}` : `${param.tagName}`}
                </p>
            </div>
            {loading ? (
                <div className="progress centerCol">
                    <CircularProgress size="10rem" />
                </div>
            ) : reviewsList[0] ? (
                <section className="searchPage__content">
                    {reviewsList.map((review) => {
                        return <ReviewPreview data={review} key={review.id} />;
                    })}
                </section>
            ) : (
                <div className="searchPage__content-not-found centerCol">
                    <h3>{t("searchPage.notFound")}</h3>
                </div>
            )}
        </div>
    );
}
