import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import { PropTypes } from "prop-types";

export default function EditModal({ setEditMode }) {
    EditModal.propTypes = {
        setEditMode: PropTypes.func,
    };
    const { t } = useTranslation();
    return (
        <div className="modal modal_editMode">
            <h2>{t("modal.editMode")}</h2>
            <div className="button-component">
                <Button
                    variant="contained"
                    onClick={() => {
                        setEditMode(false);
                    }}
                >
                    {t("modal.editModeButton")}
                </Button>
            </div>
        </div>
    );
}
