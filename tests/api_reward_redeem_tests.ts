import { agent as request } from "supertest";
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { app } from "../app";


describe('When I call the PATCH rewards API', () =>
{

    describe('And I send an invalid request', () =>
    {
        describe('Where the userId is not a number', () =>
        {
            it("Should return a 400 response", async () =>
            {
                const response = await request(app)
                    .patch("/users/NOTANUMBER/rewards/2020-03-15T00:00:00Z/redeem");

                expect(response.status).to.eql(400);
            });

            let expectedErrorMessage = "The userId must be a number.";
            it(`Should have an error message "${expectedErrorMessage}"`, async () =>
            {
                const response = await request(app)
                    .patch("/users/NOTANUMBER/rewards/2020-03-15T00:00:00Z/redeem");

                expect(response.text).to.eql(expectedErrorMessage);
            });
        });

        describe('Where the rewardId is not a valid date', () =>
        {
            it("Should return a 400 response", async () =>
            {
                const response = await request(app)
                    .patch("/users/1/rewards/NOTADATE/redeem");

                expect(response.status).to.eql(400);
            });

            let expectedErrorMessage = "The rewardId must be a valid date string.";
            it(`Should have an error message "${expectedErrorMessage}"`, async () =>
            {
                const response = await request(app)
                    .patch("/users/1/rewards/NOTADATE/redeem");

                expect(response.text).to.eql(expectedErrorMessage);
            });
        });



    });

    describe('And I send a valid request', () =>
    {
        let now : any = "";

        describe('And the GET rewards API has yet to be called for the user', () =>
        {
            it('Should return a 404', async () =>
            {
                const response = await request(app).patch('/users/1/rewards/redeem');
                expect(response.status).to.eql(404);
            });
        });

        before(async () =>
        {
            // Current time
            now = new Date();
            
            const getResponse = await request(app).get('/users/7/rewards').query({ at: now.toISOString()});
            expect(getResponse.status).to.eql(200); // A small validation check to ensure the preconditions of the test are met.
        });

        describe('And the GET rewards API has been called for the user', () =>
        {
            describe('And the reward has not been redeemed', () =>
            {   
                
                it('Should return a 200', async () =>
                {
                    const response = await request(app).patch('/users/7/rewards/2020-03-15T00:00:00Z/redeem');    
                    expect(response.status).to.eql(200);
                    expect(response).to.eql({ "data": { "availableAt": "2020-03-18T00:00:00Z", "redeemedAt": `${now}`, "expiresAt": "2020-03-19T00:00:00Z" } })
                });
            });

            describe('And the reward has been redeemed', () =>
            {       
              
                //I couldn't really decide what the appropriate error code should be. 'Method not allowed' seemed most appropriate. 
                it('Should return a 405  with an appropriate error message ', async () =>
                {   
                    const response = await request(app).patch('/users/7/rewards/2020-03-15T00:00:00Z/redeem');
                    expect(response.status).to.eql(405);
                    expect(response).to.eql({ "error": { "message": "This reward is already expired" }});
                });

            });
        });

        


    });

});