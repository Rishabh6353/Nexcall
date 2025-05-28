import React from 'react';
import '../App.css';
import { Link, useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const router = useNavigate();

  return (
    <div className="landingPageContainer">
     <nav className="navbar">
  <div className="navHeader">
    <h2>NexCall</h2>
  </div>
  <div className="navLinks">
    <p onClick={() => router('/guestLink')}>Join as Guest</p>
    <p onClick={() => router('/auth')}>Register</p>
    <button className="loginNavBtn" onClick={() => router('/auth')}>
      Login
    </button>
  </div>
</nav>


      <header className="heroSection">
        <div className="heroContent">
          <h1>
            <span className="highlight">Connect</span> with your loved ones.
          </h1>
          <p className="subtitle">Crystal-clear, secure video calling for everyone.</p>
          <div className="getStartedButton" role="button">
            <Link to="/auth">Get Started</Link>
          </div>
        </div>
        <div className="heroImage">
          <img src="/mobile.png" alt="Video call illustration" />
        </div>
      </header>

      <footer className="footer">
        <p>© {new Date().getFullYear()} NexCall. All rights reserved.</p>
        <div className="footerLinks">
          <a href="https://github.com/Rishabh6353" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
        </div>
      </footer>
    </div>
  );
}
