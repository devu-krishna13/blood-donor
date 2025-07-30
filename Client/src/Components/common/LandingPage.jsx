import React, { useState, useRef } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // Import ScrollTrigger
import { useGSAP } from "@gsap/react";
import Nav from './Nav'; 
import '../../Styles/LandingPage.css'; 
import { Button, Box, Fab, IconButton, Typography } from '@mui/material'; 
import ChatIcon from '@mui/icons-material/Chat'; 
import CloseIcon from '@mui/icons-material/Close'; 
import image from '../../Assets/Blood.png';
import { Link } from 'react-router-dom';
import BloodDonation from '../../Assets/donation.jpg';
import image2 from '../../Assets/5299507.jpg';
import image3 from '../../Assets/image-donatio.jpg';
import ChatBot from '../ChatBot';
import Footer from './Footer';

// Register the GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

function LandingPage() {
    const [showChatBot, setShowChatBot] = useState(false);
    
    const mainContainer = useRef(null);
    const chatBotContainer = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.from('.blood-image', { x: -100, opacity: 0, duration: 1, ease: 'power3.out' })
          .from('.welcome-title', { y: 50, opacity: 0, duration: 0.8, ease: 'power2.out' }, "-=0.7")
          .from('.welcome-text', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' }, "-=0.6")
          .from('.register-button', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' }, "-=0.4");

        const sections = gsap.utils.toArray('.info-section');
        sections.forEach((section) => {
            const image = section.querySelector('.info-section-image-container');
            const content = section.querySelector('.info-section-content');
            const isReversed = section.classList.contains('reverse');

            const sectionTl = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none reverse", 
                }
            });
            
            sectionTl.from(content, { 
                y: 50, 
                opacity: 0, 
                duration: 0.8, 
                ease: 'power2.out' 
            });

            if (image) {
                sectionTl.from(image, { 
                    x: isReversed ? -100 : 100, 
                    opacity: 0, 
                    duration: 1, 
                    ease: 'power3.out' 
                }, "-=0.6"); 
            }
        });

    }, { scope: mainContainer });

    useGSAP(() => {
        if (showChatBot) {
            gsap.to(chatBotContainer.current, {
                y: 0, opacity: 1, display: 'flex', duration: 0.5, ease: 'power3.out'
            });
        } else {
            gsap.to(chatBotContainer.current, {
                y: 100, opacity: 0, duration: 0.4, ease: 'power3.in',
                onComplete: () => gsap.set(chatBotContainer.current, { display: 'none' })
            });
        }
    }, [showChatBot]);

    const handleToggleChatBot = () => {
        setShowChatBot(!showChatBot);
    };

    return (
        <div ref={mainContainer}> 
            <Nav />
            <div className='landing-container'>
                <div className='image-container'>
                    <img src={image} alt="Blood donation" className='blood-image' />
                </div>
                <div className='welcome-container'>
                    <h1 className='welcome-title'>
                        Welcome to Blood <br />
                        Donation Portal
                    </h1>
                    <p className='welcome-text'>
                        Your donation can be the lifeline someone desperately needs. Join us in making a difference 🩸 one drop at a time!
                    </p>
                    <Link to='/register' style={{ textDecoration: 'none' }}>
                        <Button variant="contained" color="primary" className='register-button'>
                            Sign up
                        </Button>
                    </Link>
                </div>
            </div>

            <div className='info-section'>
                <div className='info-section-content'>
                    <h2 className='info-section-title'>Why Your Donation <br />Matters So Much</h2>
                    <p className='info-section-text'>Every two seconds, someone in the U.S. needs blood. From emergency situations to ongoing medical treatments for chronic illnesses, blood donations are a constant necessity. Your decision to donate can directly impact patients facing trauma, surgeries, chronic illnesses, and more. It's a simple act with profound implications for individuals and families in crisis.</p>
                </div>
                <div className='info-section-image-container'>
                    <img src={BloodDonation} alt="Impact of blood donation" className='info-section-image' />
                </div>
            </div>

            <div className='info-section reverse'>
                <div className='info-section-content'>
                    <h2 className='info-section-title'>Where Does Your <br />Precious Gift Go?</h2>
                    <p className='info-section-text'>Your generous blood donation is meticulously separated into its vital components: red cells, plasma, and platelets. Each component serves a unique, critical purpose. Red cells are used for anemia, plasma for burn victims and clotting disorders, and platelets are crucial for cancer patients and others with bleeding issues. Learn more about how your single donation makes a multifaceted difference.</p>
                </div>
                <div className='info-section-image-container'>
                    <img src={image2} alt="Blood components and uses" className='info-section-image' />
                </div>
            </div>

            <div className='info-section'>
                <div className='info-section-content'>
                    <h2 className='info-section-title'>Your Easy Path to <br />Lifesaving</h2>
                    <p className='info-section-text'>Donating blood is a straightforward process designed for your comfort and safety. It typically involves a quick registration, a confidential health screening, the donation itself (usually 8-10 minutes for whole blood), and a short recovery time with refreshments. Our dedicated team ensures a smooth and positive experience, making it easy for you to make an extraordinary difference.</p>
                </div>
                <div className='info-section-image-container'>
                    <img src={image3} alt="Steps of blood donation process" className='info-section-image' />
                </div>
            </div>

            <div className='info-section full-width-text'>
                <div className='info-section-content'>
                    <h2 className='info-section-title'>Committed to Community Health</h2>
                    <p className='info-section-text'>At the Blood Donation Portal, our mission is to connect generous donors with patients in urgent need. We are dedicated to creating a seamless, secure, and encouraging environment for blood donation, fostering a healthier and more resilient community for all. Your involvement helps us build a stronger future, one life-saving donation at a time.</p>
                </div>
            </div>

            <Fab
                aria-label="chat"
                sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1100, color: "red" }}
                onClick={handleToggleChatBot}
            >
                <ChatIcon />
            </Fab>

            <Box
                ref={chatBotContainer}
                sx={{
                    position: 'fixed', bottom: 90, right: 24,
                    width: { xs: '90%', sm: 380 }, height: '75vh', maxHeight: 600, 
                    zIndex: 1000, backgroundColor: 'background.paper', borderRadius: 3, boxShadow: 6, 
                    display: 'none', flexDirection: 'column', opacity: 0,
                }}
            >
                <Box sx={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2,
                    borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#d32f2f', 
                    color: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12,
                }}>
                    <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>BDAS CHAT BOT</Typography>
                    <IconButton aria-label="close chat" onClick={() => setShowChatBot(false)} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}> 
                    <ChatBot />
                </Box>
            </Box>
            <Footer />
        </div>
        
    );
}

export default LandingPage;