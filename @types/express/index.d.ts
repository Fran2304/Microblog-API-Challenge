/* eslint-disable no-unused-vars */

import { User } from "../../src/type/types";

declare global{
    namespace Express {
        interface Request {
            user: User
        }
    }
}

