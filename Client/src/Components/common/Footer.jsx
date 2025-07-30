import React from 'react';
import '../../Styles/Footer.css';
import Logo from '../../Assets/logo1.png'; 
import Box from '@mui/material/Box';

const Footer = () => {
  return (
    <footer className="detailed-footer">
      <div className="footer-container">
        {/* Logo & Description */}
        <div className="footer-section">
          {/* <h2 className="footer-logo">🩸 Blood Connect</h2> */}
          <Box
  component="img"
  src={Logo}
  alt="Logo"
  sx={{
    height: { xs: 60, md: 100 },   // Increased height
    width: { xs: 'auto', md: 150 }, // Optional: set width explicitly or auto
    mr: 2,
    transition: 'transform 0.3s ease',
    display: { xs: 'none', md: 'flex' }
  }}
/>

          <p>Your one-stop platform to find or become a blood donor. Every drop saves a life.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="http://localhost:5173/blood_donor/">Home</a></li>
            <li><a href="http://localhost:5173/blood_donor/register">Register</a></li>
            <li><a href="http://localhost:5173/blood_donor/about">About Us</a></li>
            <li><a href="http://localhost:5173/blood_donor/ContactUs">Contact Us</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: support@bloodconnect.org</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123 Red Cross Street, India</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Blood Donor Availability System. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
