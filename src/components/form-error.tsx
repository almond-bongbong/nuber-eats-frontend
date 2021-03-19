import React, { ReactElement } from 'react';

interface Props {
  errorMessage: string;
}

function FormError({ errorMessage }: Props): ReactElement {
  return (
    <span role="alert" className="font-medium text-red-500">
      {errorMessage}
    </span>
  );
}

export default FormError;
