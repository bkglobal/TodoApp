var chai = require("chai");
var chaiHttp = require("chai-http");
var payloadData = require('./TestPayload');
var server = require("../app");
var should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);
var Promise = require("bluebird");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

describe("TodoApp_Tests ", function () {
  this.timeout(120 * 1000);
  var testnames = payloadData.payloadTitle;
  var token = "";

  let payloads = payloadData.getPayloads(token);

  for (let ind = 0; ind < testnames.length; ind++) {
    it(testnames[ind], (done) => {
      // let payload = JSON.parse(payloads[ind]);
      let payload = payloads[ind];
      let event = [];
      for (var i = 0; i < payload.length; i++) {
        event.push(payload[i]);
      }
      Promise.mapSeries(event, (e) => {
        let eve = e;
        if (eve.request.method == "DELETE") {
          return chai
            .request(server)
            .delete(eve.request.url)
            .set(eve.request.headers)
            .then((res) => {
              return res;
            })
            .catch((err) => {
              return err;
            });
        }
        if (eve.request.method == "GET") {
          return chai
            .request(server)
            .get(eve.request.url)
            .set(eve.request.headers)
            .then((res) => {
              return res;
            })
            .catch((err) => {
              return err;
            });
        }
        if (eve.request.method == "POST") {
          return chai
            .request(server)
            .post(eve.request.url)
            .set(eve.request.headers)
            .send(eve.request.body)
            .then((res) => {
              return res;
            })
            .catch((err) => {
              return err;
            });
        }
        if (eve.request.method == "PUT") {
          return chai
            .request(server)
            .put(eve.request.url)
            .set(eve.request.headers)
            .send(eve.request.body)
            .then((res) => {
              return res;
            })
            .catch((err) => {
              return err;
            });
        }
      })
        .then((results) => {
          for (let j = 0; j < results.length; j++) {
            let e = event[j];

            if (e.request.method == "GET") {
              results[j].should.have.status(e.response.status);
              let ar1 = results[j];
              let ar2 = e.response;
              if (e.response.status == 404) {
                continue;
              }
              expect(ar2.status).to.equal(ar1.status);
              for (let k = 0; k < ar1.length; k++) {
                expect(ar2[k]).to.deep.equal(ar1[k]);
              }
            }
            if (e.request.method == "POST") {
              if (results[j].body.result) {
                if (results[j].body.result.user) {
                  if (results[j].body.result.user.authToken) {
                    token = results[j].body.result.user.authToken;
                    payloads = payloadData.getPayloads(token);
                  }
                }
              }
              expect(results[j].status).to.equal(e.response.status);
            }
            if (e.request.method == "DELETE") {
              expect(results[j].status).to.equal(e.response.status);
            }
            if (e.request.method == "PUT") {
              expect(results[j].status).to.equal(e.response.status);
            }
          }
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  }
});
