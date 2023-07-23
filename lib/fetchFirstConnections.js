const { linkedinFetcher } = require('./fetcher');
const { urls, options } = require('./urls');

const fetchFirstConnections = async () => {
  try {
    const res = await linkedinFetcher.get(urls.firstConnections, {
      params: options.firstConnections,
    });

    const members = res.data.included.map(({ lastName, headline, firstName, entityUrn, ...rest }) => {
      return { name: firstName + ' ' + lastName, entityUrn, connectionUrn: entityUrn.replace('fsd_profile', 'fsd_connection'), headline };
    });

    return members;
  } catch (err) {
    console.log('error', err);
  }
};

module.exports = { fetchFirstConnections };
