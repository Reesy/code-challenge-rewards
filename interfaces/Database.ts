import Reward from "./Reward";
import User from "./User";

export default interface Database
{
    getUser(userId: string): Promise<User>;
    getWeeksRewards(userId: string, priorSunday: string): Promise<Reward[]>;
    addRewards(userId: string, rewards: Reward[]): Promise<void>
    setRedeemed(userId: string, at: string): Promise<Reward>;
    addUser(userId: string): Promise<void>
};