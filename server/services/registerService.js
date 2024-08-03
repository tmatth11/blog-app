const UserAccountsRepository = require('../repositories/userAccountsRepository');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('./authService');
const saltRounds = 10;

const registerLoginCredentials = async (request, response) => {
    try {
        const { username, password } = request.body;
        const userAccountsRepository = new UserAccountsRepository();
        const existingUserAccount = await userAccountsRepository.select(username);
        if (!existingUserAccount) {
            const salt = await bcrypt.genSalt(saltRounds);
            const passwordHash = await bcrypt.hash(password, salt);
            const newUserAccount = await userAccountsRepository.insert(username, passwordHash);
            const id = newUserAccount.id;

            const user = { id, username };
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            response.cookie('accessToken', accessToken, { secure: true });
            response.cookie('refreshToken', refreshToken, { secure: true });

            return response.status(201).json({ id, message: "Congrats on creating an account!" });
        } else {
            const error = `${username} already has an account`;
            return response.status(409).json({ error });
        }
    } catch (err) {
        console.error(err);
        return response.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = registerLoginCredentials;