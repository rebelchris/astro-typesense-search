const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: TYPESENSE_SEARCH_KEY,
    nodes: [
      {
        host: TYPESENSE_HOST,
        port: TYPESENSE_PORT,
        protocol: TYPESENSE_PROTOCOL,
      },
    ],
    cacheSearchResultsForSeconds: 2 * 60,
  },
  additionalSearchParameters: {
    queryBy: 'title,description',
  },
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
const search = instantsearch({
  searchClient,
  indexName: 'posts',
});
search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#searchbox',
  }),
  instantsearch.widgets.hits({
    container: '#hits',
    templates: {
      item: `
        <div class="search-preview">
            <a href="{{slug}}"><h3>{{title}}</h3></a>
            <p>{{ description }}</p>
                <a href="{{ slug }}">Read more</a>
        </div>`,
    },
  }),
]);
search.start();
