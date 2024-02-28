import axios from "axios";
const instanceFormData = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}`,
    withCredentials: true,
    headers: {
        "Content-Type": `multipart/form-data;`,
    },
});
export default instanceFormData;
