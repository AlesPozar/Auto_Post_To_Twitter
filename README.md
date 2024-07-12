Code that automates posting new text tweets randomly from a .txt file to your Twitter / X profile

# INTRODUCTION
I created this code over a year ago, didn't update or tried it since, but it did work. I ran my from Heroku online hosting service (I would recommend it) and it was up and running for some months on my test account. The whole code took me a few days to create. It mainly took me most of the time to understand the API-s and figure out how to work with Heroku, the code itself is pretty simple and I think easy to understand (I hope so). It is easily upgradable, for example, if you have access to Chat GPT API, you can create some random prompts, and then instead of getting the tweets from a .txt file, just get them generated straight from the source, that way you can have more complex and diverse tweets, hence you could even create all out managed Twitter / X profile just by incorporating it with paid Twitter / X API. Also, I am writing this instruction purely from memory, so I am apologizing for any not detailed steps or badly written instructions. Had to get this uploaded as fast as I could, I might revisit them later and make them more detailed.

NOTE: This program was tested before the Twitter to X update

# SETUP
- Just clone the repository to your local machine
- Create Heroku account and initialize the new application
- Upload the cloned files to your newly created Heroku application
- Go to Twitter / X and sign up for API access, and get the needed information for later steps to initialize config vars in later steps (a lot of helpful videos on this topic can be found on YouTube)
- Go to Heroku and find your API access key, also for later steps
- Access the Config Vars under your application settings in Heroku and edit/add them as follows
  ![image](https://github.com/user-attachments/assets/11cd912f-d4a5-477e-8fd1-652f452dd18d)

- Change any key/token to your personal keys and tokes, other values (NO_TWEETS_LEFT, RUNNING_FOR_DAYS, TOTAL_TWEETS_POSTED, TWEETS_POSTED_TODAY) should be set to 0 for when the program is first run. After that, you don't have to change those values anymore, except maybe some keys/tokens that might expire. As you can see I also used config vars for some changeable information, like information about the number of tweets posted. This is because every time your program is restarted your files are reloaded and every changes that were made to them during the last run like incremented numbers, posted tweets deleted, will be reset. This is why we save some of this information in updatable config vars that way every time a program is restarted they are saved from the last run.
- Now go into the code and update the following line (153) in index.js
  <pre>const appName = 'HEROKUAPPNAME'; // Replace with your Heroku app name</pre>
  And also update the line (137), in the same file
  <pre>https.get("yourLInkToHerokuAppsSite");// replace with link to your Heroku apps site</pre>

  Since Heroku apps will go to sleep after some time, that way you don't pay for an inactive app, the "keep alive" part of the   code, the part you just pasted the link to, will ping the site every now and then, just so it does not go to sleep mode and thus stop your bot from running.
- Now just run the code and enjoy. All of the important logs will be printed into your console.
