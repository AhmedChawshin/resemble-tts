const TwitchBot = require("twitch-bot");
const config = require("./config")
const obs = require("./obsscene")

const Bot = new TwitchBot({
    username: config.username,
    oauth: config.oauth,
    channels: config.channels,
  });
  Bot.on("join", (channel) => {
    console.log(`Joined channel: ${channel}`);
  });
  
  Bot.on("error", (err) => {
    console.log(err);
  });
  
  Bot.on("message", (chatter) => {
    if (chatter.custom_reward_id == config.rewardid) {
      console.log('NEW TTS REQUEST', chatter.message)
      obs.sendText(chatter.message);
    }
  });

  
  module.exports = {
    Bot
};