import React, { useState } from 'react';
import { Menu, X, Search, ClipboardList, HelpCircle, User, LogIn } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <div className="logo-section">
                        <button
                            className="menu-toggle"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        <h1 className="logo">ParLak</h1>
                    </div>

                    <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                        <a href="#find-parking" className="nav-link active">
                            <Search size={20} />
                            <span className="nav-text">Find Parking</span>
                        </a>
                        <a href="#bookings" className="nav-link">
                            <ClipboardList size={20} />
                            <span className="nav-text">My Bookings</span>
                        </a>
                        <a href="#how-it-works" className="nav-link">
                            <HelpCircle size={20} />
                            <span className="nav-text">How It Works</span>
                        </a>
                    </nav>

                    <div className="auth-section">
                        <button className="auth-btn login">
                            <User size={20} />
                            <span className="btn-text">Login</span>
                        </button>
                        <button className="auth-btn signin">
                            <LogIn size={20} />
                            <span className="btn-text">Sign In</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
