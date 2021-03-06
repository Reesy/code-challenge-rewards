import express from 'express';
import Database from './interfaces/Database';
import Reward from './interfaces/Reward';
import InMemoryDatabase from './services/InMemoryDatabase';
import Rewards from './services/Rewards';

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

interface GetRewardsResponse
{
  data : Reward[]
};

interface PatchRewardsResponse
{
  data: Reward;
};

// I've typed towards an interface here so that in future this could be swapped to a different database without having to make many changes.
// As long as any new databases adhere to the database interface it should be relatively easy to swap out.
let database: Database = new InMemoryDatabase();
let rewards = new Rewards(database);

app.get('/users/:userId/rewards', async (req: express.Request, res: express.Response) =>
{
  let userId: string = req.params.userId;
  let at: any = req.query.at;

  //Validation is done in the rewards service.
  try
  {
    let userRewards: Reward[] = await rewards.getRewards(userId, at);
    let response: GetRewardsResponse = {
      data: userRewards
    };
    res.json(response);
  } 
  catch (error: any)
  {
    //Normally I would pass this to a handler class to decide the appropriate error code and response. 

    res.status(400).send(error.message);
  }
});

app.patch('/users/:userId/rewards/:rewardId/redeem', async (req: express.Request, res: express.Response) =>
{
  let userId: string = req.params.userId;
  let rewardId: string = req.params.rewardId;

  try {
    let redeemedReward: Reward = await rewards.redeemReward(userId, rewardId);
    let response: PatchRewardsResponse = {
      data: redeemedReward
    };

    res.json(response);
  }
  catch (error: any)
  { 
    //Not a fan of this, would prefer error codes and a handler but maybe thats overkill for this example.
    if (error.message === "This reward is already expired")
    {
      res.status(405).send({ error: { message: error.message }});
      return;
    };
    res.status(400).send(error.message);
  };
 
});

export { app };
