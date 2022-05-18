import { agent as request } from "supertest"; 
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { app } from "../app";

const api = "/api/v1/test1"; 

describe(`When I call ${api} post endpoint`, () => 
{ 

  describe("And I send a valid request", () =>
  {

    it("Should return a 200", async () =>
    {
      let requestBody = 
      {
        "message": "Hello, world!"
      };

      const response = await request(app)
          .post(api)
          .send(requestBody)
          .set('Accept', 'application/json');

      expect(response.status).to.eql(200);
      expect(response.body).to.eql("The body was: Hello, world!!");
    });

  });

});