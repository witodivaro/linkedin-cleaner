const axios = require("axios");
const prompt = require("prompt");
const reqHeaders = require("../req-headers.json");

prompt.start();

const [_, __, day] = process.argv;

const START = 0;
const COUNT = 30;
const START_DAY = Number(day);

const urls = {
  fetchSecondConnections: "/voyager/api/search/dash/clusters",
  addConnection: "/voyager/api/voyagerRelationshipsDashMemberRelationships",
};

const options = {
  fetchSecondConnections: {
    decorationId:
      "com.linkedin.voyager.dash.deco.search.SearchClusterCollection-174",
    origin: "FACETED_SEARCH",
    q: "all",
    query:
      "(keywords:acquisition,flagshipSearchIntent:SEARCH_SRP,queryParameters:(network:List(S),resultType:List(PEOPLE)),includeFiltersInResponse:false)",
    start: START + (START_DAY * COUNT),
    count: COUNT,
  },
  addConnection: {},
};

const body = {
  addConnection: (urn, name) => ({
    inviteeProfileUrn: urn,
    customMessage: `Hi ${name}, I'm broadening my connections network.`,
  }),
};

const linkedinFetcher = axios.create({
  baseURL: "https://linkedin.com",
  headers: reqHeaders,
});

const fetchConnections = async () => {
  try {
    const res = await linkedinFetcher.get(urls.fetchSecondConnections, {
      params: options.fetchSecondConnections,
      headers: reqHeaders,
    });

    const recruitersWithMeta = res.data.included.filter((el) => !!el.title);

    const parsedRecruiters = recruitersWithMeta.map((recruiter) => ({
      name: recruiter.title.text,
      position: recruiter.primarySubtitle.text,
      location: recruiter.secondaryTitle?.text,
      past: recruiter.summary?.text,
      entityUrn: recruiter.entityUrn.slice(
        recruiter.entityUrn.indexOf("(") + 1,
        recruiter.entityUrn.indexOf(",") - recruiter.entityUrn.indexOf("()") - 1
      ),
    }));

    return parsedRecruiters;
  } catch (err) {
    console.log("error", err);
  }
};

const addConnection = async (urn, name) => {
  try {
    await axios.post(
      "https://www.linkedin.com/voyager/api/voyagerRelationshipsDashMemberRelationships?action=verifyQuotaAndCreate&decorationId=com.linkedin.voyager.dash.deco.relationships.InvitationCreationResult-2",
      body.addConnection(urn, name),
      {
        headers: reqHeaders,
      }
    );
    console.log(body.addConnection(urn, name).customMessage);
    console.log("Successfully added " + name);
  } catch (err) {
    console.log(err.response);
    console.log("Error! Probably the contact is already added");
  }
};

const promptAdd = async () => {
  const members = await fetchConnections();

  for (const [idx, member] of members.entries()) {
    const { skip } = await prompt.get({
      properties: {
        skip: {
          message: `${idx + 1}/${members.length}: ${member.name}\n${
            member.position
          }\n${member.location}\n${member.past}\nEnter any character to skip`,
        },
      },
    });

    if (!skip) {
      console.log(`Adding ${member.name}`);
      await addConnection(member.entityUrn, member.name.split(" ")[0]);
    } else {
      console.log(`Skipping ${member.name}`);
    }
    console.log("\n\n");
  }
};

const autoAdd = async () => {
  const members = await fetchConnections();

  for (const [idx, member] of members.entries()) {
    console.log(
      `[${idx}] Adding ${member.name}\nPOSITION: ${member.position || 'No information'}\nLOCATION: ${
        member.location || 'No information'
      }\n${member.past}\n`
    );
    await addConnection(member.entityUrn, member.name.split(" ")[0]);
    console.log("\n\n");
  }
};

module.exports = () => {
  autoAdd();
};
