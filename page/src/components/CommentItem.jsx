import { PropTypes } from "prop-types";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";

export default function CommentItem({
    body,
    author,
    authorId,
    date,
    user,
    deleteComment,
    commentId,
}) {
    CommentItem.propTypes = {
        body: PropTypes.string,
        author: PropTypes.string,
        authorId: PropTypes.number,
        date: PropTypes.string,
        user: PropTypes.object,
        commentId: PropTypes.number,
        deleteComment: PropTypes.func,
    };
    const { t } = useTranslation();
    const dateStr = new Date(Number(date));
    return (
        <div className="commentItem">
            <div className="commentItem_row">
                <h4 className="commentItem_row_author">{author}</h4>
                <p className="commentItem_row_date">{`${dateStr.getDate()}.${
                    dateStr.getMonth() + 1
                }.${dateStr.getFullYear()}`}</p>
            </div>
            <div className="commentItem_body">
                <ReactMarkdown>{body}</ReactMarkdown>
            </div>
            {user?.id === authorId ? (
                <div className="commentItem_buttons">
                    <p
                        onClick={() => {
                            deleteComment(commentId);
                        }}
                    >
                        {" "}
                        {t("commentContainer.delete")}
                    </p>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
