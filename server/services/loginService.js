const UserAccountsRepository = require('../repositories/userAccountsRepository');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('./authService');

const validateLoginCredentials = async (request, response) => {
    const { username, password } = request.body;
    const userAccountsRepository = new UserAccountsRepository();
    const existingUserAccount = await userAccountsRepository.select(username);
    if (existingUserAccount) {
        const isMatch = await bcrypt.compare(password, existingUserAccount.password);
        if (isMatch) {
            const user = { id: existingUserAccount.id, username: existingUserAccount.username };
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            response.cookie('accessToken', accessToken, { secure: true });
            response.cookie('refreshToken', refreshToken, { secure: true });
            return response.status(200).json({ accessToken, message: "Successfully logged in!" });
        } else {
            const error = `Password is incorrect.`;
            return response.status(401).json({ error });
        }
    } else {
        const error = `${username} does not have an account, need to register.`;
        return response.status(400).json({ error });
    }
};

module.exports = validateLoginCredentials;