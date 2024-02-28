import CircularProgress from "@mui/material/CircularProgress";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ReplayIcon from "@mui/icons-material/Replay";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import SouthIcon from "@mui/icons-material/South";
import NorthIcon from "@mui/icons-material/North";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReviewPreview from "../components/ReviewPreview";
import ReviewPreviewButtons from "../components/ReviewPreviewButtons";
import { getUserInfo, editName } from "../store/user";
import validate from "../functions/validate";
import { sortReviews } from "../store/user";

export default function Profile() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);
    const reviewsLoader = useSelector((state) => state.user.reviewsLoader);
    const nameLoader = useSelector((state) => state.user.nameLoader);

    const [nameEditMode, setNameEditMode] = useState(false);
    const [newName, setNewName] = useState(user.name);
    const [buttonNameDisabled, setButtonNameDisabled] = useState(false);

    useEffect(() => {
        dispatch(getUserInfo());
    }, [dispatch]);

    const changeName = () => {
        if (newName !== user.name) {
            dispatch(editName({ name: newName, id: user.id }));
        }
        setNameEditMode(false);
    };

    return (
        <div className="profile">
            <div className="info">
                {nameEditMode ? (
                    <div className={"info_name-button-wrapper-save"}>
                        <input
                            onChange={(e) => {
                                if (!validate(e.target.value)) {
                                    setButtonNameDisabled(true);
                                }
                                if (
                                    validate(e.target.value) &&
                                    buttonNameDisabled
                                ) {
                                    setButtonNameDisabled(false);
                                }
                                setNewName(e.target.value);
                            }}
                            autoFocus={true}
                            value={newName}
                        ></input>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <div
                                className="button-component info_name-button"
                                style={{ marginRight: "2rem" }}
                            >
                                <Button
                                    className="cenrerRow info_name-button"
                                    variant="contained"
                                    onClick={() => {
                                        setNameEditMode(false);
                                        setNewName(user?.name);
                                    }}
                                >
                                    <ReplayIcon
                                        style={{ fontSize: "2.5rem" }}
                                    />
                                </Button>
                            </div>
                            <div className="button-component info_name-button">
                                <Button
                                    className="cenrerRow info_name-button"
                                    variant="contained"
                                    disabled={buttonNameDisabled}
                                    onClick={() => {
                                        changeName();
                                    }}
                                >
                                    <p>{t("profile.editNameSave")}</p>
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="info_name-button-wrapper">
                        {nameLoader ? (
                            <div className="centerRow">
                                <CircularProgress size="4rem" />
                            </div>
                        ) : (
                            <h2>{user?.name}</h2>
                        )}
                        <div className="button-component info_name-button">
                            <Button
                                className="cenrerRow info_name-button"
                                variant="contained"
                                onClick={() => {
                                    setNameEditMode(true);
                                }}
                            >
                                <BorderColorIcon className="icon" />
                                <p>{t("profile.editName")}</p>
                            </Button>
                        </div>
                    </div>
                )}
                <p>
                    {user.likes} <ThumbUpIcon className="icon" />
                </p>
            </div>
            <div className="hr"></div>
            <div className="my-reviews">
                <p>{t("profile.myReviews")}</p>
                <div className="profile_sort">
                    <Select
                        defaultValue={1}
                        onChange={(e) => {
                            dispatch(sortReviews(e.target.value));
                        }}
                    >
                        <MenuItem value={1}>
                            {t("profile.sortDate")}
                            <SouthIcon
                                style={{
                                    fontSize: "1.4rem",
                                    marginLeft: "1rem",
                                }}
                            />
                        </MenuItem>
                        <MenuItem value={2}>
                            {t("profile.sortDate")}
                            <NorthIcon
                                style={{
                                    fontSize: "1.4rem",
                                    marginLeft: "1rem",
                                }}
                            />
                        </MenuItem>
                        <MenuItem value={3}>
                            {t("profile.sortRanked")}
                            <SouthIcon
                                style={{
                                    fontSize: "1.4rem",
                                    marginLeft: "1rem",
                                }}
                            />
                        </MenuItem>
                        <MenuItem value={4}>
                            {t("profile.sortRanked")}
                            <NorthIcon
                                style={{
                                    fontSize: "1.4rem",
                                    marginLeft: "1rem",
                                }}
                            />
                        </MenuItem>
                        <MenuItem value={5}>
                            {t("profile.sortName")}
                            <SouthIcon
                                style={{
                                    fontSize: "1.4rem",
                                    marginLeft: "1rem",
                                }}
                            />
                        </MenuItem>
                        <MenuItem value={6}>
                            {t("profile.sortName")}
                            <NorthIcon
                                style={{
                                    fontSize: "1.4rem",
                                    marginLeft: "1rem",
                                }}
                            />
                        </MenuItem>
                    </Select>
                </div>
                <div className="button-component">
                    <Button
                        className="centerRow"
                        variant="contained"
                        onClick={() => {
                            navigate("/create");
                        }}
                    >
                        <AddIcon className="icon" />
                        <p>{t("profile.new")}</p>
                    </Button>
                </div>
            </div>
            {reviewsLoader ? (
                <div className="progress centerCol">
                    <CircularProgress size="12rem" />
                </div>
            ) : (
                <div className="reviews">
                    {user.reviews?.map((el) => {
                        return (
                            <div className="review-preview-buttons" key={el.id}>
                                <ReviewPreview data={el} />
                                <ReviewPreviewButtons id={el.id} />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
