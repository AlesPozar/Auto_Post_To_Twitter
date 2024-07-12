//CONTENTS
//
//Working code, here is where all the magic happens, I am sorry if the code is a little bit messy
//
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000; //in case I will need it

app.get('/', (req, res) => {
    res.send('App is up and running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const fs = require('fs');
const {twitterClient} = require("./twitterClient.js");

//Other Important Variables
const dailyTweetLimit = 30;//number of daily tweets, must not exceed 50 - Bonus tweets, for free version

//Start UP status
console.log('Program was started');
logCurrentTime();

//first tweet by AI, just to test the code at the very start
if(process.env.TOTAL_TWEETS_POSTED === "0"){
    try {
        const tweetF = 'This is first tweet, that was tweeted by AI 🥳 #AI #UPDATE';
        twitterClient.v2.tweet(tweetF);
        noTweetsLeftReset();
        console.log('|Day: ' + process.env.RUNNING_FOR_DAYS + '|: ' + process.env.TWEETS_POSTED_TODAY + '. Tweet posted: ', tweetF);
        tweetsPostedToday();
        totalTweetsPosted();
    }
    catch(e){
        console.log(e)
    }
}

//function postTweet, is used to post all kinds of tweets, it also checks which tweet it is going to post 
//Ik it could be written better, but this is the first commit, that way there is already a working version on air,
//while I am working on improving it with more features in the background. 
//I kind of just added new things I came up with, so that is why this code is not the cleanest one
function postTweet() {
    const tweets = fs.readFileSync('tweets.txt', 'utf-8').split('\n');
    if(parseInt(process.env.TOTAL_TWEETS_POSTED) % 1000 === 0 && process.env.TOTAL_TWEETS_POSTED !== "0"){
        tweetForMilestoneTweets();
    }
    else{
        if (parseInt(process.env.TWEETS_POSTED_TODAY) < dailyTweetLimit && tweets.length > 1) {
            const randomIndex = Math.floor(Math.random() * tweets.length);
            const tweet = tweets.splice(randomIndex, 1)[0];
            if(tweet !== '' && tweet.length < 280){
                try {
                    twitterClient.v2.tweet(tweet);
                    noTweetsLeftReset();
                    console.log('|Day: ' + process.env.RUNNING_FOR_DAYS + '|: ' + process.env.TWEETS_POSTED_TODAY + '. Tweet posted: ', tweet);
                    tweetsPostedToday();
                    totalTweetsPosted();
                }
                catch(e){
                    console.log(e)
                }
            }
            // Remove the posted tweet from the tweets.txt file
            fs.writeFileSync('tweets.txt', tweets.join('\n'), 'utf-8');
            console.log('Tweet removed from tweets.txt');
        } 
        else if (tweets.length === 1) {
            console.log('We have run out of tweets to post');
            ranOutOfTweets();
        } 
        else {
            console.log('The daily tweet limit has been reached.');
            tweetsPostedTodayReset();
            updateRunningForDays();
            totalTweetsPosted();
            dayTweet();
        }
    }
}

//function tweetForMilestoneTweets used to post a tweet for every milestone, whenever x000 tweets are posted
function tweetForMilestoneTweets(){
    const tweet = 'Currently there were ' + process.env.TOTAL_TWEETS_POSTED + " facts posted 🤩. #milestone #achievement #UPDATE";
    try {
        twitterClient.v2.tweet(tweet);
        totalTweetsPosted();
        console.log('|Day: ' + process.env.RUNNING_FOR_DAYS + '|: FINAL Tweet posted:  \n', tweet);
    }
    catch(e){
        console.log(e)
    }
}

//function ranOutOfTweets used to post an alert tweet if this program was to run out of tweets to post
function ranOutOfTweets(){
    if(process.env.NO_TWEETS_LEFT === "0"){
        const tweet = 'Sadly I ran out of tweets to post, so I am going on a refill, new tweets coming soon! #UPDATE';
        try {
            twitterClient.v2.tweet(tweet);
            totalTweetsPosted();
            noTweetsLeft();
            console.log('|Day: ' + process.env.RUNNING_FOR_DAYS + '|: FINAL Tweet posted:  \n', tweet);
        }
        catch(e){
            console.log(e)
        }
    }
}

//function dayTweet used to post a tweet every time dailyTweetLimit is hit
function dayTweet(){
    const tweet = '🥳  program up-time: ' + process.env.RUNNING_FOR_DAYS + ' days\n🔢 Number of tweets posted by AI: ' + process.env.TOTAL_TWEETS_POSTED  + "\n#UPDATE";
    try {
        twitterClient.v2.tweet(tweet);
        console.log('|Day: ' + process.env.RUNNING_FOR_DAYS + '|: FINAL Tweet posted: ', tweet);
    }
    catch(e){
        console.log(e)
    }
}

//post a tweet every (day/dailyTweetLimit) miliseconds
setInterval(postTweet, 86400000 / dailyTweetLimit);

//cur time
setInterval(logCurrentTime, 15 * 60 * 1000);

//keep alive
const https = require('https');

setInterval(() => {
  https.get("yourLInkToHerokuAppsSite");// replace with link to your Heroku apps site
},60 * 1000 * 25); // every 25 minutes

// Function to log the current time
function logCurrentTime() {
  const currentTime = new Date();
  console.log('Current time:', currentTime);
}

// Functions used to update env, since I would not buy a database addon to work when my dyno restarts >:(
// First edit: Cringe heroku rebuild
// Second edit: Still cringe heroku rebuild
const axios = require('axios');

// Set your Heroku API key and app name
const apiKey = process.env.HEROKU_API_KEY; // Replace with your Heroku API key
const appName = 'HEROKUAPPNAME'; // Replace with your Heroku app name

// Function to increment the value of RUNNING_FOR_DAYS config var by 1 on Heroku
async function updateRunningForDays() {
  try {
    const response = await axios.patch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      {
        RUNNING_FOR_DAYS: (parseInt(process.env.RUNNING_FOR_DAYS) + 1).toString(),
      },
      {
        headers: {
          Accept: 'application/vnd.heroku+json; version=3',
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Successfully updated RUNNING_FOR_DAYS config var');
  } catch (error) {
    console.error('Error updating RUNNING_FOR_DAYS config var:', error);
  }
}

// Function to increment the value of TOTAL_TWEETS_POSTED config var by 1 on Heroku
async function totalTweetsPosted() {
  try {
    const response = await axios.patch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      {
        TOTAL_TWEETS_POSTED: (parseInt(process.env.TOTAL_TWEETS_POSTED) + 1).toString(),
      },
      {
        headers: {
          Accept: 'application/vnd.heroku+json; version=3',
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Successfully updated TOTAL_TWEETS_POSTED config var');
  } catch (error) {
    console.error('Error updating TOTAL_TWEETS_POSTED config var:', error);
  }
}

// Function to reset TWEETS_POSTED_TODAY config var to 0 on Heroku
async function tweetsPostedTodayReset() {
  try {
    const response = await axios.patch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      {
        TWEETS_POSTED_TODAY: '0',
      },
      {
        headers: {
          Accept: 'application/vnd.heroku+json; version=3',
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Successfully reset TWEETS_POSTED_TODAY config var');
  } catch (error) {
    console.error('Error resetting TWEETS_POSTED_TODAY config var:', error);
  }
}

// Function to increment the value of TWEETS_POSTED_TODAY config var by 1 on Heroku
async function tweetsPostedToday() {
  try {
    const response = await axios.patch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      {
        TWEETS_POSTED_TODAY: (parseInt(process.env.TWEETS_POSTED_TODAY) + 1).toString(),
      },
      {
        headers: {
          Accept: 'application/vnd.heroku+json; version=3',
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Successfully updated TWEETS_POSTED_TODAY config var');
  } catch (error) {
    console.error('Error updating TWEETS_POSTED_TODAY config var:', error);
  }
}

// Function to reset NO_TWEETS_LEFT config var to 0 on Heroku
async function noTweetsLeftReset() {
  try {
    const response = await axios.patch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      {
        NO_TWEETS_LEFT: '0',
      },
      {
        headers: {
          Accept: 'application/vnd.heroku+json; version=3',
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Successfully reset NO_TWEETS_LEFT config var');
  } catch (error) {
    console.error('Error resetting NO_TWEETS_LEFT config var:', error);
  }
}

// Function to set NO_TWEETS_LEFT config var to 1 on Heroku
async function noTweetsLeft() {
  try {
    const response = await axios.patch(
      `https://api.heroku.com/apps/${appName}/config-vars`,
      {
        NO_TWEETS_LEFT: '1',
      },
      {
        headers: {
          Accept: 'application/vnd.heroku+json; version=3',
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Successfully set NO_TWEETS_LEFT config var to 1');
  } catch (error) {
    console.error('Error setting NO_TWEETS_LEFT config var to 1:', error);
  }
}

//NOTE: better and cleaner version comming soon