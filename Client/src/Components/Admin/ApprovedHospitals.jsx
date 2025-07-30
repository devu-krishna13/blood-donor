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
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar
} from '@mui/material';
import axiosInstance from '../Service/BaseUrl';
import { baseUrl } from '../../baseUrl';

function ApprovedHospitals() {
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
    setLoading(true);
    axiosInstance.post('/viewAllHos')
      .then((result) => {
        const approvedHospitals = result.data.data.filter(
          hospital => hospital.isAdminApprove === true
        );
        setHospital(approvedHospitals);
        setFilteredHospitals(approvedHospitals);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hospitals:', error);
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
          <AdminNav onSearch={setSearchTerm} />
          <Box className="content-box" sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh' 
          }}>
            <CircularProgress size={60} />
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
          <AdminNav onSearch={setSearchTerm} />
          <Box className="content-box" sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '70vh' 
          }}>
            <Typography color="error">Error: {error}</Typography>
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
            Approved Hospitals
          </Typography>
          <TableContainer className="table-container">
            <Table aria-label="approved hospitals table">
              <TableHead>
                <TableRow className="table-head-row">
                  <TableCell className="table-head-cell">Profile</TableCell>
                  <TableCell className="table-head-cell">Name</TableCell>
                  <TableCell className="table-head-cell">Registration Number</TableCell>
                  <TableCell className="table-head-cell">Contact</TableCell>
                  <TableCell className="table-head-cell">Email</TableCell>
                  <TableCell className="table-head-cell">City</TableCell>
                  <TableCell className="table-head-cell">Operating Hours</TableCell>
                  <TableCell className="table-head-cell">Document</TableCell>
                  {/* <TableCell className="table-head-cell">Status</TableCell> */}
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
                      {/* <TableCell className='tableCell-approved'>Approved</TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ height: '300px' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%' 
                      }}>
                        <Typography variant="h6" color="textSecondary">
                          {searchTerm ? 'No matching hospitals found' : 'No approved hospitals available'}
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

export default ApprovedHospitals;