import 'server-only';

import * as products from './products';
import * as users from './users';
import * as customers from './customers';


export const db = {
    ...products,
    ...users,
    ...customers,
}