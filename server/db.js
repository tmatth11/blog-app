const Client = require('pg');

const connectionOptions = {
    host: 'localhost',
    port: 5432,
    user: 'root',
    password: 'root',
    database: 'blog_app'
};

const dbClient = new Client.Client(connectionOptions);

dbClient.connect(() => {
    console.log('Connected to postgres db!');
});

module.exports = dbClient;