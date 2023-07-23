const prompt = require('prompt');
const { fetchFirstConnections } = require('../lib/fetchFirstConnections');
const { linkedinFetcher } = require('../lib/fetcher');
const { urls, options } = require('../lib/urls');

// {"connectedMember":"urn:li:fsd_profile:ACoAAC9M0UwBWQbZi_yuj7jG_U-uMiR-mbRD8sE"}
// https://www.linkedin.com/voyager/api/relationships/dash/connections?action=removeFromMyConnections

prompt.start();

const removeConnection = async (entityUrn) => {
  try {
    await linkedinFetcher.post(
      urls.removeConnection,
      {
        connectionUrn: entityUrn,
      },
      {
        params: options.removeConnection,
      }
    );
  } catch (err) {
    console.log(`Couldn't remove ${entityUrn}`, err);
  }
};

const filterRemove = async (keywords) => {
  const members = await fetchFirstConnections();

  const trashCons = members.filter((member) => filterByHeadline(member.headline, keywords));

  console.log(`Found ${trashCons.length}`);

  for (const recruiter of trashCons) {
    console.log(`\nRemoving ${recruiter.name}, ${recruiter.headline}\n`);
    await removeConnection(recruiter.entityUrn);
  }

  console.log(`Removed ${trashCons.length}`);
};

const filterByHeadline = (headline, keywords) => {
  if (!headline) return false;
  return keywords.some((company) => headline.toLowerCase().includes(company));
};

const promptRemove = async () => {
  const members = await fetchFirstConnections();

  for (const [idx, member] of members.entries()) {
    const { save } = await prompt.get({
      properties: {
        save: {
          message: `${idx + 1}/${members.length}: ${member.name}\n${member.headline}\nEnter any character to save`,
        },
      },
    });

    if (!save) {
      console.log(`Removing ${member.name}`);
      await removeConnection(member.connectionUrn);
    } else {
      console.log(`Saving ${member.name}`);
    }
    console.log('\n\n');
  }
};

const promptNameRemove = async () => {
  const members = await fetchFirstConnections();

  const grouped = members.reduce((groupedMembers, member) => {
    const firstName = member.name.split(' ')[0].toLowerCase();
    if (!groupedMembers[firstName]) {
      groupedMembers[firstName] = [];
    }

    groupedMembers[firstName].push(member);
    return groupedMembers;
  }, {});

  for (const name of Object.keys(grouped)) {
    const membersInGroup = grouped[name];
    const { save } = await prompt.get({
      properties: {
        save: {
          message: `${name}: \n${membersInGroup
            .map(({ name, headline }) => [name, headline].join(' - '))
            .join('\n')}\n\nEnter any character to save`,
        },
      },
    });

    if (!save) {
      for (const member of membersInGroup) {
        console.log(`Removing ${member.name}`);
        await removeConnection(member.entityUrn);
      }
    } else {
      console.log(`Saving ${name}`);

      for (const member of membersInGroup) {
        const { save } = await prompt.get({
          properties: {
            save: {
              message: `${member.name}\n${member.headline}\nEnter any character to save`,
            },
          },
        });

        if (!save) {
          console.log(`Removing ${member.name}`);
          await removeConnection(member.entityUrn);
        } else {
          console.log(`Saving ${member.name}`);
        }
        console.log('\n\n');
      }
    }
    console.log('\n\n');
  }
};

module.exports = {
  promptRemove,
  filterRemove,
  promptNameRemove,
};
