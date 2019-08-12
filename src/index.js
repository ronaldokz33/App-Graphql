const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const graphQLHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use(routes);

app.use('/graphql', graphQLHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return ['ronaldo', 'Lemos'];
        },
        createEvent: (args) => {
            const { name } = args;

            return 'Your name: ' + name;
        }
    },
    graphiql: true
}));

app.listen(3366);