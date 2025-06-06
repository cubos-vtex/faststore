export const RedirectQueryTermTech = `query RedirectSearch {
    redirect(term: "tech") {
        url
    }
  }
  `

export const redirectTermTechFetch = {
  info: 'https://storeframework.vtexcommercestable.com.br/api/io/_v/api/intelligent-search/product_search/trade-policy/1?page=2&count=1&query=tech&sort=&locale=en-US&hideUnavailableItems=false&simulationBehavior=skip&showSponsored=false&allowRedirect=true',
  init: {
    headers: { 'X-FORWARDED-HOST': '', 'content-type': 'application/json' },
  },
  options: undefined,
  result: {
    products: [],
    recordsFiltered: 0,
    fuzzy: 'auto',
    operator: 'and',
    redirect: '/technology',
    translated: false,
    pagination: {
      count: 1,
      current: {
        index: 0,
      },
      before: [],
      after: [],
      perPage: 0,
      next: {
        index: 0,
      },
      previous: {
        index: 0,
      },
      first: {
        index: 0,
      },
      last: {
        index: 0,
      },
    },
  },
}
