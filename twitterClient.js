//CONTENTS
//
//Just some initial inicialization, for this project
//
const { TwitterApi } = require("twitter-api-v2");
require("dotenv").config();

//Client start point, declares the client with specific twitter data from twitter developer program
const client = new TwitterApi({
    appKey: process.env.TWITTER_CONSUMER_KEY,
    appSecret: process.env.TWITTER_CONSUMER_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
})

//Declares the bearer
const bearer = new TwitterApi(process.env.TWITTER_BEARER);

//Exports
const twitterClient = client.readWrite;
const twitterBearer = bearer.readOnly;

module.exports = {twitterClient, twitterBearer};