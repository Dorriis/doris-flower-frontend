import axios from "axios";
import { refreshToken } from '../Component/axiosConfig';
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
// export const logOut = async (dispatch, navigate, accessToken, axiosLogoutJwt) => {
//     dispatch(logOutStart());
//     console.log("📤 Bắt đầu gọi API logout...");
//     try {
//         const response = await axiosLogoutJwt.post(
//             `${process.env.REACT_APP_API_URL}/api/users/logout`,
//             null,
//             {
//                 withCredentials: true
//             }
//         );
//         dispatch(logOutSuccess(null));
//         dispatch(clearCart());
//         navigate("/home");
//         return response.data;
//     } catch (err) {
//         const errorMessage = err.response?.data?.message || err.message || "Logout failed";
//         console.error("Logout Error:", errorMessage);
//         dispatch(logOutFail(errorMessage));
//         throw new Error(errorMessage);
//     }
// };
export const logOut = async (dispatch, navigate, accessToken, axiosLogoutJwt) => {
    dispatch(logOutStart());
    console.log("📤 Bắt đầu gọi API logout...");
    try {
        let tokenToUse = accessToken;

        if (!accessToken) {
            const refreshed = await refreshToken();
            if (refreshed) tokenToUse = refreshed;
        }

        if (!tokenToUse) throw new Error("No valid token to logout");

        await axiosLogoutJwt.post(
            `${process.env.REACT_APP_API_URL}/api/users/logout`,
            null,
            {
                headers: { Authorization: `Bearer ${tokenToUse}` },
                withCredentials: true,
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


// export const logOut = async (dispatch, navigate, accessToken, axiosLogoutJwt) => {
//     dispatch(logOutStart());
//     console.log("📤 Bắt đầu gọi API logout...");
//     try {
//         const newAccessToken = await refreshToken();
//         const validToken = newAccessToken || accessToken;
//         await axiosLogoutJwt.post(
//             `${process.env.REACT_APP_API_URL}/api/users/logout`,
//             null,
//             {
//                 headers: { Authorization: `Bearer ${validToken}` },
//                 withCredentials: true
//             }
//         );

//         dispatch(logOutSuccess());
//         dispatch(clearCart());
//         // navigate("/home");
//     } catch (err) {
//         console.error("Logout Error:", err.response?.data || err.message);
//         dispatch(logOutFail());

//     }
// };








