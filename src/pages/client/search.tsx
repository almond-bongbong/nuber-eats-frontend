import React, { ReactElement } from 'react';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

function Search(): ReactElement {
  const { search } = useLocation();
  const { term } = qs.parse(search);

  return <div>Search {term}</div>;
}

export default Search;
