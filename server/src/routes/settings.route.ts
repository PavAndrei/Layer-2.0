import { Router } from 'express';

import { getStoreSettings } from '../controllers/settings.controllers';
import { catchErrors } from '../utils/catch-errors';

const settingsRoute = Router();

settingsRoute.get('/', catchErrors(getStoreSettings));

export default settingsRoute;
