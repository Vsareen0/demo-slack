require("dotenv").config();
const bodyParser = require("body-parser");
const { App, ExpressReceiver } = require("@slack/bolt");

// Create a Bolt Receiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const slackApp = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});
var jsonParser = bodyParser.json();

// Other web requests are methods on receiver.router
receiver.router.get("/", (req, res) => {
  // You're working with an express req and res now.
  res.send("yay!");
});

// Other web requests are methods on receiver.router
receiver.router.post("/challenge", jsonParser, (req, res) => {
  // You're working with an express req and res now.
  console.log('challenge: ', req.body);
  if (req.body.type == "url_verification") {
    const value = req.body.challenge;
    res.send(value);
  } else {
    // Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
    const event = req.body.event;

    switch(event.type){
      case 'app_home_opened': {
        displayHome(event);
      }
    }
  }
  
});

function displayHome(event) {
  try {
    // Call the views.publish method using the built-in WebClient
    const result = await slackApp.client.views.publish({
      // The token you used to initialize your app is stored in the `context` object
      token: process.env.SLACK_BOT_TOKEN,
      user_id: event.user,
      view: {
        type: "home",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "A simple stack of blocks for the simple sample Block Kit Home tab.",
            },
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Action A",
                  emoji: true,
                },
              },
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Action B",
                  emoji: true,
                },
              },
            ],
          },
        ],
      },
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

const token = process.env.token;

slackApp.action("click_me", async ({ body, context, ack }) => {
  ack();

  console.log("clicked the button");
});

// Listen to a message containing the substring "hello"
// app.message requires your app to subscribe to the message.channels event
slackApp.message("hello", async ({ payload, context }) => {
  try {
    console.log("called");
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The token you used to initialize your app is stored in the `context` object
      token: context.botToken,
      // Payload message should be posted in the channel where original message was heard
      channel: payload.channel,
      text: "world",
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
});

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text,
      // You could also use a blocks[] array to send richer content
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text:
              "You have a new request:\n*<fakeLink.toEmployeeProfile.com|Fred Enriquez - New device request>*",
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: "*Type:*\nComputer (laptop)",
            },
            {
              type: "mrkdwn",
              text: "*When:*\nSubmitted Aut 10",
            },
            {
              type: "mrkdwn",
              text: "*Last Update:*\nMar 10, 2015 (3 years, 5 months)",
            },
            {
              type: "mrkdwn",
              text: "*Reason:*\nAll vowel keys aren't working.",
            },
            {
              type: "mrkdwn",
              text: '*Specs:*\n"Cheetah Pro 15" - Fast, really fast"',
            },
          ],
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Approve",
              },
              action_id: "click_me",
              style: "primary",
              value: "click_me_123",
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Deny",
              },
              style: "danger",
              value: "click_me_123",
            },
          ],
        },
      ],
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
};

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

(async () => {
  // Start the app
  await slackApp.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");

  // Vinamra Id: U01BA9MBDBM
  // Pompei id:  U01BUCASW4S

  // Direct or channel message
  // publishMessage("U01BA9MBDBM", "Check pompei :tada:");

  // Only visible to you message
  // publishConversation("#general","U01BA9MBDBM", "Shhhh ! Only you can see this !");

  // Get list of all channels and their info
  // findConversation("general");

  // Self message - Impersonate as someone
  // postAsUser(" ", "Just a test !");
})();