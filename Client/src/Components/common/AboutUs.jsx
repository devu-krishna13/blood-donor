import React, { useState, useRef } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Nav from './Nav';
import '../../Styles/AboutUs.css';
import imageBlood from '../../Assets/imageBlood.jpg';
import Clinic from '../../Assets/clinic.jpg';
import { Box, Fab, IconButton, Typography } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ChatBot from '../ChatBot';
import Footer from './Footer';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function AboutUs() {
  const [showChatBot, setShowChatBot] = useState(false);
  const mainContainer = useRef(null);
  const chatBotContainer = useRef(null);

  useGSAP(() => {
    const heroTl = gsap.timeline();
    heroTl.from('.about-us-hero-text h1', { y: 50, opacity: 0, duration: 1, ease: 'power3.out' })
          .from('.about-us-hero-text p', { y: 30, opacity: 0, duration: 1, ease: 'power2.out' }, "-=0.7");

    const sections = gsap.utils.toArray('.about-section');
    sections.forEach((section) => {
        const image = section.querySelector('.about-image-container');
        const content = section.querySelector('.about-content');
        const isReversed = section.classList.contains('reverse');

        const sectionTl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none reverse",
            }
        });
        
        sectionTl.from(content, { y: 50, opacity: 0, duration: 0.8, ease: 'power2.out' });

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
            y: 0, opacity: 1, display: 'flex', duration: 0.5, ease: 'power3.out',
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
      <Nav/>
      <div className='about-us-hero-container'>
        <div className='about-us-hero-text'>
          <h1>Giving Blood, Giving Life - Every Drop Counts!</h1>
          <p>
            At Blood Donor Availability System, we're dedicated to ensuring no life is lost due to blood scarcity.
            Discover our commitment to connecting donors with urgent needs.
          </p>
        </div>
      </div>

      <section className='about-section'>
        <div className='about-content'>
          <h2>Our Mission</h2>
          <p>At <strong>Blood Donor Availability System</strong>, our mission is to revolutionize blood donation and availability by providing a seamless, real-time platform that connects volunteer blood donors with patients in critical need. We strive to reduce response times, optimize blood supply management, and ultimately, save lives by ensuring that the right blood type is available at the right place and time. We believe in harnessing technology to foster a stronger, healthier community.</p>
        </div>
        <div className='about-image-container'>
            <img src={imageBlood} alt="Our Mission" className='about-image' />
        </div>
      </section>

      <section className='about-section reverse'>
        <div className='about-content'>
          <h2>Our Vision</h2>
          <p>We envision a future where no life is lost due to the unavailability of blood. Through technology, community engagement, and unwavering dedication, we aim to build a robust, self-sustaining blood donation ecosystem that fosters a culture of generosity and preparedness, making every community resilient to blood shortages. Our goal is to be the most trusted and efficient blood donation network globally.</p>
        </div>
        <div className='about-image-container'>
            <img src={Clinic} alt="Our Vision" className='about-image' />
        </div>
      </section>

      <section className='about-section center-content'>
        <div className='about-content'>
          <h2>Why Blood Donor Availability System ?</h2>
          <p>Blood transfusions are critical for countless medical procedures, emergencies, and chronic conditions. However, finding compatible blood quickly can be a significant challenge, especially in urgent situations. Traditional methods often suffer from delays and inefficiencies, leading to preventable losses.</p>
          <p><strong>Blood Donor Availability System</strong> addresses these critical challenges head-on by providing a dynamic, user-friendly platform that streamlines the entire process. We make it faster and more reliable to find donors when every second counts, ensuring healthcare providers have immediate access to life-saving blood and that donors can contribute effortlessly and safely.</p>
        </div>
      </section>

      <section className='about-section full-width-text'>
        <div className='about-content'>
          <h2>Join Our Cause</h2>
          <p><strong>Blood Donor Availability System</strong> is more than just a platform; it's a movement built on compassion, community spirit, and the shared belief that every life is precious. We invite you to be a part of this vital network. Whether you are a potential blood donor, a healthcare professional, a community organizer, or simply someone who believes in making a difference, your support can amplify our impact.</p>
          <p>Explore our site, register as a donor, or contact us to learn how you can contribute to a healthier, more resilient community. Together, we can ensure a steady flow of life-saving blood for those who need it most.</p>
        </div>
      </section>

      {/* <p className='copy-right'>© 2025 Blood Donor Availability System. All Rights Reserved </p> */}

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
          position: 'fixed',
          bottom: 90, 
          right: 24,
          width: { xs: '90%', sm: 380 }, 
          height: '75vh', 
          maxHeight: 600, 
          zIndex: 1000, 
          backgroundColor: 'background.paper', 
          borderRadius: 3, 
          boxShadow: 6, 
          display: 'none',
          flexDirection: 'column',
          opacity: 0,
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: '#d32f2f', 
          color: 'white', 
          borderTopLeftRadius: 12, 
          borderTopRightRadius: 12,
        }}>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>BDAS CHAT BOT</Typography> 
          <IconButton
            aria-label="close chat"
            onClick={() => setShowChatBot(false)}
            sx={{ color: 'white' }} 
          >
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

export default AboutUs;