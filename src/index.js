const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use(routes);

const events = [

];

app.use('/graphql', graphQLHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!,
            title: String!,
            description: String!,
            price: Float!,
            date: String!
        }

        input EventInput {
            title: String!,
            description: String!,
            price: Float!,
            date: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(pEvent: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return events;
        },
        createEvent: (args) => {
            const event = {
                _id: Math.random().toString(),
                title: args.pEvent.title,
                description: args.pEvent.description,
                price: +args.pEvent.price,
                date:new Date().toISOString()
            }

            events.push(event);

            return event;
        }
    },
    graphiql: true
}));

app.listen(3366);