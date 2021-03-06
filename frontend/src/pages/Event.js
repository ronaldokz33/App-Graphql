import React, { Component } from 'react';
import AuthContext from '../context/auth-context';

import EventList from '../components/Events/EventList/EventList';

import './Event.css';
import Modal from '../components/Modal/Modal';
import Spinner from '../components/Spinner/Spinner';
import Backdrop from '../components/Backdrop/Backdrop';

class EventPage extends Component {
    state = {
        creating: false,
        events: [],
        isLoading: false,
        selectedEvent: null
    };

    isActive = true;

    constructor(props) {
        super(props);

        this.titleElRef = React.createRef();
        this.priceElRef = React.createRef();
        this.dateElRef = React.createRef();
        this.descriptionElRef = React.createRef();
    }

    componentDidMount() {
        this.fetchEvents();
    }

    static contextType = AuthContext;

    openCreateEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = () => {
        const title = this.titleElRef.current.value;
        const price = +this.priceElRef.current.value;
        const description = this.descriptionElRef.current.value;
        const date = this.dateElRef.current.value;

        if (title.trim().length === 0 || price <= 0 || date.trim().length === 0 || description.trim().length === 0) {
            return;
        }

        const event = { title, price, date, description };

        console.log(event);

        const requestBody = {
            query: `
                mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
                    createEvent(pEvent: {title: $title, price: $price, date: $date, description: $description}) {
                        _id,
                        title,
                        date,
                        description,
                        price
                    }
                }
            `,
            variables: {
                title: title,
                price: price,
                date: date,
                description: description
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
            this.setState((prevState) => {
                const updatedEvents = [...prevState.events];

                updatedEvents.push({
                    _id: resData.data.createEvent._id,
                    title: resData.data.createEvent.title,
                    description: resData.data.createEvent.description,
                    price: resData.data.createEvent.price,
                    date: resData.data.createEvent.date,
                    creator: {
                        _id: this.context.userId
                    }
                });

                return { events: updatedEvents };
            });


            this.setState({ creating: false });
        }).catch((err) => {
            console.log(err);
        });
    }

    modalCancelHandler = () => {
        this.setState({ creating: false, selectedEvent: null });
    }

    fetchEvents = () => {
        this.setState({ isLoading: true });

        const requestBody = {
            query: `
            query {
                events {
                    title,
                    description,
                    price,
                    date,
                    _id,
                    creator {
                        _id,
                        email
                    }
                  }
            }
        `
        };

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
            const events = resData.data.events;
            if (this.isActive) {
                this.setState({ events, isLoading: false });
            }
        }).catch((err) => {
            if (this.isActive) {
                this.setState({ isLoading: false });
            }
            console.log(err);
        });
    }

    onViewDetailHandler = (eventId) => {
        this.setState((prevState) => {
            const selectedEvent = prevState.events.find(e => e._id === eventId);

            return { selectedEvent }
        })
    }

    bookEventHandler = () => {
        if (!this.context.token) {
            this.setState({ selectedEvent: null });
            return;
        }

        const requestBody = {
            query: `
                mutation BookEvent($eventId: ID!) {
                    bookEvent(eventId: $eventId) {
                        _id,
                        createdAt,
                        updatedAt
                    }
                }
            `,
            variables: {
                eventId: this.state.selectedEvent._id
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
        }).then((data) => {
            console.log(data);

            this.setState({ selectedEvent: null });
        }).catch((err) => {
            console.log(err);
        });
    }
    componentWillUnmount() {
        this.isActive = false;
    }
    render() {
        return (
            <React.Fragment>
                {this.state.creating &&
                    <React.Fragment>
                        <Backdrop />
                        <Modal title="Add Event" canConfirm={true} canCancel onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                            <form>
                                <div className="form-control">
                                    <label htmlFor="title">Title</label>
                                    <input type="text" id="tite" ref={this.titleElRef} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="date">Description</label>
                                    <input type="datetime-local" id="date" ref={this.dateElRef} />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="price">Price</label>
                                    <input type="number" id="price" ref={this.priceElRef} />
                                </div>

                                <div className="form-control">
                                    <label htmlFor="description">Description</label>
                                    <textarea id="description" rows="4" ref={this.descriptionElRef} />
                                </div>
                            </form>
                        </Modal>
                    </React.Fragment>
                }

                {



                    this.state.selectedEvent &&
                    <React.Fragment>
                        <Backdrop />
                        <Modal title={this.state.selectedEvent.title} confirmText="Book Event" canConfirm={this.context.token ? true : false} canCancel onCancel={this.modalCancelHandler} onConfirm={this.bookEventHandler}>
                            <h1>{this.state.selectedEvent.title}</h1>
                            <h2>R$ {this.state.selectedEvent.price} - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h2>
                            <p>{this.state.selectedEvent.description}</p>
                        </Modal>
                    </React.Fragment>
                }

                {this.context.token &&
                    (
                        <div className="events-control">
                            <p>Share your own Events</p>
                            <button className="btn" onClick={this.openCreateEventHandler}>Create Event</button>
                        </div>
                    )
                }
                {
                    this.state.isLoading ?
                        <Spinner />
                        :
                        <EventList events={this.state.events} authUserId={this.context.userId} onViewDetail={this.onViewDetailHandler} />
                }
            </React.Fragment>
        );
    }
}

export default EventPage;