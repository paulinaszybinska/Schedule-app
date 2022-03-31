async function getAllUsers(pool) {
    return await pool.query('SELECT * FROM users;');
};

async function getAllSchedules(pool) {
    return await pool.query('SELECT * FROM users JOIN schedules ON (users.id=user_id);');
};

const crypto = require('crypto');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    
    return sha256.update(password).digest('base64');
};

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
};

module.exports = {
    getAllUsers: getAllUsers,
    getAllSchedules: getAllSchedules,
    getHashedPassword: getHashedPassword,
    generateAuthToken: generateAuthToken,
}; 
