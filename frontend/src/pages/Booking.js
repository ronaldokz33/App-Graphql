import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import authContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
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

    deleteBookingHandler = (bookingId) => {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
            mutation {
                cancelBooking(bookingId: "${bookingId}") {
                    _id,
                    title
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
            this.setState((preveState) => {
                const updatedBooking = preveState.bookings.filter((booking) => {
                    return booking._id !== bookingId;
                });

                return { bookings: updatedBooking, isLoading:false };
            });

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
                        <BookingList onDelete={this.deleteBookingHandler} bookings={this.state.bookings} />
                }
            </React.Fragment>

        );
    }
}

export default BookingPage;