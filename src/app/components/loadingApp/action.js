import { createAction } from '@reduxjs/toolkit';

import * as nameConst from './const';

export const loadingOpen = createAction(nameConst.COMMON_LOADING_OPEN);
export const loadingClose = createAction(nameConst.COMMON_LOADING_CLOSE);
