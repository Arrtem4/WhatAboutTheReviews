import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LikesButton from "./LikesButton";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import altImage from "../img/no-image.jpg";
import { PropTypes } from "prop-types";

export default function ReviewPreview({ data }) {
    ReviewPreview.propTypes = {
        data: PropTypes.object,
    };

    const { t } = useTranslation();
    const navigate = useNavigate();

    const date = new Date(Number(data.date_create));
    const dateString = `${date.getDate()}.${
        date.getMonth() + 1
    }.${date.getFullYear()}`;

    return (
        <div className="review-preview">
            <div className="review-preview__img">
                <img
                    onClick={() => navigate(`/review/${data.id}`)}
                    src={data.image_name ? `${data.image_name}` : altImage}
                    alt="review img"
                />
            </div>
            <div className="review-preview__info">
                <div className="section_1">
                    <h2 onClick={() => navigate(`/review/${data.id}`)}>
                        {data.title}
                    </h2>
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
                    <p className="tags_text">{t("reviewPreview.tags")}</p>
                    <div className="tags_wrapper">
                        {data.tags[0] ? (
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
                        <p className="text">{t("reviewPreview.author")}</p>
                        <p className="user brg_contrast">{data.name}</p>
                    </div>
                    <div className="section_floor_likes_value">
                        <p className="section_floor_likes_value_text ">
                            {t("reviewPreview.authorRating")}
                        </p>
                        <p className="section_floor_likes_value_value ">
                            {data.author_likes}
                        </p>
                        <ThumbUpIcon className="section_floor_likes_value_icon " />
                    </div>
                    <div className="section_floor_floor">
                        <p className="section_floor_floor_date">{dateString}</p>
                        <LikesButton reviewId={data.id} />
                    </div>
                </div>
            </div>
        </div>
    );
}
