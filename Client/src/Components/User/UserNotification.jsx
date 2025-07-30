import React, { useState, useEffect } from 'react';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import '../../Styles/Notification.css';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../Service/BaseUrl';

function UserNotification() {
    const USERID = localStorage.getItem("UserId");
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedDonorNotification, setExpandedDonorNotification] = useState(null);
    const [expandedHospitalNotification, setExpandedHospitalNotification] = useState(null);

    useEffect(() => {
        if (!USERID) {
            toast.error('User ID not found');
            setLoading(false);
            return;
        }

        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get(`/ShowRequestUser/${USERID}`);
                const requests = response.data;
                console.log("Fetched Requests:", requests);

                const notificationList = requests.flatMap(request => {
                    if (request.ReadbyUser !== "Pending") {
                        return []; 
                    }

                    const generatedNotifications = [];

                    const fulfilledDonations = request.AcceptedByDoner?.filter(
                        d => d.donationStatus === "Fulfilled"
                    ) || [];

                    if (fulfilledDonations.length > 0) {
                        fulfilledDonations.forEach(donation => {
                            generatedNotifications.push({
                                id: `${request._id}-${donation.donerId._id}`,
                                originalRequestId: request._id, 
                                message: `Blood donation for ${request.PatientName} has been fulfilled by donor ${donation.donerId.FullName}.`,
                                date: new Date(donation.AccepteddAt).toLocaleString(),
                                requestData: request,
                                donorDetails: donation.donerId,
                                donationInfo: donation, 
                                hasDonorInfo: true,
                                hospitalDetails: null,
                                hasHospitalInfo: false,
                            });
                        });
                    }

                    if (request.IsHospital === "Approved" && request.AcceptedBy?.FullName) {
                         generatedNotifications.push({
                            id: `${request._id}-hospital`,
                            originalRequestId: request._id,
                            message: `Hospital ${request.AcceptedBy.FullName} has approved your blood request for ${request.PatientName}.`,
                            date: new Date(request.HospitalApprovedAt || request.createdAt).toLocaleString(),
                            requestData: request,
                            donorDetails: null,
                            hasDonorInfo: false,
                            hospitalDetails: request.AcceptedBy,
                            hasHospitalInfo: true,
                        });
                    }
                    
                    if (generatedNotifications.length === 0) {
                        if (request.IsDoner === "Accepted") {
                            generatedNotifications.push({
                                id: request._id,
                                originalRequestId: request._id,
                                message: `A donor has accepted your blood request for ${request.PatientName}.`,
                                date: new Date(request.createdAt).toLocaleDateString(),
                                requestData: request,
                                hasDonorInfo: false,
                                hasHospitalInfo: false,
                            });
                        }
                    }

                    return generatedNotifications;
                });

                console.log("Generated Notifications:", notificationList);

                setNotifications(notificationList);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                toast.error('Failed to load notifications');
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [USERID]);

    const markAsRead = async (originalRequestId) => {
        try {
            await axiosInstance.patch(`/notifications/${originalRequestId}/user-read`);

            setNotifications(prevNotifications =>
                prevNotifications.filter(notification => notification.originalRequestId !== originalRequestId)
            );

            toast.success('Notification marked as read');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Failed to mark notification as read');
        }
    };

    const toggleDonorDetails = (id) => {
        setExpandedDonorNotification(expandedDonorNotification === id ? null : id);
        if (expandedDonorNotification !== id) setExpandedHospitalNotification(null);
    };

    const toggleHospitalDetails = (id) => {
        setExpandedHospitalNotification(expandedHospitalNotification === id ? null : id);
        if (expandedHospitalNotification !== id) setExpandedDonorNotification(null);
    };

    if (loading) {
        return (
            <div className="admin-layout">
                <UserNav />
                <UserSideMenu />
                <div className="notification-content">
                    <h1 className="notification-title">Notification</h1>
                    <p>Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <UserNav />
            <UserSideMenu />
            <div className="notification-content">
                <h1 className="notification-title"> Notifications</h1>
                <div className="notification-list">
                    {notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id} 
                                className="notification-card unread"
                            >
                                <p className="notification-message">{notification.message}</p>
                                <p className="notification-date">
                                    <strong>Date:</strong> {notification.date}
                                </p>

                                {notification.hasDonorInfo && (
                                    <>
                                        <button
                                            className="view-details-btn donor-btn"
                                            onClick={() => toggleDonorDetails(notification.id)}
                                        >
                                            {expandedDonorNotification === notification.id
                                                ? 'Hide Donor Details' : 'View Donor Details'}
                                        </button>

                                        {expandedDonorNotification === notification.id && (
                                            <div className="details-card donor-details">
                                                <h4>Donor Information:</h4>
                                                <p><strong>Name:</strong> {notification.donorDetails.FullName}</p>
                                                <p><strong>Contact:</strong> {notification.donorDetails.PhoneNo}</p>
                                                <p><strong>Blood Group:</strong> {notification.donorDetails.bloodgrp}</p>
                                                <p><strong>Location:</strong> {notification.donorDetails.City}, {notification.donorDetails.District}</p>
                                                <p><strong>Donation Fulfilled On:</strong> {new Date(notification.donationInfo.AccepteddAt).toLocaleString()}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {notification.hasHospitalInfo && (
                                    <>
                                        <button
                                            className="view-details-btn hospital-btn"
                                            onClick={() => toggleHospitalDetails(notification.id)}
                                        >
                                            {expandedHospitalNotification === notification.id
                                                ? 'Hide Hospital Details' : 'View Hospital Details'}
                                        </button>

                                        {expandedHospitalNotification === notification.id && (
                                            <div className="details-card hospital-details">
                                                <h4>Hospital Information:</h4>
                                                <p><strong>Name:</strong> {notification.hospitalDetails.FullName}</p>
                                                <p><strong>Contact:</strong> {notification.hospitalDetails.PhoneNo}</p>
                                                <p><strong>Email:</strong> {notification.hospitalDetails.Email}</p>
                                                <p><strong>Address:</strong> {`${notification.hospitalDetails.Address}, ${notification.hospitalDetails.Street}, ${notification.hospitalDetails.City} - ${notification.hospitalDetails.Pincode}`}</p>
                                                <p><strong>Registration No:</strong> {notification.hospitalDetails.RegistrationNumber}</p>
                                                {notification.requestData.HospitalApprovedAt && (
                                                    <p><strong>Approved On:</strong> {new Date(notification.requestData.HospitalApprovedAt).toLocaleString()}</p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                <div className="notification-actions">
                                    <button
                                        className="action-button mark-read"
                                        onClick={() => markAsRead(notification.originalRequestId)}
                                    >
                                        <CheckIcon />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ display: 'flex', justifyContent: "center", alignItems: "center" }}>
                            <h3 className="no-notifications">No pending notifications found</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UserNotification;