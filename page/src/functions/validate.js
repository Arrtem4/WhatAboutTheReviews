export default function validate(str) {
    if (str.length > 40 || str.length < 3) {
        return false;
    }
    if (str.split(" ").length > 2) {
        return false;
    }
    if (!/^[a-zA-Z0-9]*$/.test(str.replace(/ /g, ""))) {
        return false;
    }
    return true;
}
