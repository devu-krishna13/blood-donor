import React from 'react';
import '../../Styles/AboutUs.css'; // Make sure this path is correct
import imageBlood from '../../Assets/imageBlood.jpg'
import Clinic from '../../Assets/clinic.jpg'
import DonerNav from './DonerNav'
import DonerSideMenu from './DonerSideMenu'
// --- NEW: Placeholder images for About Us sections ---
// In a real application, you would add these images to your Assets folder
// For demonstration, I'm using placeholder URLs.
const missionImage = 'https://via.placeholder.com/600x400/1e88e5/FFFFFF?text=Our+Mission';
const visionImage = 'https://via.placeholder.com/600x400/43a047/FFFFFF?text=Our+Vision';
const howItWorksImage = 'https://via.placeholder.com/600x400/d84315/FFFFFF?text=How+It+Works';
const whyLifeflowImage = 'https://via.placeholder.com/600x400/546e7a/FFFFFF?text=Why+LifeFlow';


function DonerAboutUs() {
  return (
    <div>
      <DonerNav/> {/* Nav should typically be at the top level outside other containers if it's fixed/sticky */}
<DonerSideMenu/>
      {/* Existing Hero Section - Renamed for clarity */}
      <div className='about-us-hero-container'>
        <div className='about-us-hero-text'>
          <h1>Giving Blood, Giving Life - Every Drop Counts!</h1>
          <p>
            At Blood Donor Availability System, we're dedicated to ensuring no life is lost due to blood scarcity.
            Discover our commitment to connecting donors with urgent needs.
          </p>
        </div>
      </div>

      {/* New Section: Our Mission */}
      <section className='about-section'>
        <div className='about-content'>
          <h2>Our Mission</h2>
          <p>
            At <strong>Blood Donor Availability System</strong>, our mission is to revolutionize blood donation and availability by providing a seamless, real-time platform that connects volunteer blood donors with patients in critical need. We strive to reduce response times, optimize blood supply management, and ultimately, save lives by ensuring that the right blood type is available at the right place and time. We believe in harnessing technology to foster a stronger, healthier community.
          </p>
        </div>
        <div className='about-image-container'>
            <img src={imageBlood} alt="Our Mission" className='about-image' />
        </div>
      </section>

      {/* New Section: Our Vision (reversed layout) */}
      <section className='about-section reverse'>
        <div className='about-content'>
          <h2>Our Vision</h2>
          <p>
            We envision a future where no life is lost due to the unavailability of blood. Through technology, community engagement, and unwavering dedication, we aim to build a robust, self-sustaining blood donation ecosystem that fosters a culture of generosity and preparedness, making every community resilient to blood shortages. Our goal is to be the most trusted and efficient blood donation network globally.
          </p>
        </div>
        <div className='about-image-container'>
            <img src={Clinic} alt="Our Vision" className='about-image' />
        </div>
      </section>

      {/* New Section: Why Life Flow? (Text-only or with small icon) */}
      <section className='about-section center-content'>
        <div className='about-content'>
          <h2>Why Blood Donor Availability System ?</h2>
          <p>
            Blood transfusions are critical for countless medical procedures, emergencies, and chronic conditions. However, finding compatible blood quickly can be a significant challenge, especially in urgent situations. Traditional methods often suffer from delays and inefficiencies, leading to preventable losses.
          </p>
          <p>
            <strong>Blood Donor Availability System</strong> addresses these critical challenges head-on by providing a dynamic, user-friendly platform that streamlines the entire process. We make it faster and more reliable to find donors when every second counts, ensuring healthcare providers have immediate access to life-saving blood and that donors can contribute effortlessly and safely.
          </p>
        </div>
        {/* You could add a small icon or image here if you like */}
      </section>

      {/* New Section: How It Works */}

      {/* New Section: Join Our Cause (Full-width text) */}
      <section className='about-section full-width-text'>
        <div className='about-content'>
          <h2>Join Our Cause</h2>
          <p>
            <strong>Blood Donor Availability System</strong> is more than just a platform; it's a movement built on compassion, community spirit, and the shared belief that every life is precious. We invite you to be a part of this vital network. Whether you are a potential blood donor, a healthcare professional, a community organizer, or simply someone who believes in making a difference, your support can amplify our impact.
          </p>
          <p>
            Explore our site, register as a donor, or contact us to learn how you can contribute to a healthier, more resilient community. Together, we can ensure a steady flow of life-saving blood for those who need it most.
          </p>
        </div>
      </section>

      <p className='copy-right'>© 2025 Blood Donor Availability System. All Rights Reserved </p>

    </div>
  );
}

export default DonerAboutUs;