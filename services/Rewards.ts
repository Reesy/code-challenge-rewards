import Database from "../interfaces/Database";
import Reward from "../interfaces/Reward";

const dayInMilliseconds = 86400000;

export default class Rewards 
{

    private _database: Database;

    constructor(database: Database) 
    {
        this._database = database;
    }

    public async getRewards(userId: string, at: string): Promise<Reward[]>
    {
        try
        {
            this.validateUserId(userId);
            this.validateAt(at);
        } catch (error)
        {
            throw error;
        };

        let user = await this._database.getUser(userId);

        if (typeof(user) === "undefined")
        {
           await this._database.addUser(userId);
        }

        let rewards = await this._database.getWeeksRewards(userId, this.getWeekStart(at));

        if (rewards.length === 0)
        {
            await this._database.addRewards(userId, this.generateRewards(at));
            rewards = await this._database.getWeeksRewards(userId, this.getWeekStart(at));
        }

        return rewards;

    };


    public redeemReward(userId: string, rewardId: string): Promise<Reward>
    {
        return new Promise<Reward>((resolve, reject) =>
        {
            try
            {
                this.validateUserId(userId);
                this.validateRewardId(rewardId);
            } catch (error)
            {
                reject(error);
            };

            this._database.setRedeemed(userId, rewardId)
                .then((reward: Reward) =>
                {
                    resolve(reward);
                }
                ).catch((error: Error) =>
                {
                    reject(error);
                }
                );

        });

    };

    private generateRewards(at: string): Reward[]
    {
        let targetDate: any = new Date(at);
        let day = targetDate.getDay();
        let elapsedDaysSinceSunday: number = dayInMilliseconds * day
        let priorSundayInMilliseconds: number = targetDate - elapsedDaysSinceSunday;

        let rewards: Reward[] = [];
        for (let weekday = 0; weekday <= 6; weekday++)
        {

            let availableAtInMilliseconds = priorSundayInMilliseconds + (dayInMilliseconds * weekday);
            let availableAt = new Date(availableAtInMilliseconds);
            availableAt.setHours(0, 0, 0); // strip hours off date

            // Throw away the miliseconds component 
            // I would push back on the requirements here, It's probably cleaner to keep the miliseconds component and not worry about errors from string manipulation. 
            let availableAtString = availableAt.toISOString().split(".")[0] + "Z";


            let expiresAtInMilliseconds = availableAtInMilliseconds + dayInMilliseconds;
            let expiresAt = new Date(expiresAtInMilliseconds);
            expiresAt.setHours(0, 0, 0);


            let expiresAtString = expiresAt.toISOString().split(".")[0] + "Z";
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



    private getWeekStart(date: string): string
    {
        let targetDate: any = new Date(date);
        let day = targetDate.getDay();
        let elapsedDaysSinceSunday: number = dayInMilliseconds * day
        let weekStartInMilliseconds: number = targetDate - elapsedDaysSinceSunday;
        let weekStart = new Date(weekStartInMilliseconds);
        weekStart.setHours(0, 0, 0); 
        return weekStart.toISOString().split(".")[0] + "Z";
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

    private validateRewardId(rewardId: string): void
    {
        if (isNaN(Number(rewardId)))
        {
            throw new Error("The rewardId must be a valid date string.");
        }
    };

}