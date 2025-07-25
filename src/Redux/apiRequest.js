import axios from "axios";
import { refreshToken } from '../Component/axiosConfig'
import { loginFail, loginStart, loginSuccess, logOutFail, logOutStart, logOutSuccess, registerFail, registerStart, registerSuccess, clearCart } from "./authSlice";


export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        console.log("API URL đang dùng:", process.env.REACT_APP_API_URL);
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, user, { withCredentials: true });
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
        await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, user);
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
            `${process.env.REACT_APP_API_URL}/api/users/logout`,
            null,
            {
                headers: { Authorization: `Bearer ${validToken}` },
                withCredentials: true
            }
        );

        dispatch(logOutSuccess());
        dispatch(clearCart());
        navigate("/home");
    } catch (err) {
        console.error("Logout Error:", err.response?.data || err.message);
        dispatch(logOutFail());

    }
};








