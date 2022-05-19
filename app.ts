import express from 'express';

const app: express.Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/api/users/:userId/rewards', (req: express.Request, res: express.Response) =>
{
  let userId: string = req.params.userId;
  let at: any = req.query.at;
  let responseMessage = `The userId was: ${userId} and the at was: ${at}!`;
  res.json(responseMessage);
});

app.patch('/api/users/:userId/rewards', (req: express.Request, res: express.Response) =>
{
  let userId: string = req.params.userId;
  let at: any = req.query.at;
  let responseMessage = `The userId was: ${userId} and the at was: ${at}!`;
  res.json(responseMessage);
});

export { app };
