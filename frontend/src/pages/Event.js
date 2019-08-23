import React, { Component } from 'react';
import AuthContext from '../context/auth-context';


import './Event.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class EventPage extends Component {
    state = {
        creating: false,
        events: []
    };

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
            mutation {
                createEvent(pEvent: {title: "${event.title}", price: ${event.price}, date: "${event.date}", description: "${event.description}"}) {
                    _id,
                    title,
                    date,
                    description,
                    price
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
            this.fetchEvents();

            this.setState({ creating: false });
        }).catch((err) => {
            console.log(err);
        });
    }

    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

    fetchEvents = () => {
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
            this.setState({ events });
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        const eventList = this.state.events.map((event) => {
            return (<li className="events__list-item" key={event._id}>{event.title}</li>);
        });

        return (
            <React.Fragment>
                {this.state.creating &&
                    <React.Fragment>
                        <Backdrop />
                        <Modal title="Add Event" canConfirm canCancel onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
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

                {this.context.token &&
                    (
                        <div className="events-control">
                            <p>Share your own Events</p>
                            <button className="btn" onClick={this.openCreateEventHandler}>Create Event</button>
                        </div>
                    )
                }

                <ul className="events__list">
                    {eventList}
                </ul>
            </React.Fragment>
        );
    }
}

export default EventPage;