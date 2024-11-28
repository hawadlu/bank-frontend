import {NavigateFunction} from "react-router-dom";

export function checkAndGetToken(navigate: NavigateFunction) {
    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/');
        return null;
    }
    return token;
};