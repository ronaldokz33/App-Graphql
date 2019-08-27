import React, { Component } from 'react';

import Spinner from '../components/Spinner/Spinner';
import authContext from '../context/auth-context';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingChart from '../components/Bookings/BookingChart/BookingChart';
import BookingControl from '../components/Bookings/BookingControl/BookingControl';
class BookingPage extends Component {
    state = {
        isloading: false,
        bookings: [],
        outputType: "list"
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
                        date,
                        price
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
                mutation CancelBooking($bookingId: ID!) {
                    cancelBooking(bookingId: $bookingId) {
                        _id,
                        title
                    }
                }
            `,
            variables: {
                bookingId
            }
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

                return { bookings: updatedBooking, isLoading: false };
            });

        }).catch((err) => {
            this.setState({ isLoading: false });
            console.log(err);
        });
    }

    changeOutputTypleHandler = (outputType) => {
        if (outputType === 'list') {
            this.setState({ outputType: 'list' });
        } else {
            this.setState({ outputType: 'chart' })
        }
    }

    render() {
        let content = <Spinner />;

        if (!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <BookingControl activeOutputType={this.state.outputType} onChange={this.changeOutputTypleHandler} />
                    <div>
                        {
                            this.state.outputType === 'list'
                                ?
                                <BookingList onDelete={this.deleteBookingHandler} bookings={this.state.bookings} />
                                :
                                <BookingChart bookings={this.state.bookings} />
                        }
                    </div>
                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                {
                    content
                }
            </React.Fragment>

        );
    }
}

export default BookingPage;