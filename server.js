const { default: Axios } = require("axios");
require('dotenv').config();

const { App } = require('@slack/bolt');
const slackApp = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN,
});

const token = process.env.token;

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The token you used to initialize your app
      token,
      channel: id,
      text: text,
      as_user: true
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

// Post a message to a channel your app is in using ID and message text
async function publishConversation(cid, id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postEphemeral({
      // The token you used to initialize your app
      token,
      attachments:[{"pretext": "pre-hello", "text": "text-world"}],
      channel: cid,
      text,
      as_user: true,
      user: id
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}

// Find conversation ID using the conversations.list method
async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await slackApp.client.conversations.list({
      // The token you used to initialize your app
      token
    });

    console.log('All list: ', result.channels)

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }
  }
  catch (error) {
    console.error(error);
  }
}



// Post a message as a user with channel ID and message text
async function postAsUser(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The user token of the user you want to impersonate
      token: "xoxp-1390311268292-1384327387395-1426261864944-ea768d62adf6cd10514f8827cc04457c",
      channel: id,
      text: text
      // You could also use a blocks[] array to send richer content
    });

    // Print result
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}



// Receive any message based on channel events
async function messageEvent() {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.message.channels({
      // The user token of the user you want to impersonate
      token: "xoxp-1390311268292-1384327387395-1426261864944-ea768d62adf6cd10514f8827cc04457c",
      
    });

    // Print result
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
}




(async () => {
  // Start the app
  await slackApp.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  // Direct or channel message
  publishMessage("U01BA9MBDBM", "Hello world :tada:");


  // Only visible to you message
  // publishConversation("#general","U01BA9MBDBM", "Shhhh ! Only you can see this !");


  // Get list of all channels and their info
  // findConversation("general");


  // Self message - Impersonate as someone
  // postAsUser("D01BNN18DB3", "Just a test !");


})();