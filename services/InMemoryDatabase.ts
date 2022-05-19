import Database from "../interfaces/Database";
import Reward from "../interfaces/Reward";
import User from "../interfaces/User";
import WeeklyRewards from "../interfaces/WeeklyRewards";


export default class InMemoryDatabase implements Database
{   

    private _users: User[] = [];


    public async getUser(userId: string): Promise<User>
    {
        let currentUser = this._users.find(user => user.id === userId);
        return currentUser!;
    }

    public async getWeeksRewards(userId: string, weekStart: string): Promise<Reward[]>
    {
        let currentUser: User = this._users.find(user => user.id === userId)!;

        if (typeof(currentUser) === "undefined")
        {
            throw 'No user found when calling the database getRewards'
        }
        let weekRewards = currentUser.weeklyRewards.find(weeklyReward => weeklyReward.id === weekStart);

        if (typeof(weekRewards) === "undefined")
        {
            return [];
        }

        return weekRewards.rewards;
    }

    public async addRewards(userId: string, rewards: Reward[]): Promise<void>
    {
        let user = this._users.find(user => user.id === userId);
        let weeklyReward: WeeklyRewards = {
            id: rewards[0].availableAt, //First sunday in the entry, which we will use as a key
            rewards: rewards
        };

        if (typeof(user) === "undefined")
        {
            throw "User not found";
        }
        
        user.weeklyRewards.push(weeklyReward);

        return; 
    }
    public async setRedeemed(userId: string, at: string): Promise<Reward>
    {
        let reward : Reward = {
            availableAt: "",
            redeemedAt: null,
            expiresAt: ""
        };
        return reward;
        // throw new Error("Method not implemented.");
    };

    public async addUser(userId: string): Promise<void>
    {
        let newUser: User = {
            id: userId,
            weeklyRewards: []
        };

        this._users.push(newUser);
        return;
    }
};