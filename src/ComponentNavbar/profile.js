import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button, Image } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';
import { loginSuccess } from '../Redux/authSlice';
import { createAxiosInstance } from '../Component/axiosConfig';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.login.currentUser);
    const { _id, username: initialUsername, email: initialEmail, avatar: initialAvatar } = user || {};
    const [username, setUsername] = useState(initialUsername || '');
    const [email, setEmail] = useState(initialEmail || '');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState(initialAvatar || '');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadAvatar = async () => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'AvartarUser_Flower_Doris');
        formData.append('folder', 'Avatar_Doris_Flower')

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dfkuxfick/image/upload', formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error.message);
            return null;
        }

    };

    let axiosInstance = createAxiosInstance(user, dispatch, loginSuccess);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let avatarUrl = avatar;
        if (file) {
            avatarUrl = await uploadAvatar();
            if (!avatarUrl) {
                alert('Error uploading avatar. Please try again.');
                setLoading(false);
                return;
            }
        }

        try {
            const updateData = {
                username,
                email,
                avatar: avatarUrl,
                ...(password && { password }),
            };

            const response = await axiosInstance.put(`${process.env.REACT_APP_API_URL}/api/controlUsers/${_id}`, updateData);
            const updatedUser = response.data;

            dispatch(loginSuccess({ ...updatedUser }));
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const fileURL = URL.createObjectURL(selectedFile);
            setAvatar(fileURL);
        }
    };



    return (
        <div className="profile-container">
            <h2>Update Profile</h2>
            <Form onSubmit={handleSubmit}>

                <div className="avatar-container">
                    <Image src={'https://dummyimage.com/150x150/cccccc/000000&text=Avatar'} roundedCircle className="avatar-image" />
                    <label htmlFor="avatar-upload" className="avatar-upload-label">
                        <FaCamera className="camera-icon" />
                    </label>
                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="avatar-upload-input"
                        style={{ display: 'none' }}
                    />
                </div>

                <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </Button>
            </Form>
        </div>
    );
};

export default Profile;
