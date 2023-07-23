const headers = require('../req-headers.json');
const { linkedinFetcher } = require('./fetcher');
const { urls, options } = require('./urls');

const fetchSecondConnections = async (page, count, keywords) => {
  try {
    const res = await linkedinFetcher.get(urls.secondConnections, {
      params: options.secondConnections(page, count, keywords),
      headers,
    });

    const recruitersWithMeta = res.data.included.filter((el) => !!el.title);

    const parsedRecruiters = recruitersWithMeta.map((recruiter) => ({
      name: recruiter.title.text,
      position: recruiter.primarySubtitle.text,
      location: recruiter.secondaryTitle?.text,
      past: recruiter.summary?.text,
      entityUrn: recruiter.entityUrn.slice(
        recruiter.entityUrn.indexOf('(') + 1,
        recruiter.entityUrn.indexOf(',') - recruiter.entityUrn.indexOf('()') - 1
      ),
    }));

    return parsedRecruiters;
  } catch (err) {
    console.log('error', err);
  }
};

module.exports = {
  fetchSecondConnections,
};
