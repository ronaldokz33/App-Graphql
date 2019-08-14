module.exports = {
    async store(args) {
        const { username } = req.body;

        const userExists = await Dev.findOne({ user: username });

        if (userExists) {
            return res.json(userExists);
        }

        const response = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url } = response.data;

        await Dev.create({
            name: name,
            user: username,
            bio: bio,
            avatar: avatar_url,
            likes: [],
            dislikes: []
        });

        userExists = await Dev.findOne({ user: username });
        
        return res.json(userExists);
    }
};