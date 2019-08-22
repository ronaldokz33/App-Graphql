import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

const mainNavigation = (props) => {
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <header className="main-navigation">
                        <div className="main-navigation_logo">
                            <h1>The Navbar</h1>
                        </div>
                        <nav className="main-navigation_items">
                            <ul>
                                {context.token && <li><button onClick={context.logout} to="/user">Logout</button></li>}
                                {context.token && <li><NavLink to="/events">Events</NavLink></li>}
                                {context.token && <li><NavLink to="/bookings">Bookings</NavLink></li>}
                            </ul>
                        </nav>
                    </header>
                );
            }}
        </AuthContext.Consumer>
    );
}

export default mainNavigation;