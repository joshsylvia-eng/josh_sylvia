// Test Mailtrap API directly
const { MailtrapClient } = require('mailtrap');

const TOKEN = '607ef5e8b5da9a30591e536ee4d19573';

const client = new MailtrapClient({
  token: TOKEN,
});

const sender = {
  email: 'hello@demomailtrap.co',
  name: 'Mailtrap Test',
};

const recipients = [
  {
    email: 'joshsylvia@gmail.com',
  }
];

client
  .send({
    from: sender,
    to: recipients,
    subject: 'You are awesome!',
    text: 'Congrats for sending test email with Mailtrap!',
    category: 'Integration Test',
  })
  .then(console.log)
  .catch(console.error);
