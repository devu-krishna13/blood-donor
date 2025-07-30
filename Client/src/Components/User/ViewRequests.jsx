import React, { useState, useEffect } from 'react';
import '../../Styles/TableStyle.css';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Typography,
  CircularProgress
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import UserNav from './UserNav';
import UserSideMenu from './UserSideMenu';
import axiosInstance from '../Service/BaseUrl';

const getBloodTypeStyle = (bloodType) => {
  const baseStyle = {
    fontWeight: 'bold',
    padding: '2px 4px',
    borderRadius: '6px',
    display: 'inline-block',
    minWidth: '36px',
    textAlign: 'center',
    fontSize: '0.85rem'
  };

  switch (bloodType) {
    case "A+": return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFEBEB" };
    case "A-": return { ...baseStyle, color: "#D32F2F", backgroundColor: "#FFD5D5" };
    case "B+": return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#DBF0FF" };
    case "B-": return { ...baseStyle, color: "#2F8FD3", backgroundColor: "#C4E4FF" };
    case "AB+": return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#E9DDFF" };
    case "AB-": return { ...baseStyle, color: "#6B2FD3", backgroundColor: "#D8C7FF" };
    case "O+": return { ...baseStyle, color: "#D32F84", backgroundColor: "#FFD9ED" };
    case "O-": return { ...baseStyle, color: "#ADD32F", backgroundColor: "#F3FFCA" };
    default: return { ...baseStyle, color: "#666", backgroundColor: "#f0f0f0" };
  }
};

function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const USERID = localStorage.getItem('UserId');
    if (!USERID) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    axiosInstance.get(`/ShowRequestUser/${USERID}`)
      .then(response => {
        const filtered = response.data.filter(request =>
          request.IsDoner === "Pending" && request.IsHospital === "Pending"
        );
        setRequests(filtered);
        setFilteredRequests(filtered);
        setLoading(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 404) {
          setRequests([]);
          setFilteredRequests([]);
        } else {
          setError(error.message || 'Failed to fetch blood requests');
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRequests(requests);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      const filtered = requests.filter(request =>
        request.PatientName.toLowerCase().includes(lowerSearch) ||
        String(request.ContactNumber).toLowerCase().includes(lowerSearch) ||
        request.Status.toLowerCase().includes(lowerSearch) ||
        request.BloodType?.toLowerCase().includes(lowerSearch)
      );
      setFilteredRequests(filtered);
    }
  }, [searchTerm, requests]);

  const getStatusIndicator = (status) => {
    switch (status) {
      case "Planned": return <span className="status-indicator status-pending"></span>;
      case "Very Urgent": return <span className="status-indicator status-urgent"></span>;
      case "Emergency": return <span className="status-indicator status-emergency"></span>;
      case "Fulfilled": return <span className="status-indicator status-fulfilled"></span>;
      default: return <span className="status-indicator status-pending"></span>;
    }
  };

  const formatBloodType = (bloodType) => {
    if (!bloodType) return '';
    const parts = bloodType.split('(');
    return parts.length > 1 ? parts[1].replace(')', '').trim() : bloodType;
  };

  if (loading) {
    return (
      <Box className="main-container">
        <UserNav onSearch={setSearchTerm} />
        <Box className="sidemenu">
          <UserSideMenu />
          <Box className="content-box" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress size={60} />
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="main-container">
      <UserNav onSearch={setSearchTerm} />
      <ToastContainer position="top-right" autoClose={5000} />
      <Box className="sidemenu">
        <UserSideMenu />
        <Box className="content-box">
          <Typography variant="h4" className="title">Pending Blood Requests</Typography>
          <Typography variant="h5" className="sub-title">Requests awaiting donor and hospital approval</Typography>
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="emergency requests table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">Contact Number</TableCell>
                  <TableCell className="table-head-cell">Blood Type</TableCell>
                  <TableCell className="table-head-cell">Units</TableCell>
                  <TableCell className="table-head-cell">Status</TableCell>
                  <TableCell className="table-head-cell">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => {
                    const formattedBloodType = formatBloodType(request.BloodType);
                    const bloodTypeStyle = getBloodTypeStyle(formattedBloodType);
                    return (
                      <TableRow key={request._id} hover>
                        <TableCell>{request.PatientName}</TableCell>
                        <TableCell>{String(request.ContactNumber)}</TableCell>
                        <TableCell>
                          <Box sx={bloodTypeStyle}>{formattedBloodType}</Box>
                        </TableCell>
                        <TableCell>{request.UnitsRequired} {request.UnitsRequired === 1 ? 'Unit' : 'Units'}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                            {getStatusIndicator(request.Status)} {request.Status}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', justifyContent: "center" }}>
                            <Link to={`/user-edit-request/${request._id}`}>
                              <Button variant="contained" color="success" size="small">Edit</Button>
                            </Link>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ height: '300px' }}>
                      <Typography variant="h6" color="textSecondary">
                        {error === "Request failed with status code 404" ? `No pending blood requests found` :
                          (searchTerm ? 'No matching requests found' : 'No pending blood requests found')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
}

export default ViewRequests;
