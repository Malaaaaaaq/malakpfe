import React from 'react';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-logo">ParLak</div>
                    <div className="footer-links">
                        <a href="#privacy" className="footer-link">Privacy Policy</a>
                        <a href="#terms" className="footer-link">Terms of Service</a>
                        <a href="#contact" className="footer-link">Contact Us</a>
                        <a href="#careers" className="footer-link">Careers</a>
                    </div>
                    <div className="footer-social">
                        <button className="social-btn">f</button>
                        <button className="social-btn">t</button>
                        <button className="social-btn">ig</button>
                        <button className="social-btn">in</button>
                    </div>
                    <div className="footer-copyright">
                        © 2026 Parlak. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
