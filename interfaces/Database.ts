import Reward from "./Reward";
import User from "./User";

export default interface Database
{
    getUser(userId: string): Promise<User>;
    getRewards(userId: string, at: string): Promise<Reward[]>;
    setRedeemed(userId: string, at: string): Promise<Reward>;
};