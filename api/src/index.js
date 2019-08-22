const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const graphQLHttp = require('express-graphql');
const mongoose = require('mongoose');

const isAuth = require('./middleware/is-auth');

const graphQLSchema = require('./graphql/schema/index');
const graphQLResolvers = require('./graphql/resolvers/index');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

app.use(bodyParser.json());
app.use(isAuth);
app.use(routes);



app.use('/graphql', graphQLHttp({
    schema: graphQLSchema,
    rootValue: graphQLResolvers,
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

