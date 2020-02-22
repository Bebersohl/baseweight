import React from 'react';
import { RouteComponentProps } from '@reach/router';

import Typography from '@material-ui/core/Typography';

const NotFoundScreen: React.FC<RouteComponentProps> = () => {
  return (
    <div>
      <Typography variant="h4">Not Found</Typography>
    </div>
  );
};

export default NotFoundScreen;
