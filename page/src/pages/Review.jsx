import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CommentsContainer from "../components/CommentsContainer";
import LikesButton from "../components/LikesButton";
import ReactMarkdown from "react-markdown";
import instanceBase from "../axios/instanceBase";
import { useTranslation } from "react-i18next";
import altImage from "../img/no-image.jpg";

export default function Review() {
    const paramId = useParams();
    const { t } = useTranslation();

    const [data, setData] = useState({});

    useEffect(() => {
        const getReviewFields = async () => {
            try {
                const response = await instanceBase.get(
                    `/get/reviewFields?id=${paramId.id}`
                );
                const data = response.data[0];
                setData(data);
            } catch (error) {
                console.log(error);
            }
        };
        getReviewFields();
    }, [paramId.id]);
    const date = new Date(Number(data.date_create));
    const dateString = `${date.getDate()}.${
        date.getMonth() + 1
    }.${date.getFullYear()}`;

    if (data?.id) {
        return (
            <div className="review-page_wrapper">
                <div className="review-page">
                    <div className="review-page_section-1">
                        <div className="review-page__img centerCol">
                            <img
                                src={
                                    data.image_name
                                        ? `${data.image_name}`
                                        : altImage
                                }
                                alt="review img"
                            />
                        </div>
                        <div className="review-page__info">
                            <div className="section_1">
                                <h2>{data.title}</h2>
                                {data.rating >= 7 && (
                                    <p className="good">{data.rating}/10</p>
                                )}
                                {data.rating > 3 && data.rating < 7 && (
                                    <p className="middle">{data.rating}/10</p>
                                )}
                                {data.rating <= 3 && (
                                    <p className="bad">{data.rating}/10</p>
                                )}
                            </div>
                            <div className="header_text ">{data.header}</div>
                            <div className="category">
                                <p className="category_text">
                                    {t("reviewPreview.category")}
                                </p>
                                <p className="category_value brg_contrast">{`${t(
                                    `category.${data.category_value}`
                                )}`}</p>
                            </div>
                            <div className="tags">
                                <p className="tags_text">
                                    {t("reviewPreview.tags")}
                                </p>
                                <div className="tags_wrapper">
                                    {data?.tags[0] ? (
                                        data.tags.map((tag) => {
                                            return (
                                                <p
                                                    key={tag}
                                                    className="tags_body brg_contrast"
                                                >
                                                    {tag}
                                                </p>
                                            );
                                        })
                                    ) : (
                                        <p className="tags_text">
                                            {t("reviewPreview.noTags")}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="section_floor">
                                <div className="author">
                                    <p className="text">
                                        {t("reviewPreview.author")}
                                    </p>
                                    <p className="user brg_contrast">
                                        {data.name}
                                    </p>
                                </div>
                                <div className="section_floor_likes_value">
                                    <p className="section_floor_likes_value_text ">
                                        {t("reviewPreview.authorRating")}
                                    </p>
                                    <p className="section_floor_likes_value_value brg_contrast">
                                        {data.author_likes}
                                    </p>
                                    <ThumbUpIcon className="section_floor_likes_value_icon " />
                                </div>
                                <div className="section_floor_floor">
                                    <p className="section_floor_floor_date">
                                        {dateString}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="review-page_section-2">
                        <div className="review-page_section-2_body">
                            <ReactMarkdown>{data.body}</ReactMarkdown>
                        </div>
                        <div className="review-page_section-2_button">
                            <LikesButton reviewId={data.id} />
                        </div>
                    </div>
                    <CommentsContainer reviewId={Number(paramId.id)} />
                </div>
            </div>
        );
    } else {
        return (
            <div className="review-page_wrapper">
                <div className="progress centerCol">
                    <CircularProgress size="12rem" />
                </div>
            </div>
        );
    }
}
