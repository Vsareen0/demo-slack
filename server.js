require("dotenv").config();
const bodyParser = require("body-parser");
const { App, ExpressReceiver } = require("@slack/bolt");
const axios = require("axios");

// Create a Bolt Receiver
const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const slackApp = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN,
});
var jsonParser = bodyParser.json();
var urlEncorder = bodyParser.urlencoded({
  extended: true,
});

// Other web requests are methods on receiver.router
receiver.router.get("/", (req, res) => {
  // You're working with an express req and res now.
  res.send("yay!");
});

// Other web requests are methods on receiver.router
receiver.router.post("/challenge", jsonParser, (req, res) => {
  // You're working with an express req and res now.
  if (req.body.type == "url_verification") {
    const value = req.body.challenge;
    res.send(value);
  } else {
    // Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
    console.log("events: ", req.body.event);

    const event = req.body.event;

    switch (event.type) {
      case "app_home_opened": {
        displayHome(event);
        break;
      }
      case "message": {
        handleMessageEvent(event);
        break;
      }
      case "app_mention": {
        if (event.text.includes("create learning path")) {
          sendLearningPath(event);
        }
        if (event.text.includes("button")) {
          sendButton(event);
        }
        break;
      }
    }
  }
  res.send({ text: "text" });
});

receiver.router.post("/slashcommand", urlEncorder, async (req, res) => {
  // The open_modal shortcut opens a plain old modal
  // Shortcuts require the command scope
  const { response_url, trigger_id } = req.body;
  res.send({ text: "test" });
  openModal(trigger_id);
});

receiver.router.post("/actions", urlEncorder, (req, res) => {
  //Your middleware will only be called when the action_id matches 'select_user' AND the block_id matches 'assign_ticket'
  res.send({ text: "👍" });

  console.log("actions: ", req.body.payload);
});

async function openModal(id) {
  // Call the views.open method using the built-in WebClient
  const result = await slackApp.client.views.open({
    // The token you used to initialize your app is stored in the `context` object
    token: process.env.SLACK_BOT_TOKEN,
    trigger_id: id,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Gratitude Box",
        emoji: true,
      },
      submit: {
        type: "plain_text",
        text: "Submit",
        emoji: true,
      },
      close: {
        type: "plain_text",
        text: "Cancel",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          block_id: "my_block",
          element: {
            type: "plain_text_input",
            action_id: "my_action",
          },
          label: {
            type: "plain_text",
            text: "Say something nice!",
            emoji: true,
          },
        },
      ],
    },
  });
}

async function sendLearningPath(event) {
  try {
    const result = await slackApp.client.chat.postMessage({
      // The token you used to initialize your app is stored in the `context` object
      token: process.env.SLACK_BOT_TOKEN,
      // Payload message should be posted in the channel where original message was heard
      channel: event.channel,
      text: "world",
      thread_ts: event.ts,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Fill in the details:",
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Birthdate*",
          },
          accessory: {
            type: "datepicker",
            initial_date: "1990-04-28",
            placeholder: {
              type: "plain_text",
              text: "Select a date",
              emoji: true,
            },
            action_id: "datepicker-action",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Choose your gender*",
          },
          accessory: {
            type: "radio_buttons",
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Male",
                  emoji: true,
                },
                value: "male",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Female",
                  emoji: true,
                },
                value: "female",
              },
            ],
            action_id: "radio_buttons-action",
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: "*Choose the area of your interest*",
          },
          accessory: {
            type: "static_select",
            placeholder: {
              type: "plain_text",
              text: "Select an interest",
              emoji: true,
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "AI",
                  emoji: true,
                },
                value: "AI",
              },
              {
                text: {
                  type: "plain_text",
                  text: "ML",
                  emoji: true,
                },
                value: "ML",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Data Science",
                  emoji: true,
                },
                value: "Data Science",
              },
            ],
            action_id: "static_select-action",
          },
        },
      ],
    });
    return;
  } catch (error) {
    console.error(error);
  }
}

async function sendButton(event) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The token you used to initialize your app is stored in the `context` object
      token: process.env.SLACK_BOT_TOKEN,
      // Payload message should be posted in the channel where original message was heard
      channel: event.channel,
      thread_ts: event.ts,
      blocks: [
        {
          type: "divider",
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Click Me",
                emoji: true,
              },
              value: "click_me_123",
              action_id: "approve_button",
              style: "primary",
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
}

async function handleMessageEvent(event) {
  try {
    if (event.text == "hello") {
      // Call the chat.postMessage method using the built-in WebClient
      const result = await slackApp.client.chat.postMessage({
        // The token you used to initialize your app is stored in the `context` object
        token: process.env.SLACK_BOT_TOKEN,
        // Payload message should be posted in the channel where original message was heard
        channel: event.channel,
        text: "world",
        thread_ts: event.ts,
      });
    }
  } catch (error) {
    console.error(error);
  }
}

async function displayHome(event) {
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
            type: "image",
            image_url:
              "https://yogya.ai/wp-content/uploads/2020/01/yogya-black-transparent.png",
            alt_text: "marg",
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "Welcome to *Yogya.ai*, We are so excited to begin this journey with you !",
            },
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "*Instructions:* \n\n Below are some guidelines to follow to get started with us. :fire: \n\n\n\n *Commands:*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "To ask us any question, you can use */ask*",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "\n\n\n\n*Mentions:* \n\n Whenever you mention us somewhere, we will listen you and respond you with appropriate responses at earliest. To mention us use *_@Pompei_* ",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:
                "\n\n\n\n*Keep supporting us, and we promise to deliever th best of our capatabilities*",
            },
          },
        ],
      },
    });

    return;
  } catch (error) {
    console.error(error);
  }
}

const token = process.env.token;

// Post a message to a channel your app is in using ID and message text
async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await slackApp.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text,
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

(async () => {
  // Start the app
  await slackApp.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");

  // Vinamra Id: U01BA9MBDBM
  // Pompei id:  U01BUCASW4S

  const { data } = await axios.post(
    `https://slack.com/api/auth.test?token=${process.env.token}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  publishMessage(
    `@${data.user}`,
    "Hi :wave:, thankyou for choosing us ! :blush:. Let's get started working on boosting your performance. :fire:"
  );

  // Only visible to you message
  // publishConversation("#general","U01BA9MBDBM", "Shhhh ! Only you can see this !");

  // Get list of all channels and their info
  // findConversation("general");

  // Self message - Impersonate as someone
  // postAsUser(" ", "Just a test !");
})();
