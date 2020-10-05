/* 
 * Slack API Demo 
 * This example shows how to utilize the App Home feature
 * October 11, 2019
 *
 * This example is written in Bolt
 * To see how this can be written in plain JavaScript, see https://glitch.com/~apphome-demo-note
 */
const { App } = require('@slack/bolt');
const appHome = require('./appHome');
const message = require('./message');

require('dotenv').config();

// Initializes your Bolt app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.event('app_home_opened', async ({ event, context, payload }) => {
  // Display App Home
  const homeView = await appHome.createHome(event.user);
  
  try {
    const result = await app.client.views.publish({
      token: context.botToken,
      user_id: event.user,
      view: homeView
    });
    
  } catch(e) {
    app.error(e);
  }
  
});

// Receive button actions from App Home UI "Add a Stickie"
app.action('add_note', async ({ body, context, ack }) => {
  ack();
  
  // Open a modal window with forms to be submitted by a user
  const view = appHome.openModal();
  
  try {
    const result = await app.client.views.open({
      token: context.botToken,
      trigger_id: body.trigger_id,
      view: view
    });
    
  } catch(e) {
    console.log(e);
    app.error(e);
  }
});

// Receive view_submissions
app.view('modal_view', async ({ ack, body, context, view }) => {
  ack();
  
  const ts = new Date();
  
  const data = {
    timestamp: ts.toLocaleString(),
    note: view.state.values.note01.content.value,
    color: view.state.values.note02.color.selected_option.value
  }

  const homeView = await appHome.createHome(body.user.id, data);

  try {
    const result = await app.client.apiCall('views.publish', {
      token: context.botToken,
      user_id: body.user.id,
      view: homeView
    });

  } catch(e) {
    console.log(e);
    app.error(e);
  }
    
});

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
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
  send('U01BA9MBDBM', 'Somethign !');
})();

module.exports = { app };