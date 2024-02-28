import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import CommentItem from "./CommentItem";
import { useEffect, useRef, useState } from "react";
import instanceBase from "../axios/instanceBase";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { PropTypes } from "prop-types";

export default function CommentsContainer({ reviewId }) {
    CommentsContainer.propTypes = {
        reviewId: PropTypes.number,
    };
    const { t } = useTranslation();
    const lastComment = useRef();

    const user = useSelector((state) => state.user.user);
    const userAuth = useSelector((state) => state.user.userAuth);

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const [commentsLoading, setCommentsLoading] = useState(true);

    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await instanceBase.get(
                    `/get/comments?id=${reviewId}`
                );
                setCommentsLoading(false);
                setComments(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getComments();
    }, [reviewId]);

    const sendComment = async () => {
        if (newComment.trim()) {
            try {
                setCommentsLoading(true);
                setNewComment("");
                const dateCreate = Date.now();
                const res = await instanceBase.post("/post/comment", {
                    author: user.id,
                    body: newComment,
                    dateCreate: dateCreate,
                    reviewId: reviewId,
                });
                setCommentsLoading(false);
                setComments(res.data);
            } catch (error) {
                console.log(error);
            }
        }
    };
    const deleteComment = async (id) => {
        try {
            setCommentsLoading(true);
            const res = await instanceBase.delete(
                `/delete/comment?commentId=${id}&reviewId=${reviewId}`
            );
            setCommentsLoading(false);
            setComments(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="commentsContainer">
            <div className="commentsContainer__title">
                <h2>{t("commentContainer.title")}</h2>
                <p>{comments.length}</p>
            </div>
            {userAuth ? (
                <div className="commentsContainer__new">
                    <textarea
                        placeholder={t("commentContainer.placeholder")}
                        rows={1}
                        value={newComment}
                        onKeyDown={(e) => {
                            e.target.style.height =
                                e.target.scrollHeight - 4 + "px";
                        }}
                        onChange={(e) => {
                            if (newComment.length < 600) {
                                setNewComment(e.target.value);
                            } else {
                                setNewComment(newComment.slice(0, 599));
                            }
                        }}
                    ></textarea>
                    <div className="button-component">
                        <Button
                            onClick={() => {
                                sendComment();
                            }}
                            variant="contained"
                        >
                            <SendIcon className="commentsContainer__new_icon" />
                        </Button>
                    </div>
                </div>
            ) : (
                <></>
            )}

            {comments.length > 0 && (
                <div className="commentsContainer__main">
                    {commentsLoading ? (
                        <div className="progress centerCol">
                            <CircularProgress size="8rem" />
                        </div>
                    ) : (
                        <>
                            {comments
                                .sort((a, b) => a.date - b.date)
                                .map((comment) => {
                                    return (
                                        <CommentItem
                                            key={Math.random()}
                                            body={comment.body}
                                            author={comment.name}
                                            authorId={comment.user_id}
                                            commentId={comment.id}
                                            date={comment.date_create}
                                            user={user}
                                            deleteComment={deleteComment}
                                        />
                                    );
                                })}
                            <div ref={lastComment} />
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
