const bcrypt = require('bcryptjs');
const { transformUser } = require('./merge');

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
    }
};