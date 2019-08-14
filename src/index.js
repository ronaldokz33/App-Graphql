const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const User = require('./models/user');

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

        type User {
            _id: ID!,
            email: String!,
            password: String,
            name: String!
        }

        input UserInput {
            email: String!,
            password: String!,
            name: String!
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
            createEvent(pEvent: EventInput): Event,
            createUser(pUser: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then((events) => {
                    return events.map((event) => {
                        return { ...event._doc, _id: event.id };
                    });
                })
                .catch((err) => {
                    throw err;
                    console.log(err);
                });
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.pEvent.title,
                description: args.pEvent.description,
                price: +args.pEvent.price,
                date: new Date(args.pEvent.date),
                creator: '5d54377305e50642f013a4ec'
            });

            let eventCreated;

            return event.save()
                .then((result) => {
                    eventCreated = { ...result._doc, _id: result._doc._id.toString() };

                    return User.findById('5d54377305e50642f013a4ec');
                })
                .then((user) => {
                    if(!user) {
                        throw new Error("User not found");
                    }

                    user.createdEvents.push(event);
                    return user.save();
                })
                .then((result) => {
                    return eventCreated;
                })
                .catch((err) => {
                    console.log(err);
                    throw err;
                });
        },
        createUser: (args) => {
            return User.findOne({
                email: args.pUser.email
            }).then((user) => {
                if (user) {
                    throw new Error("User exists already.");
                }

                return bcrypt.hash(args.pUser.password, 12);
            }).then((hashedPass) => {
                const user = new User({
                    email: args.pUser.email,
                    name: args.pUser.name,
                    password: hashedPass
                });

                return user.save()
                    .then((result) => {
                        return { ...result._doc, password: null, _id: result._doc._id.toString() };
                    })
                    .catch((err) => {
                        console.log(err);
                        throw err;
                    });
            }).catch((err) => {
                console.log(err)
            });
        }
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-5usjr.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, {
    useNewUrlParser: true
})
    .then(() => {
        app.listen(3366);
    })
    .catch((err) => {
        console.log(err);
    });

