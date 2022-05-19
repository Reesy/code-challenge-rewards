import Database from "../interfaces/Database";
import Reward from "../interfaces/Reward";

export default class Rewards 
{
    private _database: Database;

    constructor(database: Database) 
    {
        this._database = database;
    }

    public getRewards(userId: string, at: string): Promise<Reward[]>
    {
        return new Promise<Reward[]>((resolve, reject) =>
        {
            try
            {
                this.validateUserId(userId);
                this.validateAt(at);
            } catch (error)
            {
                reject(error);
            };

            this._database.getRewards(userId, at)
                .then((rewards: Reward[]) =>
                {
                    resolve(rewards);
                }).catch((error: Error) =>
                {
                    reject(error);
                });
        });
    };


    private validateUserId(userId: string): void
    {
        if (isNaN(Number(userId)))
        {
            throw new Error("The userId must be a number.");
        };
        return;
    };

    private validateAt(at: string): void
    {
        if (isNaN(Date.parse(at)))
        {
            throw new Error("The 'at' query parameter must be a valid date.");
        }
        return;
    };

}