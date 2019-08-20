const bcrypt = require('bcryptjs');
const { transformUser } = require('./merge');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

module.exports = {
    users: async () => {
        try {
            const users = await User.find();

            return users.map((user) => {
                return transformUser(user);
            });
        }
        catch (err) {
            throw err;
        };
    },
    createUser: async (args) => {
        try {
            const _checkUser = await User.findOne({
                email: args.pUser.email
            });

            if (_checkUser) {
                throw new Error("User exists already.");
            }

            const hashedPass = await bcrypt.hash(args.pUser.password, 12);

            const user = new User({
                email: args.pUser.email,
                name: args.pUser.name,
                password: hashedPass
            });

            const result = await user.save();

            return {
                ...result._doc,
                password: null,
                _id: result._doc._id.toString()
            };
        }
        catch (err) {
            throw err;
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({
            email
        });

        if (!user) {
            throw new Error('User does not exist!');
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }

        const token = jwt.sign({
            userId: user._id,
            email: user.email
        },
            'put-here-your-secret-key',
            {
                expiresIn: '1h'
            });

        return {
            userId: user._id,
            token: token,
            tokenExpiration: 1
        };
    }
};