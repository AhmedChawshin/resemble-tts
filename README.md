# Resemble-tts
A TTS with your custom voice on twitch.tv

## Configuration

### You need to retrieve your oauth token and channel reward it on twitch. 

You can find the channel reward id [here](https://www.instafluff.tv/TwitchCustomRewardID/?channel=YOURTWITCHCHANNEL). 

The oauth token is [here](https://twitchapps.com/tmi/). 

### The application also require your resemble.ai projectID, api key and the voice id.

You can find your projectid [here](https://app.resemble.ai/projects). 

Your API key should be [here](https://app.resemble.ai/account/api).

And the voice ID should be located [here](https://app.resemble.ai/voices). 

## Installation
This script require nodejs installed on your computer

1. Download the folder and run this command to download all the npm inside the path:
```bash
npm install
```
2. visit modules > config.js and add your configuration details. 
```bash
node index.js
```

2. Go ahead and visit the localhost and add it as an browser source on obs. 
