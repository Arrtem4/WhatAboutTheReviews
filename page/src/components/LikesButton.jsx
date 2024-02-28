import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import Button from "@mui/material/Button";
import instanceBase from "../axios/instanceBase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { PropTypes } from "prop-types";

export default function LikesButton({ reviewId }) {
    LikesButton.propTypes = {
        reviewId: PropTypes.number,
    };
    const navigate = useNavigate();

    const userId = useSelector((state) => state.user.user?.id);

    const [likes, setLikes] = useState([]);

    useEffect(() => {
        const getLikes = async () => {
            try {
                const res = await instanceBase.get(
                    `get/reviewLikesInfo?id=${reviewId}`
                );
                if (res.status !== 200) {
                    throw new Error("getLikes error");
                }
                setLikes(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getLikes();
    }, [reviewId]);
    const likeAction = async () => {
        if (likes.includes(userId)) {
            setLikes(likes.filter((el) => el !== userId));
            await instanceBase.delete(`delete/like`, {
                data: {
                    userId: userId,
                    reviewId: reviewId,
                },
            });
        } else {
            setLikes([...likes, userId]);
            await instanceBase.post(`post/like`, { userId, reviewId });
        }
    };

    return (
        <div className="button-component likes_button">
            <Button
                variant="contained"
                onClick={() => {
                    if (userId) {
                        likeAction();
                    } else {
                        navigate("/auth");
                    }
                }}
            >
                {likes?.includes(userId) ? (
                    <ThumbUpAltIcon />
                ) : (
                    <ThumbUpOffAltIcon />
                )}
                <p>{likes.length}</p>
            </Button>
        </div>
    );
}
