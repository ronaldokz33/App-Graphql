import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

import MainNavigation from './components/Navigation/MainNavigation';
import UserPage from './pages/User';
import EventPage from './pages/Event';
import BookingPage from './pages/Booking';

import AuthContext from './context/auth-context';


class App extends Component {

  state = {
    token: null,
    userId: null
  }

  login = (token, userId, tokenExpiration) => {
    this.setState({ token, userId });
  }

  logout = () => {
    this.setState({ token: null, userId: null });
  }

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider value={{ token: this.state.token, userId: this.state.userId, login: this.login, logout: this.logout }}>
            <MainNavigation />
            <main className="main-content">
              <Switch>
                {!this.state.token && <Redirect from="/" to="/user" exact />}
                {!this.state.token && <Redirect from="/events" to="/user" exact />}
                {!this.state.token && <Redirect from="/bookings" to="/user" exact />}
                {this.state.token && <Redirect from="/" to="/events" exact />}
                {this.state.token && <Redirect from="/user" to="/events" exact />}
                {!this.state.token && <Route path="/user" component={UserPage} />}
                {this.state.token && <Route path="/events" component={EventPage} />}
                {this.state.token && <Route path="/bookings" component={BookingPage} />}
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter >
    );
  }
}

export default App;
