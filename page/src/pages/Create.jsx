import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PublishIcon from "@mui/icons-material/Publish";
import Rating from "@mui/material/Rating";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CircularProgress from "@mui/material/CircularProgress";
import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useTranslation } from "react-i18next";
import instanceBase from "../axios/instanceBase";
import instanceFormdata from "../axios/instanceFormdata";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import EditModal from "../components/EditModal";
import { getTags } from "../store/getTags";

export default function Create() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const paramId = useParams();

    const user = useSelector((state) => state.user.user);
    const tagsCloud = useSelector((state) => state.tags.tags);

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [profileProgress, setProfileProgress] = useState(false);
    const [progressOnButton, setProgressOnButton] = useState(false);
    const [editMode, setEditMode] = useState(paramId.id ? true : false);

    const [title, setTitle] = useState("");
    const [header, setHeader] = useState("");
    const [rating, setRating] = useState(0);
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [review, setReview] = useState("");
    const [files, setFiles] = useState([]);
    const [id, setId] = useState(0);
    const [imgName, setImageName] = useState("");
    const [previousImage, setPreviousImage] = useState("");

    useEffect(() => {
        dispatch(getTags());
        if (paramId.id) {
            const getReviewFields = async () => {
                try {
                    const response = await instanceBase.get(
                        `/get/reviewFieldsForEdit?id=${paramId.id}`
                    );
                    setProfileProgress(false);
                    const data = response.data[0];
                    setId(data.id);
                    setImageName(data.image_name);
                    setTitle(data.title);
                    setHeader(data.header);
                    setRating(data.rating);
                    setCategory(data.category_id);
                    setReview(data.body);
                    if (data.tags[0]) {
                        setTags(data.tags);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            setProfileProgress(true);
            getReviewFields();
        }
    }, [dispatch, paramId.id]);
    const deleteImageFromCloud = async () => {
        await instanceBase.delete(
            `/delete/imageFromCloud?name=${previousImage}`
        );
    };
    const uploadReview = async () => {
        setProgressOnButton(true);
        const formData = new FormData();
        formData.append("tags", JSON.stringify(tags));
        formData.append("date", Date.now());
        formData.append("title", title);
        formData.append("header", header);
        formData.append("rating", rating);
        formData.append("category", category);
        formData.append("review", review);
        formData.append("image", files[0]);
        formData.append("user", user.id);
        formData.append("id", id);
        formData.append("img", imgName);
        try {
            await instanceFormdata.post(`/post/review`, formData);
            if (previousImage) {
                deleteImageFromCloud();
            }
            setProgressOnButton(false);
            navigate("/profile");
        } catch (error) {
            setProgressOnButton(false);
            console.log(error);
        }
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
        },
        accept: {
            "image/*": [],
        },
        maxFiles: 1,
        maxSize: 1048576,
    });
    (function () {
        if (
            title &&
            header &&
            rating !== 0 &&
            category &&
            review &&
            buttonDisabled
        ) {
            setButtonDisabled(false);
        } else if (
            (!title || !header || !category || !review) &&
            !buttonDisabled
        ) {
            setButtonDisabled(true);
        }
    })();
    return (
        <div className="create">
            {editMode && <EditModal setEditMode={setEditMode} />}
            {profileProgress ? (
                <div className="progress centerCol">
                    <CircularProgress size="12rem" />
                </div>
            ) : (
                <div className="create__body-wrapper">
                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper">
                            <div className="create__header-field">
                                {t("create.headerTitle")}
                            </div>
                        </div>
                        <div className="create__textfield">
                            <TextField
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                placeholder={t("create.stopTitle")}
                                value={title}
                                onChange={(e) => {
                                    if (title.length < 51) {
                                        setTitle(e.target.value);
                                    } else {
                                        setTitle(title.slice(0, -1));
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        setTitle("");
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper">
                            <div className="create__header-field">
                                {t("create.headerReviewTitle")}
                            </div>
                        </div>
                        <div className="create__textfield">
                            <TextField
                                fullWidth
                                autoComplete="off"
                                variant="outlined"
                                placeholder={t("create.stopHeader")}
                                value={header}
                                onChange={(e) => {
                                    if (header.length < 101) {
                                        setHeader(e.target.value);
                                    } else {
                                        setHeader(header.slice(0, -1));
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        setHeader("");
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper">
                            <div className="create__header-field">
                                {t("create.headerRating")}
                            </div>
                        </div>
                        <div className="create__rating">
                            <Rating
                                name="customized-10"
                                defaultValue={rating}
                                max={10}
                                value={rating}
                                onChange={(e, newValue) => setRating(newValue)}
                            />
                        </div>
                    </div>
                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper">
                            <div className="create__header-field">
                                {t("create.headerCategory")}
                            </div>
                        </div>
                        <div className="create__select">
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <MenuItem value={1}>
                                    {t("create.CategoryBooks")}
                                </MenuItem>
                                <MenuItem value={2}>
                                    {t("create.CategoryGames")}
                                </MenuItem>
                                <MenuItem value={3}>
                                    {t("create.CategoryMovies")}
                                </MenuItem>
                                <MenuItem value={4}>
                                    {t("create.CategoryOther")}
                                </MenuItem>
                            </Select>
                        </div>
                    </div>
                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper header-start">
                            <div className="create__header-field ">
                                {t("create.headerTags")}
                            </div>
                        </div>
                        <div className="create__tags">
                            <Autocomplete
                                value={tags}
                                onChange={(_, newValue) => {
                                    if (
                                        tags.length < 10 &&
                                        newValue[newValue?.length - 1]?.trim()
                                            .length < 20 &&
                                        newValue[newValue?.length - 1]?.trim()
                                            .length > 1
                                    ) {
                                        setTags(
                                            newValue.map((el) =>
                                                el.toLowerCase()
                                            )
                                        );
                                    } else {
                                        setTags(newValue.slice(0, -1));
                                    }
                                }}
                                clearOnEscape={true}
                                clearText={t("create.clearTags")}
                                disabledItemsFocusable
                                multiple
                                options={tagsCloud.map((el) => el.value)}
                                freeSolo
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            key={option}
                                            variant="outlined"
                                            label={option}
                                            {...getTagProps({ index })}
                                        />
                                    ))
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        placeholder={t("create.yourTags")}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper header-start">
                            <div className="create__header-field ">
                                {t("create.headerReview")}
                            </div>
                        </div>
                        <div className="create__review">
                            <TextField
                                fullWidth
                                minRows={5}
                                maxRows={50}
                                multiline
                                value={review}
                                onChange={(event) =>
                                    setReview(event.target.value)
                                }
                                variant="outlined"
                            />
                        </div>
                    </div>
                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper header-start">
                            <div className="create__header-field">
                                {t("create.headerImage")}
                            </div>
                        </div>
                        {imgName ? (
                            <div className="create__image">
                                <img src={imgName} alt="review img" />
                                <button
                                    onClick={() => {
                                        setPreviousImage(
                                            imgName.substring(
                                                imgName.lastIndexOf("/") + 1,
                                                imgName.lastIndexOf(".")
                                            )
                                        );
                                        setImageName("");
                                    }}
                                >
                                    <HighlightOffIcon className="highlightOffIcon" />
                                </button>
                            </div>
                        ) : (
                            <>
                                {files.length ? (
                                    <div className="create__image">
                                        {files.map((file) => (
                                            <img
                                                key={file.name}
                                                src={file.preview}
                                                alt=""
                                            />
                                        ))}
                                        <button onClick={() => setFiles([])}>
                                            <HighlightOffIcon className="highlightOffIcon" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="create__image centerCol"
                                        {...getRootProps()}
                                    >
                                        <input {...getInputProps()} />
                                        <UploadFileIcon className="uploadFileIcon" />
                                        {isDragActive ? (
                                            <p>{t("create.imageDrop")}</p>
                                        ) : (
                                            <>
                                                <p>{t("create.imageDrag")}</p>
                                                <p>
                                                    {t(
                                                        "create.imageInsructions"
                                                    )}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="create__row-wrapper">
                        <div className="create__header-wrapper" />
                        <div className="button-component button-component_create">
                            <Button
                                className="centerRow"
                                variant="contained"
                                disabled={buttonDisabled}
                                onClick={() => uploadReview()}
                            >
                                {progressOnButton ? (
                                    <CircularProgress
                                        style={{ color: "white" }}
                                    />
                                ) : (
                                    <>
                                        <PublishIcon className="icon" />
                                        <p>{t("create.button")}</p>
                                    </>
                                )}
                                {}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
