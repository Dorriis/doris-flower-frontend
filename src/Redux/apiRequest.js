import axios from "axios";
import { refreshToken } from '../Component/axiosConfig'
import { loginFail, loginStart, loginSuccess, logOutFail, logOutStart, logOutSuccess, registerFail, registerStart, registerSuccess } from "./authSlice";


export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post('http://localhost:5000/api/users/login', user, { withCredentials: true });
        dispatch(loginSuccess(res.data));
        navigate('/home')
    } catch (error) {
        console.error("Login Error: ", error.response ? error.response.data : error.message);
        dispatch(loginFail());
    }
};

export const registerUser = async (user, dispatch) => {
    dispatch(registerStart());
    try {
        await axios.post('http://localhost:5000/api/users/register', user);
        dispatch(registerSuccess());

    } catch (error) {
        dispatch(registerFail());
    }

};

export const logOut = async (dispatch, navigate, accessToken, axiosLogoutJwt) => {
    dispatch(logOutStart());
    try {
        const newAccessToken = await refreshToken();
        const validToken = newAccessToken || accessToken;
        await axiosLogoutJwt.post(
            "http://localhost:5000/api/users/logout",
            null,
            {
                headers: { Authorization: `Bearer ${validToken}` },
                withCredentials: true
            }
        );

        dispatch(logOutSuccess());
        navigate("/home");
    } catch (err) {
        console.error("Logout Error:", err.response?.data || err.message);
        dispatch(logOutFail());

    }
};








