export const getRootUrl = () =>
  process.env.NODE_ENV === 'production'
    ? 'http://elephant.herokuapp.com'
    : process.env['REACT_APP_CLIENT_URL'];

export const AUTH_EP = `${getRootUrl()}/auth`;

export const params = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  withCredentials: true,
};

export const parseUrl = search => {
  const queries = search.replace(/^\?/, '').split('&');
  let parsedSearch = {};
  queries.map(query => {
    const queryArray = query.split('=');
    parsedSearch = {
      ...parsedSearch,
      [`${queryArray.shift()}`]: queryArray.shift(),
    };
  });
  return parsedSearch;
};

export const getQueryString = location => location.search.slice(1);

export const getSearchQueryString = query =>
  query.toLowerCase().replace(' ', '+');
