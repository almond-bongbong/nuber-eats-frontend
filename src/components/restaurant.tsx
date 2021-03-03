import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  id: string;
  coverImage: string;
  name: string;
  categoryName?: string;
}

function Restaurant({
  id,
  coverImage,
  name,
  categoryName,
}: Props): ReactElement {
  return (
    <Link to={`/restaurant/${id}`} className="flex flex-col">
      <div
        style={{ backgroundImage: `url(${coverImage})` }}
        className="bg-red-500 bg-cover bg-center mb-3 py-28"
      />
      <h3 className="text-xl">{name}</h3>
      <span className="border-t mt-4 py-2 text-xs opacity-50 border-gray-300">
        {categoryName}
      </span>
    </Link>
  );
}

export default Restaurant;
