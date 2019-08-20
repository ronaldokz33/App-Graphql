import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const mainNavigation = (props) => {
    return (
        <header className="main-navigation">
            <div className="main-navigation_logo">
                <h1>The Navbar</h1>
            </div>
            <nav className="main-navigation_items">
                <ul>
                    <li><NavLink to="/user">User</NavLink></li>
                    <li><NavLink to="/events">Events</NavLink></li>
                    <li><NavLink to="/bookings">Bookings</NavLink></li>
                </ul>
            </nav>
        </header>
    );
}

export default mainNavigation;