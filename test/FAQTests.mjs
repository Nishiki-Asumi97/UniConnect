import { expect } from "chai";
import request from "request";
import FAQ from '../models/FAQ.js';
import sinon from "sinon";

//FAQ Create - admin
describe("POST /create", function () {
  const url = "http://localhost:3000/FAQ/create";

  it("returns status 201 to check if the FAQ is created successfully", function (done) {
    request.post(
      url,
      {
        json: {
          question: "What is Node.js?",
          answer: "Node.js is a runtime for running JavaScript outside the browser.",
        },
      },
      function (error, response, body) {
        expect(response.statusCode).to.equal(201);  // Check if FAQ creation was successful
        expect(body.message).to.equal("FAQ added successfully!");  // Check success message
        done();
      }
    );
  });

  it("returns status 400 when question or answer is missing", function (done) {
    request.post(
      url,
      {
        json: {
          question: "",
          answer: "",
        },
      },
      function (error, response, body) {
        expect(response.statusCode).to.equal(400);  // Check for bad request
        expect(body.error).to.equal("Both Question and Answer are required!");  // Check error message
        done();
      }
    );
  });

  it("returns status 400 when question or answer already exists", function (done) {
    // Posting the same FAQ again to check for duplicate entry
    request.post(
      url,
      {
        json: {
          question: "What is Node.js?",
          answer: "Node.js is a runtime for running JavaScript outside the browser.",
        },
      },
      function (error, response, body) {
        expect(response.statusCode).to.equal(400);  // Check for duplicate entry error
        expect(body.error).to.equal("Question or Answer already exists!");  // Check error message for duplicates
        done();
      }
    );
  });

  it("handles server errors and returns status 500", function (done) {
    request.post(
      url,
      {
        json: {
          question: "Simulate Server Error",
          answer: "This should cause a server error.",
        },
      },
      function (error, response, body) {
        if (response.statusCode === 500) {
          expect(body.error).to.equal("Server error");  // Check for server error message
        }
        done();
      }
    );
  });
});

// View FAQ - admin
describe("GET /list", function () {
    const url = "http://localhost:3000/FAQ/list";
  
    it("returns status 200 and retrieves the list of FAQs successfully", function (done) {
      request.get(url, function (error, response, body) {
        expect(response.statusCode).to.equal(200);  // Check if the request was successful
        const data = JSON.parse(body);  // Parse the response body
        expect(data).to.have.property('data');  // Check that data property exists
        expect(data.data).to.be.an('array');  // Ensure the data property is an array
        done();
      });
    });
});
  