import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import '../../Styles/HospitalInfo.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import axiosInstance from '../Service/BaseUrl';

function HospitalInfo() {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state || {};

    const [hospital, setHospital] = useState({
        ...formData,
        OpeningTime: "",
        ClosingTime: "",
        document: null
    });

    const [showPassword, setShowPassword] = useState(false);
    const [documentFileName, setDocumentFileName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospital(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setHospital(prev => ({ ...prev, document: file }));
        setDocumentFileName(file ? file.name : '');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async () => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(hospital.OpeningTime) || !timeRegex.test(hospital.ClosingTime)) {
            toast.error("Invalid time format. Please use HH:MM (24-hour format)");
            return;
        }

        if (!hospital.document) {
            toast.error("Please upload a document for verification");
            return;
        }

        const formDataToSend = new FormData();

        Object.keys(hospital).forEach(key => {
            if (hospital[key] !== null && hospital[key] !== undefined) {
                if (key === 'document') {
                    formDataToSend.append('Document', hospital.document);
                } else if (key === 'ProfilePhoto') {
                    if (hospital.ProfilePhoto instanceof File) {
                        formDataToSend.append('ProfilePhoto', hospital.ProfilePhoto);
                    } else {
                        formDataToSend.append('ProfilePhoto', hospital.ProfilePhoto);
                    }
                } else {
                    formDataToSend.append(key, hospital[key]);
                }
            }
        });


        console.log('Submitting hospital data (state values):', hospital);

        try {
            const response = await axiosInstance.post('/hospital-registration', formDataToSend);
            const { message } = response.data;

            if (response.status === 201 && message === "Registration successful") {
                toast.success('Registration successful!');
                setTimeout(() => navigate('/hosLogin'), 2000);
            } else {
                if (message === "Email already exists" ||
                    message === "Phone number already exists" ||
                    message === "Registration number already exists") {
                    toast.error(message);
                    setTimeout(() => navigate('/register'), 2000);
                } else {
                    toast.error('Registration failed. Please try again.');
                }
            }
        } catch (error) {
            console.error("Registration error:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                if (error.response.data.message.includes("exists")) {
                    setTimeout(() => navigate('/register'), 2000);
                }
            } else {
                toast.error('An unexpected error occurred during registration. Please try again.');
            }
        }
    };

    // Helper function to truncate the file name
    const getDisplayedFileName = (name) => {
        const maxLength = 20;
        if (name.length > maxLength) {
            return name.substring(0, maxLength) + '...';
        }
        return name;
    };

    return (
        <div className='main-hos-reg-container'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className='hospitalInfo-container'>
                <h2>Blood Bank Registration</h2>

                <p className='hospitalInfo-title'>Operating Hours</p>
                <div className='hospitalInfo-row'>
                    <TextField
                        name="OpeningTime"
                        label="Opening Time"
                        placeholder="HH:MM"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        className="hospitalInfo-textField"
                        value={hospital.OpeningTime}
                        onChange={handleChange}
                    />
                    <TextField
                        name="ClosingTime"
                        label="Closing Time"
                        placeholder="HH:MM"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        size="small"
                        className="hospitalInfo-textField"
                        value={hospital.ClosingTime}
                        onChange={handleChange}
                    />
                </div>

                <div className='hospitalInfo-uploadContainer'>
                    <p className='hospitalInfo-title'>Document Verification</p>
                    <input
                        type="file"
                        id="document-upload"
                        className='hospitalInfo-fileUpload'
                        style={{ display: 'none' }}
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        required
                    />
                    <label htmlFor="document-upload" className='hospitalInfo-uploadLabel'>
                        {documentFileName ? 'Change Document' : 'Upload Document'}
                    </label>
                    {documentFileName && (
                        <Typography variant="body2" className="hospitalInfo-fileInputDisplay">
                            Selected file: <strong>{getDisplayedFileName(documentFileName)}</strong>
                        </Typography>
                    )}
                </div>

                <div className='hospitalInfo-pass'>
                    <TextField
                        label="Password (Read-Only)"
                        type={showPassword ? "text" : "password"}
                        variant="outlined"
                        size="small"
                        className="hospitalInfo-textField"
                        value={hospital.Password || ''}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={togglePasswordVisibility}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>

                <div className='hospitalInfo-buttonContainer'>
                    <Button
                        variant="contained"
                        color="primary"
                        className='hospitalInfo-button'
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HospitalInfo;