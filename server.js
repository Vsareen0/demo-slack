require("dotenv").config();

const { App, ExpressReceiver } = require("@slack/bolt");

// Create a Bolt Receiver
const receiver = new ExpressReceiver({ signingSecret: process.env.SLACK_SIGNING_SECRET });

const slackApp = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});

// Other web requests are methods on receiver.router
receiver.router.get('/', (req, res) => {
  // You're working with an express req and res now.
  res.send('yay!');
});

// Other web requests are methods on receiver.router
receiver.router.post('/challenge', (req, res) => {
  // You're working with an express req and res now.
  res.send(req.query.challenge);
});


const token = process.env.token;

// Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
slackApp.event("app_home_opened", async ({ payload, context }) => {
  const userId = payload.user;
  
  try {
    // Call the views.publish method using the built-in WebClient
    const result = await app.client.views.publish({
      // The token you used to initialize your app is stored in the `context` object
      token: context.botToken,
      user_id: userId,
      view: {
        // Home tabs must be enabled in your app configuration page under "App Home"
        "type": "home",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Welcome home, <@" + userId + "> :house:*"
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>."
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "context",
            "elements": [
              {
                "type": "mrkdwn",
                "text": "Psssst this home tab was designed using <https://api.slack.com/tools/block-kit-builder|*Block Kit Builder*>"
              }
            ]
          }
        ]
      }
    });

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

// Listen to a message containing the substring "hello"
// app.message requires your app to subscribe to the message.channels event
slackApp.message("hello", async ({ payload, context }) => {
  try {
    console.log('called');
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app is stored in the `context` object
      token: context.botToken,
      // Payload message should be posted in the channel where original message was heard
      channel: payload.channel,
      text: "world"
    });

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The token you used to initialize your app
      token,
      channel: id,
      text: text,
      as_user: true,
      // You could also use a blocks[] array to send richer content
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "You have a new request:\n*<fakeLink.toEmployeeProfile.com|Fred Enriquez - New device request>*"
          }
        },
        {
          "type": "section",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "*Type:*\nComputer (laptop)"
            },
            {
              "type": "mrkdwn",
              "text": "*When:*\nSubmitted Aut 10"
            },
            {
              "type": "mrkdwn",
              "text": "*Last Update:*\nMar 10, 2015 (3 years, 5 months)"
            },
            {
              "type": "mrkdwn",
              "text": "*Reason:*\nAll vowel keys aren't working."
            },
            {
              "type": "mrkdwn",
              "text": "*Specs:*\n\"Cheetah Pro 15\" - Fast, really fast\""
            }
          ]
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Approve"
              },
              "style": "primary",
              "value": "click_me_123"
            },
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "emoji": true,
                "text": "Deny"
              },
              "style": "danger",
              "value": "click_me_123"
            }
          ]
        }
      ]
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
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
      attachments: [{ pretext: "pre-hello", text: "text-world" }],
      channel: cid,
      text,
      as_user: true,
      user: id,
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// Find conversation ID using the conversations.list method
async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await slackApp.client.conversations.list({
      // The token you used to initialize your app
      token,
    });

    console.log("All list: ", result.channels);

    for (const channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Post a message as a user with channel ID and message text
async function postAsUser(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The user token of the user you want to impersonate
      token,
      channel: id,
      text: text,
      // You could also use a blocks[] array to send richer content
    });

    // Print result
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

// Receive any message based on channel events
async function messageEvent() {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.message.channels({
      // The user token of the user you want to impersonate
      token,
    });

    // Print result
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  // Start the app
  await slackApp.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");

  // Vinamra Id: U01BA9MBDBM
  // Pompei id:  U01BUCASW4S

  // Direct or channel message
  // publishMessage("U01BUCASW4S", "Check pompei :tada:");

  // Only visible to you message
  // publishConversation("#general","U01BA9MBDBM", "Shhhh ! Only you can see this !");

  // Get list of all channels and their info
  // findConversation("general");

  // Self message - Impersonate as someone
  // postAsUser(" ", "Just a test !");

})();
