import React, { Component } from 'react';

import './Event.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class EventPage extends Component {
    state = {
        creating: false
    };

    openCreateEventHandler = () => {
        this.setState({ creating: true });
    }

    modalConfirmHandler = () => {
        this.setState({ creating: false });
    }

    modalCancelHandler = () => {
        this.setState({ creating: false });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.creating &&
                    <React.Fragment>
                        <Backdrop />
                        <Modal title="Add Event" canConfirm canCancel onCancel={this.modalCancelHandler} onConfirm={this.modalConfirmHandler}>
                            <p>Modal Content</p>
                        </Modal>
                    </React.Fragment>
                }

                <div className="events-control">
                    <p>Share your own Events</p>
                    <button className="btn" onClick={this.openCreateEventHandler}>Create Event</button>
                </div>
            </React.Fragment>
        );
    }
}

export default EventPage;