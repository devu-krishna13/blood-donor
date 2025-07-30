import React, { useEffect, useState } from 'react';
import AdminNav from './AdminNav';
import AdSidemenu from './AdSidemenu';
import '../../Styles/TableStyle.css';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar
} from '@mui/material';
import axiosInstance from '../Service/BaseUrl';
import { baseUrl } from '../../baseUrl';

function HospitalReqt() {
  const [hospital, setHospital] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [documentError, setDocumentError] = useState(null);

  useEffect(() => {
    axiosInstance.post('/viewAllHos')
      .then((result) => {
        const pendingHospitals = result.data.data.filter(
          hospital => hospital.isAdminApprove === false
        );
        setHospital(pendingHospitals);
        setFilteredHospitals(pendingHospitals);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredHospitals(hospital);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = hospital.filter(h => {
        const name = h.FullName ? h.FullName.toString().toLowerCase() : '';
        const regNumber = h.RegistrationNumber ? h.RegistrationNumber.toString().toLowerCase() : '';
        const phone = h.PhoneNo ? h.PhoneNo.toString().toLowerCase() : '';
        const email = h.Email ? h.Email.toString().toLowerCase() : '';
        const city = h.City ? h.City.toString().toLowerCase() : '';

        return (
          name.includes(lowercasedSearch) ||
          regNumber.includes(lowercasedSearch) ||
          phone.includes(lowercasedSearch) ||
          email.includes(lowercasedSearch) ||
          city.includes(lowercasedSearch)
        );
      });
      setFilteredHospitals(filtered);
    }
  }, [searchTerm, hospital]);

  const handleApprove = (hospitalId) => {
    axiosInstance.post('/hospitalApprove', { id: hospitalId })
      .then((result) => {
        console.log(result);
        setHospital(prevHospitals => prevHospitals.filter(hospital => hospital._id !== hospitalId));
        setFilteredHospitals(prevHospitals => prevHospitals.filter(hospital => hospital._id !== hospitalId));
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  const handleReject = (hospitalId) => {
    axiosInstance.post('/hospitalReject', { id: hospitalId })
      .then((result) => {
        console.log(result);
        setHospital(prevHospitals => prevHospitals.filter(hospital => hospital._id !== hospitalId));
        setFilteredHospitals(prevHospitals => prevHospitals.filter(hospital => hospital._id !== hospitalId));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOpenDocument = (document) => {
    setIsLoadingDocument(true);
    setDocumentError(null);
    setSelectedDocument(document);
    setOpenDocumentDialog(true);
  };

  const handleCloseDocument = () => {
    setOpenDocumentDialog(false);
  };

  const getProfilePhotoUrl = (hospital) => {
    return hospital?.ProfilePhoto?.filename 
      ? `${baseUrl}${hospital.ProfilePhoto.filename}`
      : null;
  };

  if (loading) {
    return (
      <Box className="main-container">
        <AdSidemenu />
        <Box className="sidemenu">
          <AdminNav />
          <Box className="content-box">
            <Typography variant="h4" className="title">
              Hospital Management
            </Typography>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight="60vh"
            >
              <CircularProgress size={60} />
              <Typography variant="h6" mt={2}>
                Loading hospital requests...
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="main-container">
        <AdSidemenu />
        <Box className="sidemenu">
          <AdminNav />
          <Box className="content-box">
            <Typography variant="h4" className="title">
              Hospital Management
            </Typography>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              minHeight="60vh"
            >
              <Typography color="error" variant="h6">
                Error: {error}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="main-container">
      <AdSidemenu />
      <Box className="sidemenu">
        <AdminNav onSearch={setSearchTerm} />
        <Box className="content-box">
          <Typography variant="h4" className="title">
            Hospital Management
          </Typography>
          <Typography variant="h5" className="sub-title">
            Pending Hospital Requests
          </Typography>
          <TableContainer component={Paper} className="table-container">
            <Table aria-label="hospital requests table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Profile</TableCell>
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">Req. Number</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Email</TableCell>
                  <TableCell className="table-head-cell">City</TableCell>
                  <TableCell className="table-head-cell">Operating Hours</TableCell>
                  <TableCell className="table-head-cell">Document</TableCell>
                  <TableCell className="table-head-cell">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map((hospital) => (
                    <TableRow key={hospital._id}>
                      <TableCell className='tableCell'>
                        <Avatar
                          alt={hospital.FullName}
                          src={getProfilePhotoUrl(hospital)}
                          sx={{ width: 40, height: 40 }}
                        />
                      </TableCell>
                      <TableCell className='tableCell'>{hospital.FullName}</TableCell>
                      <TableCell className='tableCell'>{hospital.RegistrationNumber}</TableCell>
                      <TableCell className='tableCell'>{hospital.PhoneNo}</TableCell>
                      <TableCell className='tableCell'>{hospital.Email}</TableCell>
                      <TableCell className='tableCell'>{hospital.City}</TableCell>
                      <TableCell className='tableCell'>{hospital.OpeningTime} - {hospital.ClosingTime}</TableCell>
                      <TableCell className='tableCell'>
                        {hospital.Document?.path ? (
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleOpenDocument(hospital.Document)}
                          >
                            View
                          </Button>
                        ) : "N/A"}
                      </TableCell>
                      <TableCell className="action-buttons">
                        <Button 
                          variant="contained" 
                          color="success" 
                          size="small" 
                          className="action-button"
                          onClick={() => handleApprove(hospital._id)}
                        >
                          Approve
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          size="small" 
                          className="action-button"
                          onClick={() => handleReject(hospital._id)}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" className="tableCell">
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center" 
                        height="200px"
                      >
                        <Typography variant="h6" color="textSecondary">
                          {searchTerm ? 'No matching hospitals found' : 'No pending hospital requests'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Document Viewer Dialog */}
          <Dialog
            open={openDocumentDialog}
            onClose={handleCloseDocument}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle>
              Hospital Document - {selectedDocument?.filename || "Unknown"}
            </DialogTitle>
            <DialogContent>
              {isLoadingDocument && (
                <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                  <CircularProgress />
                </Box>
              )}
              {documentError && (
                <Typography color="error" align="center">
                  {documentError}
                </Typography>
              )}
              
              {selectedDocument?.mimetype?.includes('image') ? (
                <img 
                  src={`${baseUrl}${selectedDocument.filename}`} 
                  alt="Hospital Document" 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    display: isLoadingDocument ? 'none' : 'block' 
                  }}
                  onLoad={() => setIsLoadingDocument(false)}
                  onError={() => {
                    setIsLoadingDocument(false);
                    setDocumentError('Failed to load image');
                  }}
                />
              ) : (
                <iframe 
                  src={`${baseUrl}${selectedDocument?.filename}`} 
                  style={{ 
                    width: '100%', 
                    height: '500px', 
                    border: 'none',
                    display: isLoadingDocument ? 'none' : 'block' 
                  }}
                  title="Hospital Document"
                  onLoad={() => setIsLoadingDocument(false)}
                  onError={() => {
                    setIsLoadingDocument(false);
                    setDocumentError('Failed to load document');
                  }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDocument}>Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
}

export default HospitalReqt;