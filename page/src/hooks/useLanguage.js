import { useState } from "react";

export default function useLanguage(key, defaultValue) {
    const [storeValue, setStoreValue] = useState(() => {
        try {
            const value = localStorage.getItem(key);
            if (value) {
                return JSON.parse(value);
            } else {
                localStorage.setItem(key, JSON.stringify(defaultValue));
                return defaultValue;
            }
        } catch (error) {
            return defaultValue;
        }
    });
    const setValue = (newValue) => {
        try {
            localStorage.setItem(key, JSON.stringify(newValue));
        } catch (error) {
            console.log(error);
        }
        setStoreValue(newValue);
    };
    return [storeValue, setValue];
}
