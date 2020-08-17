const chai = require("chai");
const app = require("./../app");
const chaiHttp = require("chai-http");
var should = chai.should();
const expect = require("chai").expect;
const assert = require("chai").assert;

chai.use(chaiHttp);

const cotacao = {
  from: "",
  to: "CA",
  price: 25,
};

describe("Travel quote list", () => {
  it("Returns a list of quotations with status 200", (done) => {
    chai
      .request(app)
      .get("/quote/BRC/CA")
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.an("object");
        done();
      });
  });
});

describe("Insert a quote with incomplete data", () => {
  it("Returns 400 status", (done) => {
    chai
      .request(app)
      .post("/quote/insert")
      .send(cotacao)
      .end((err, res) => {
        res.should.have.status(400);
        res.should.be.an("object");
        res.body.should.have.property("message");
        done();
      });
  });
});
