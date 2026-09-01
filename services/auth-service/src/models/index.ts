import {sequelize} from "@/db/sequelize";
import {UserCredentials} from "@/models/user-credentials.model";
import { RefreshToken } from "@/models/refresh-token.models";
export const initModels = async () => {
    await sequelize.sync();

};
export {UserCredentials};