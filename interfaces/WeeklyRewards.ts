import Reward from "./Reward";

//Keyed by the closest prior sunday to the current date
export default interface WeeklyRewards
{
    id: string;  //The nearest prior sunday
    rewards: Reward[];
}