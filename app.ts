import express from 'express';
import Database from './interfaces/Database';
import Reward from './interfaces/Reward';
import InMemoryDatabase from './services/InMemoryDatabase';
import Rewards from './services/Rewards';

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// I've typed towards an interface here so that in future this could be swapped to a different database without having to make many changes.
// As long as any new databases adhere to the database interface it should be relatively easy to swap out.
let database: Database = new InMemoryDatabase();
let rewards = new Rewards(database);

app.get('/api/users/:userId/rewards', async (req: express.Request, res: express.Response) =>
{
  let userId: string = req.params.userId;
  let at: any = req.query.at;
  //Validation is done in the rewards service.
  let userRewards: Reward[] = await rewards.getRewards(userId, at);
  res.json(userRewards);
});

app.patch('/api/users/:userId/rewards', (req: express.Request, res: express.Response) =>
{
  let userId: string = req.params.userId;
  let at: any = req.query.at;
  let responseMessage = `The userId was: ${userId} and the at was: ${at}!`;
  res.json(responseMessage);
});

export { app };
