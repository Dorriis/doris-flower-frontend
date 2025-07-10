
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { store } from '../Redux/store';

export const refreshToken = async () => {
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/refresh`, null, {
            withCredentials: true,
        });

        return res.data.accessToken;
    } catch (err) {
        console.error("Error refreshing token:", err.response?.data || err.message);
        return null;
    }
};

export const createAxiosInstance = (user, dispatch, statesuccsess) => {
    const newInstance = axios.create();

    newInstance.interceptors.request.use(
        async (config) => {
            const state = store.getState();
            let user = state.auth?.login?.currentUser;

            if (user && user.accessToken) {
                const now = new Date().getTime() / 1000;
                const decodedToken = jwtDecode(user.accessToken);

                if (decodedToken.exp < now) {
                    console.log('Token expired, attempting to refresh...');
                    try {
                        const data = await refreshToken();
                        if (data && data.accessToken) {
                            user = { ...user, accessToken: data.accessToken };

                            dispatch(statesuccsess(user));
                            config.headers['Authorization'] = `Bearer ${data.accessToken}`;
                        } else {
                            throw new Error('Failed to refresh token');
                        }
                    } catch (error) {
                        console.error('Error refreshing token:', error.message);
                        window.location.href = '/home';
                    }
                } else {
                    config.headers['Authorization'] = `Bearer ${user.accessToken}`;
                }
            } else {
                throw new Error('AccessToken is invalid or missing.');
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    return newInstance;
};


