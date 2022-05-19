import { agent as request } from "supertest";
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { app } from "../app";

// This has a double purpose of ensuring the test runner is set up correctly.
describe("When I call an unknown or incorrectly typed endpoint", () =>
{
    it("should return a 404", async () =>
    {
        const response = await request(app).get("/api/uusers/1/rewards");
        expect(response.status).to.equal(404);
    });
});

// Represents the happy/green path. 
describe(`When I call the rewards API`, () => 
{
    describe("And I send a valid request", () =>
    {
        let userId = null;
        let at: string = "";
        let api: string = "";

        beforeEach(async () =>
        {
            userId = 1;
            at = "2020-03-19T12:00:00Z"
            api = `/api/users/${userId}/rewards`;
    
        });

        it("Should return a 200 response", async () =>
        {
            const response = await request(app)
                .get(api)
                .query({ at });

            console.log('request: ', api);
            console.log('response: ', response.body);

            expect(response.status).to.eql(200);
        });

        it("Should return a body with a 'data' object ", async () =>
        {

            const response = await request(app)
                .get(api)
                .query({ at });

            expect(response.body).to.have.property('data');
        });


        it("Should have a 'data' object containing entries for the week wrapping the given date in the 'at' query parameter", async () =>
        {

            let body = {
                "data": [
                    { "availableAt": "2020-03-15T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-16T00:00:00Z" },
                    { "availableAt": "2020-03-16T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-17T00:00:00Z" },
                    { "availableAt": "2020-03-17T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-18T00:00:00Z" },
                    { "availableAt": "2020-03-18T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-19T00:00:00Z" },
                    { "availableAt": "2020-03-19T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-20T00:00:00Z" },
                    { "availableAt": "2020-03-20T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-21T00:00:00Z" },
                    { "availableAt": "2020-03-21T00:00:00Z", "redeemedAt": null, "expiresAt": "2020-03-22T00:00:00Z" }
                ]
            };

            const response = await request(app)
                .get(api)
                .query({ at });

            expect(response.body.data).to.eql(body.data);
        });
    });

    // The behaviour here wasn't given in the spec, in a real scenario I would clarify the requirements first. 
    // I would also wrap the error logic in an error code known internally only. 
    // I can't imagine a scenario where the user needs to know the true reason for an error. (might also be insecure)
    describe("And I send an invalid request", () =>
    {
        describe('Where the userId is not a number', () =>
        {
            it("Should return a 400 response", async () =>
            {
                const response = await request(app)
                    .get("/api/users/abc/rewards");

                expect(response.status).to.eql(400);
            });

            it("Should return a body with a 'message' object", async () =>
            {
                const response = await request(app)
                    .get("/api/users/abc/rewards");

                expect(response.body).to.have.property('message');
            });

            it("Should have a 'message' object containing the error message", async () =>
            {
                const response = await request(app)
                    .get("/api/users/abc/rewards");

                expect(response.body.message).to.eql("The userId must be a number.");
            });
        });

        describe("Where the 'at' query parameter is not a valid date", () =>
        {
            it("Should return a 400 response", async () =>
            {
                const response = await request(app)
                    .get("/api/users/1/rewards")
                    .query({ at: "abc" });

                expect(response.status).to.eql(400);
            });

            it("Should return a body with a 'message' object", async () =>
            {
                const response = await request(app)
                    .get("/api/users/1/rewards")
                    .query({ at: "abc" });

                expect(response.body).to.have.property('message');
            });

            it("Should have a 'message' object containing the error message", async () =>
            {
                const response = await request(app)
                    .get("/api/users/1/rewards")
                    .query({ at: "abc" });

                expect(response.body.message).to.eql("The at must be a valid date.");
            });
        });

    });
});