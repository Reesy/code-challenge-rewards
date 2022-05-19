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


        describe('And the GET rewwards API has yet to be called for the user', () =>
        {
            it('Should return a 404', async () =>
            {
                const response = await request(app).patch('/users/1/rewards/redeem');
                expect(response.status).to.eql(404);
            });
        });



    });

});