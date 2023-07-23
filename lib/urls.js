const urls = {
  firstConnections: '/voyager/api/relationships/dash/connections',
  secondConnections: '/voyager/api/search/dash/clusters',
  addConnection: '/voyager/api/voyagerRelationshipsDashMemberRelationships',
  removeConnection: '/voyager/api/relationships/dash/memberRelationships',
};

const options = {
  secondConnections: (page, count, keywords) => ({
    decorationId: 'com.linkedin.voyager.dash.deco.search.SearchClusterCollection-174',
    origin: 'FACETED_SEARCH',
    q: 'all',
    query: `(keywords:${keywords},flagshipSearchIntent:SEARCH_SRP,queryParameters:(network:List(S),resultType:List(PEOPLE)),includeFiltersInResponse:false)`,
    start: page * count,
    count,
  }),
  addConnection: {
    action: 'verifyQuotaAndCreate',
    decorationId: 'com.linkedin.voyager.dash.deco.relationships.InvitationCreationResult-2',
  },
  firstConnections: {
    decorationId:
      "com.linkedin.voyager.dash.deco.web.mynetwork.ConnectionListWithProfile-15",
    count: 2000,
    q: "search",
    sortType: "RECENTLY_ADDED",
    start: 0,
  },
  removeConnection: {
    action: "removeFromMyConnections",
    decorationId: "com.linkedin.voyager.dash.deco.relationships.MemberRelationship-33",
  },
};

module.exports = { urls, options };
