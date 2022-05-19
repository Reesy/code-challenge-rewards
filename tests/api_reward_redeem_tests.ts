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
        let currentTimeAndDate : any = "";

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
            now = Date.now();
            let dateObj = new Date(now);
            currentTimeAndDate = dateObj.toISOString();
            const getResponse = await request(app).get('/users/7/rewards').query({ at: currentTimeAndDate});
            expect(getResponse.status).to.eql(200); // A small validation check to ensure the preconditions of the test are met.
        });


        describe('And the GET rewards API has been called for the user', () =>
        {
            let response: any;
            let redeemedAt: any;
            before(async () =>
            {
                response = await request(app).patch(`/users/7/rewards/${currentTimeAndDate}/redeem`);
            });
            describe('And the reward has not been redeemed', () =>
            {   
                
                it('Should return a 200', async () =>
                {
                    expect(response.status).to.eql(200);
                });

                it ('Should return a redeemedAt with a time that matches the request', async () =>
                {

                    expect(response.body).to.not.be.undefined;
                    expect(response.body.data).to.not.be.undefined;
                    //Accounting for daylight savings. 
                    expect(response.body.data.availableAt).to.satisfy((availableAt: any) => {
                        if (availableAt === "2020-03-18T00:00:00Z" || "2020-03-18T23:00:00Z")
                        {
                            return true;
                        };
                        return false;
                    }); //Accounting for daylight savings. 
                    
                    expect(response.body.data.expiresAt).to.satisfy((availableAt: any) => {
                        if (availableAt === "2020-03-19T00:00:00Z" || "2020-03-19T23:00:00Z")
                        {
                            return true;
                        };
                        return false;
                    });

                    expect(response.body.data.redeemedAt).to.not.be.null;
                    redeemedAt = response.body.data.redeemedAt;
                    expect(response.body.data.redeemedAt).to.satisfy((redeemedAt: any) => 
                    {
                        //I throw away the time component here as both the assertion and the code do a date.now which will have a varience we understand.
                        let redeemedAtDate = redeemedAt.split("T")[0];
                        let requestTime = currentTimeAndDate.split("T")[0];
                        if (redeemedAtDate === requestTime)
                        {
                            return true;
                        }
                    
                        return false;
                    });
                });
            });

            describe('And the reward has been redeemed', () =>
            {       
                it('Should return a 200', async () =>
                {
                    response = await request(app).patch(`/users/7/rewards/${currentTimeAndDate}/redeem`);    
                    expect(response.status).to.eql(200);
                });

                it('Should return the previous redeemedAt time in the data object', async () => 
                {
                    expect(response.body.data).to.not.be.undefined;
                    expect(response.body.data.redeemedAt).to.not.be.null;
                    expect(response.body.data.redeemedAt).to.eql(redeemedAt);
                });
      
            });

            before(async () =>
            {
        
                const getResponse = await request(app).get('/users/7/rewards').query({ at: "2020-03-15T00:00:00Z"});
                expect(getResponse.status).to.eql(200); 
            });
    
            describe('And the current time is past the expiry date', () =>
            {
                //I couldn't really decide what the appropriate error code should be. 'Method not allowed' seemed most appropriate. 
                it('Should return a 405 with an appropriate error message ', async () =>
                {   
                    const response = await request(app).patch('/users/7/rewards/2020-03-15T00:00:00Z/redeem');
                    expect(response.status).to.eql(405);
                    expect(response.body).to.eql({ "error": { "message": "This reward is already expired" }});
                });
            });
        });

        


    });

});