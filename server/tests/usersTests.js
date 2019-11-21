import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import userInfo from './dummyData.js/usersData';
chai.use(chaiHttp);

const { expect } = chai;
let token;

// SIGN UP TESTS
describe('POST /api/v1/auth/signup', () => {
    it('should not create user due to not filling all fields', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signup')
            .send(userInfo.invalidUserSignup)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('message').equal('\"firstname\" is required');
                done();
            });
    });

    it('should display 500-Internal server error-for not adding password', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signup')
            .send(userInfo.noPassword500)
            .end((err, res) => {
                if (err) done(err);
                expect(res.status).to.equal(500);
                expect(res.body).to.have.property('message').equal('data and salt arguments required');
                done();
            });
    });

    it('should create user and generate token', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signup')
            .send(userInfo.validUserSignup)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(201);
                expect(res.body).to.have.property('message').equal('User created successfully');
                token = res.body.data.token;
                done()
            })
    });

    it('should return 409-Email exists', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signup')
            .send(userInfo.emailExists)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(409);
                expect(res.body).to.have.property('message').equal('Email already exists');
                done();
            });
    });
});

// SIGN IN TESTS
describe('POST /api/v1/auth/signin', () => {
    it('should return 404-Email not found', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send(userInfo.emailNotFound)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('status').equal(404);
                expect(res.body).to.have.property('message').equal('Email not found');
                done();
            })
    });

    it('should return 401-Incorrect password', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send(userInfo.incorrectPassword)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('Incorrect password');
                done();
            });
    });

    it('should sign in successfully', (done) => {
        chai
            .request(app)
            .post('/api/v1/auth/signin')
            .send(userInfo.validUserSignin)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('status').equal(200);
                expect(res.body).to.have.property('message').equal('User signed in successfully');
                token = res.body.token;
                done();
            });
    });
});
