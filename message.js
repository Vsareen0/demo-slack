const { app } = require('./server');

/*
 *  Handling DM messages
 */


/* Calling the chat.postMessage method to send a message */


const send = async(channel, text) => {   
  try {
    const result = await app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: channel,
      text: `:wave: Hey, I created this note for you in my _Home_: \n>>>${text}`
    });
    
  } catch(e) {
    console.log(e);
  }
};


module.exports = { send };
