const { transformEvent } = require('./merge');

const Event = require('../../models/event');
const User = require('../../models/user');

module.exports = {
    events: async () => {
        try {
            const events = await Event.find().populate('creator');

            return events.map((event) => {
                return transformEvent(event);
            });
        }
        catch (err) {
            throw err;
        };
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }

        const event = new Event({
            title: args.pEvent.title,
            description: args.pEvent.description,
            price: +args.pEvent.price,
            date: new Date(args.pEvent.date),
            creator: req.userId
        });

        try {
            let eventCreated;

            const result = await event.save();

            eventCreated = transformEvent(result);

            const creator = await User.findById(req.userId);

            if (!creator) {
                throw new Error("User not found");
            }

            creator.createdEvents.push(event);

            await creator.save();

            return eventCreated;
        }
        catch (err) {
            throw err;
        }
    }
};