import Database from "../interfaces/Database";
import Reward from "../interfaces/Reward";



export default class Rewards 
{
    private _database: Database;

    constructor(database: Database) 
    {
        this._database = database;
    }

    public async getRewards(userId: string, at: string): Promise<Reward[]>
    {   
        this.validateUserId(userId);
        this.validateAt(at);
        let user = await this._database.getUser(userId);
        let rewards = user.rewards;
        return rewards;
    };


    private validateUserId(userId: string): void
    {
      
    };

    private validateAt(at: string): void
    {

    
    };
}