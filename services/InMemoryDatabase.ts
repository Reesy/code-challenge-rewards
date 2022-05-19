import Database from "../interfaces/Database";
import Reward from "../interfaces/Reward";
import User from "../interfaces/User";


export default class InMemoryDatabase implements Database
{
    public async getUser(userId: string): Promise<User>
    {
        let user : User = {
            id: "",
            rewards: []
        };
        return user;
    }
    public async getRewards(userId: string, at: string): Promise<Reward[]>
    {
        let rewards : Reward[] = [];
        return rewards;
    }
    public async setRedeemed(userId: string, at: string): Promise<void>
    {
        // throw new Error("Method not implemented.");
    }

};