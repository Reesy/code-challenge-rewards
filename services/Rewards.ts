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
                    if (rewards.length === 0)
                    {
                        rewards = this.generateRewards(at);
                    };
                    resolve(rewards);
                }).catch((error: Error) =>
                {
                    reject(error);
                });
        });
    };

    private generateRewards(at: string): Reward[]
    {
        const dayInMilliseconds = 86400000;
        let targetDate : any = new Date(at);
        let day = targetDate.getDay();
        let elapsedDaysSinceSunday : number = dayInMilliseconds * day 
        let priorSundayInMilliseconds: number  = targetDate - elapsedDaysSinceSunday;

        let rewards: Reward[] = [];
        for (let weekday = 0; weekday <= 6; weekday++)
        {

            let availableAtInMilliseconds = priorSundayInMilliseconds + (dayInMilliseconds * weekday);
            let availableAt = new Date(availableAtInMilliseconds);
            availableAt.setHours(0, 0, 0); // strip hours off date

            // Throw away the miliseconds component 
            // I would push back on the requirements here, It's probably cleaner to keep the miliseconds component and not worry about errors from string manipulation. 
            let availableAtString = availableAt.toISOString().split(".")[0]+"Z";


            let expiresAtInMilliseconds = availableAtInMilliseconds + dayInMilliseconds;
            let expiresAt = new Date(expiresAtInMilliseconds);
            expiresAt.setHours(0, 0, 0);


            let expiresAtString = expiresAt.toISOString().split(".")[0]+"Z";
            let reward: Reward = {
                availableAt: availableAtString,
                redeemedAt: null,
                expiresAt: expiresAtString
            };

            rewards.push(reward);
        
        };

        // Strip off a zero from the end 
        return rewards;        
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