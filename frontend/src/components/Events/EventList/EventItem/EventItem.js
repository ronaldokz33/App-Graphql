import React from 'react';

import './EventItem.css';

const eventItem = (props) => (
    <li className="events__list-item" key={props._id}>
        <div>
            <h1>
                {props.title}
            </h1>
            <h2>R${props.price} - {new Date(props.date).toLocaleDateString()}</h2>
        </div>
        <div>
            {props.creatorId !== props.userId ? <button onClick={props.onDetail.bind(this, props.eventId)} className="btn">View Details</button> : <p>You are the owner of this event.</p>}
        </div>
    </li>
);

export default eventItem;