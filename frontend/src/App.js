import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import MainNavigation from './components/Navigation/MainNavigation';
import UserPage from './pages/User';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';

function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation></MainNavigation>
        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/user" exact={true} />
            <Route path="/user" component={UserPage} />
            <Route path="/events" component={EventPage} />
            <Route path="/bookings" component={BookingPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
