import React, { Component } from 'react';

import './User.css';

import AuthContext from '../context/auth-context';
class UserPage extends Component {
    state = {
        isLogin: true
    }

    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.nameEl = React.createRef();
    }

    switchModeHandler = () => {
        this.setState((prevState) => {
            return { isLogin: !prevState.isLogin };
        })
    }
    submitHandler = (event) => {
        event.preventDefault();

        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;
        let name = '';

        if (this.nameEl.current !== null) {
            name = this.nameEl.current.value;
        }

        if (email.trim().length === 0 || password.trim().length === 0 || (name.trim().length === 0 && this.state.isLogin === false)) {
            console.log('without data.');
            return;
        }

        let requestBody = {
            query: `
                query {
                    login(email: "${email}", password: "${password}") {
                        userId,
                        token,
                        tokenExpiration
                    }
                }
            `
        }

        if (!this.state.isLogin) {
            requestBody = {
                query: `
                mutation {
                    createUser(pUser: {email: "${email}", password: "${password}", name: "${name}"}) {
                        _id,
                        email,
                        name
                    }
                }
            `
            };
        }

        fetch('http://localhost:3366/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }

            return res.json();
        }).then((resData) => {
            if (resData.data.login.token) {
                this.context.login(resData.data.login.token, resData.data.login.userId, resData.data.login.tokenExpiration);
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <form className="user-form" onSubmit={this.submitHandler}>
                {
                    !this.state.isLogin &&
                    <div className="form-control">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" ref={this.nameEl} />
                    </div>
                }

                <div className="form-control">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" ref={this.emailEl} />
                </div>
                <div className="form-control">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" ref={this.passwordEl} />
                </div>
                <div className="form-actions">
                    <button type="submit">{this.state.isLogin ? 'Login' : 'Sign-up'}</button>
                    <button onClick={this.switchModeHandler} type="button">Switch to {this.state.isLogin ? 'Signup' : 'Login'}</button>
                </div>
            </form>
        );
    }
}

export default UserPage;