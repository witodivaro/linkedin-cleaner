const { linkedinFetcher } = require('./fetcher');
const { urls, options } = require('./urls');

const body = {
  addConnection: (urn, message) => ({
    inviteeProfileUrn: urn,
    customMessage: message,
  }),
};

const addConnection = async (urn, message) => {
  try {
    await linkedinFetcher.post(urls.addConnection, body.addConnection(urn, message), {
      params: options.addConnection,
    });
  } catch (err) {
    if (err.response.status === 429) {
      console.log(`Too many connection requests.`);
    } else {
      console.log(err.response);
      console.log('Error! Probably the contact is already added');
    }
  }
};

module.exports = {
  addConnection,
};
