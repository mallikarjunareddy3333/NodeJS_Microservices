process.env.NODE_ENV = 'test';

const expect = require('chai').expect;
const request = require('supertest');

const app = require('../books');
const conn = require('../db');

describe('POST /book', () => {

    before((done) => {
        conn.connect()
            .then(() => done())
            .catch((err) => done(err));
    });

    after((done) => {
        conn.close()
            .then(() => done())
            .catch((err) => done(err))
    });

    it('OK, creating a new book works', async (done) => {
        request(app).post('/book')
            .send({
                title: 'JavaScript',
                author: 'Arjun',
                numberPages: 200,
                publisher: 'amazon'
            }).then((res) => {
                expect(res.body.message).to.equal("A new book created success!");
                done();
            }).catch((err) => {
                done(err);
            });
    });

});