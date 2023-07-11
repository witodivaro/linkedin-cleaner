const axios = require("axios");
const prompt = require("prompt");
const headers = require("../req-headers.json");

prompt.start();

const urls = {
  connections: "/voyager/api/relationships/dash/connections",
  removeConnection: "/voyager/api/relationships/dash/connections",
};

const options = {
  getConnections: {
    decorationId:
      "com.linkedin.voyager.dash.deco.web.mynetwork.ConnectionListWithProfile-15",
    count: 2000,
    q: "search",
    sortType: "RECENTLY_ADDED",
    start: 10,
  },
  removeConnection: {
    action: "removeFromMyConnections",
  },
};

const linkedinFetcher = axios.create({
  baseURL: 'https://linkedin.com',
  headers,
});

const removeConnection = async (entityUrn) => {
  try {
    await linkedinFetcher.post(
      urls.removeConnection,
      {
        connectedMember: entityUrn,
      },
      {
        params: options.removeConnection,
        headers,
      }
    );
  } catch (err) {
    console.log(`Couldn't remove ${entityUrn}`, err);
  }
};

const fetchConnections = async () => {
  try {
    const res = await linkedinFetcher.get(urls.connections, {
      params: options.getConnections,
    });

    console.log(res.data.elements[0]);

    const members = res.data.elements.map(
      ({ connectedMemberResolutionResult, entityUrn }) => ({
        name:
          connectedMemberResolutionResult?.firstName +
          " " +
          connectedMemberResolutionResult?.lastName,
        entityUrn: connectedMemberResolutionResult?.entityUrn,
        connectionUrn: entityUrn,
        headline: connectedMemberResolutionResult?.headline,
      })
    );

    return members;
  } catch (err) {
    console.log("error", err);
  }
};

const filterRemove = async (keywords) => {
  const members = await fetchConnections();

  const trashCons = members.filter((member) =>
    filterByHeadline(member.headline, keywords)
  );

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
  const members = await fetchConnections();

  for (const [idx, member] of members.entries()) {
    const { save } = await prompt.get({
      properties: {
        save: {
          message: `${idx + 1}/${members.length}: ${member.name}\n${
            member.headline
          }\nEnter any character to save`,
        },
      },
    });

    if (!save) {
      console.log(`Removing ${member.name}`);
      await removeConnection(member.entityUrn);
    } else {
      console.log(`Saving ${member.name}`);
    }
    console.log("\n\n");
  }
};

const promptNameRemove = async () => {
  const members = await fetchConnections();

  const grouped = members.reduce((groupedMembers, member) => {
    const firstName = member.name.split(" ")[0].toLowerCase();
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
            .map(({ name, headline }) => [name, headline].join(" - "))
            .join("\n")}\n\nEnter any character to save`,
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
              message: `${member.name}\n${
                member.headline
              }\nEnter any character to save`,
            },
          },
        });

        if (!save) {
          console.log(`Removing ${member.name}`);
          await removeConnection(member.entityUrn);
        } else {
          console.log(`Saving ${member.name}`);
        }
        console.log("\n\n");
      }
    }
    console.log("\n\n");
  }
};

module.exports = {
  promptRemove,
  filterRemove,
  promptNameRemove,
};