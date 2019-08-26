import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import authContext from '../context/auth-context';
class BookingPage extends Component {
    state = {
        isloading: false,
        bookings: []
    }

    static contextType = authContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
            query {
                bookings {
                    _id,
                    createdAt,
                    event {
                        _id,
                        title,
                        date
                    }
                }
            }
        `
        };

        const token = this.context.token;

        fetch('http://localhost:3366/graphql', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        }).then((res) => {
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed');
            }

            return res.json();
        }).then((resData) => {
            const bookings = resData.data.bookings;
            this.setState({ bookings, isLoading: false });
        }).catch((err) => {
            this.setState({ isLoading: false });
            console.log(err);
        });
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.isLoading ?
                        <Spinner />
                        :
                        <ul>
                            {
                                this.state.bookings.map((booking) => (
                                    <li>{booking.event.title}</li>
                                ))
                            }
                        </ul>
                }
            </React.Fragment>

        );
    }
}

export default BookingPage;