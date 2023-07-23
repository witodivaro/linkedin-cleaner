const prompt = require('prompt');
const { fetchSecondConnections } = require('../lib/fetchSecondConnections');
const { addConnection } = require('../lib/addConnection');

prompt.start();

const promptAdd = async () => {
  const members = await fetchSecondConnections(page, COUNT, KEYWORDS);

  for (const [idx, member] of members.entries()) {
    const { skip } = await prompt.get({
      properties: {
        skip: {
          message: `${idx + 1}/${members.length}: ${member.name}\n${member.position}\n${member.location}\n${
            member.past
          }\nEnter any character to skip`,
        },
      },
    });

    if (!skip) {
      console.log(`Adding ${member.name}`);
      await addConnection(member.entityUrn, member.name.split(' ')[0]);
    } else {
      console.log(`Skipping ${member.name}`);
    }
    console.log('\n\n');
  }
};

/**
 * Automatically adds your second connections based on keywords
 * 
 * @param {Number} page current network search page 
 * @param {Number} count amount of people to add
 * @param {Number} keywords keywords to search for (e.g. Recruiter)
 * @param {String} blankMessage Connection message
 */
const autoAdd = async ({ page, count, keywords, blankMessage = 'Hi {firstName}!' }) => {
  const members = await fetchSecondConnections(page, count, keywords);

  for (const [idx, member] of members.entries()) {
    console.log(
      `[${idx}] Adding ${member.name}\nPOSITION: ${member.position || 'No information'}\nLOCATION: ${
        member.location || 'No information'
      }\n${member.past}\n`
    );

    const firstName = member.name.split(' ')[0];
    const message = blankMessage.replace('{firstName}', firstName);

    console.log(`Adding ${member.name}: ${message}`);
    await addConnection(member.entityUrn, message);

    const waitTime = Math.round(Math.random() * 100000) / 10;
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    console.log(`Waiting for ${waitTime / 1000}s`);
    console.log('\n\n');
  }
};

module.exports = { autoAdd };
