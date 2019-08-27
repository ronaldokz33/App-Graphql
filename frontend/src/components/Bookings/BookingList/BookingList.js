import React from 'react';

import './BookingList.css';

const bookingList = (props) => (
    <ul className="bookings__list">
        {props.bookings.map((booking) => {
            return (
                <li key={booking._id} className="booking__item">
                    <div className="bookngs__item-data">
                        {booking.event.title}
                    </div>
                    <div className="bookngs__item-actions">
                        <button onClick={props.onDelete.bind(this, booking._id)} className="btn">Cancel</button>
                    </div>
                </li>
            );
        })}
    </ul>
);

export default bookingList;