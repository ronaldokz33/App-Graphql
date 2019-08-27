import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 2
    },
    'Normal': {
        min: 2,
        max: 10
    },
    'Expensive': {
        min: 10,
        max: 100
    }
};

const bookingChart = (props) => {
    let values = [];

    var chartData = { labels: [], datasets: [] };

    for (const bucket in BOOKINGS_BUCKETS) {
        const filteredBookingsCount = props.bookings.reduce((prev, current) => {
            if (current.event.price <= BOOKINGS_BUCKETS[bucket].max && current.event.price > BOOKINGS_BUCKETS[bucket].min) {
                return prev + 1;
            }
            else {
                return prev;
            }
        }, 0);

        values.push(filteredBookingsCount);

        chartData.labels.push(bucket);

        chartData.datasets.push({
            fillColor: '#FF0000',
            strokeColor: '#FF0000',
            highlightFill: '#00FF00',
            highlightStroke: '#00FF00',
            data: values
        });

        values = [...values];
        values[values.length - 1] = 0;
    }

    return (
        <div style={{ textAlign: 'center' }}>
            <BarChart data={chartData} />
        </div>
    );
}

export default bookingChart;