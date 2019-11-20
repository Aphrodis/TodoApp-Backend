import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import todosData from './dummyData.js/todosData';
chai.use(chaiHttp);

const { expect } = chai;

let token;
let result;

before('Create a user', (done) => {
    chai
        .request(app)
        .post('/api/v1/auth/signup')
        .send(todosData.validUserSignup1)
        .end((err, res) => {
            if (err) done(err);
            token = res.body.data.token;
            done();
        });
});

// POST TASK
describe('POST /api/v1/todos', () => {
    it('should not add task for not adding title', (done) => {
        chai
            .request(app)
            .post('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(todosData.invalidTodo1)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('status').equal(400);
                expect(res.body).to.have.property('message').equal('\"title\" is required');
                done();
            });
    });

    it('should not add task for not adding description', (done) => {
        chai
            .request(app)
            .post('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(todosData.invalidTodo2)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(400);
                expect(res.body).to.have.property('status').equal(400);
                expect(res.body).to.have.property('message').equal('\"description\" is required');
                done();
            });
    });
    it('should add a todo given valid values', (done) => {
        chai
            .request(app)
            .post('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(todosData.validTodo)
            .end((err, res) => {
                if (err) done(err);
                result = res.body.data;
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message').equal('Task added successfully');
                expect(res.body.data).to.have.property('userid');
                expect(res.body.data).to.have.property('taskid');
                expect(res.body.data).to.have.property('createdon');
                expect(res.body.data).to.have.property('title').equal('Code');
                expect(res.body.data).to.have.property('description').equal('Today, I will be writing tests');
                done();
            });
    });

    it('should not add task due to not adding token', (done) => {
        chai
            .request(app)
            .post('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .send(todosData.validTodo2)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('Ooops! You are unauthenticated');
                done();
            });
    });

    it('should not add task due to sending invalid token', (done) => {
        chai
            .request(app)
            .post('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer invalidtoken${token}`)
            .send(todosData.validTodo2)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('invalid token');
                done();
            });
    });
});

// GET ALL TASKS
describe('GET /api/v1/todos', () => {
    it('should not retrieve todos due to unavailable token', (done) => {
        chai
            .request(app)
            .get('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('Ooops! You are unauthenticated');
                done();
            });
    });

    it('should not retrieve todos due to invalid token', (done) => {
        chai
            .request(app)
            .get('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer notvalid${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('invalid token');
                done();
            });
    });

    it('should retrieve todos given the valid token', (done) => {
        chai
            .request(app)
            .get('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('status').equal(200);
                expect(res.body).to.have.property('message').equal('Todos retrieved successfully');
                expect(res.body).to.have.property('totalTodos');
                expect(res.body).to.have.property('totalPages');
                expect(res.body).to.have.property('itemsOnPage');
                expect(res.body).to.have.property('pageNo');
                expect(res.body).to.have.property('retrievedTodos');
                done();
            });
    });
});

// GET ONE TASK
describe('GET /api/v1/todos/:taskid', () => {
    it('should return task not found', (done) => {
        chai
            .request(app)
            .get(`/api/v1/todos/${todosData.taskNotFound.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('status').equal(404);
                expect(res.body).to.have.property('message').equal('Task not found');
                done();
            });
    });

    it('should not retrieve task due to invalid token', (done) => {
        chai
            .request(app)
            .get(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer invalidd${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('invalid token');
                done();
            });
    });

    it('should not retrieve task due to unavailable token', (done) => {
        chai
            .request(app)
            .get(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('Ooops! You are unauthenticated');
                done();
            });
    });

    it('should retrieve task', (done) => {
        chai
            .request(app)
            .get(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message').equal('Task retrieved successfully');
                expect(res.body.data).to.have.property('userid');
                expect(res.body.data).to.have.property('taskid');
                expect(res.body.data).to.have.property('createdon');
                expect(res.body.data).to.have.property('title').equal('Code');
                expect(res.body.data).to.have.property('description').equal('Today, I will be writing tests');
                done();
            });
    });

    it('should return 500 error due to invalid taskid', (done) => {
        chai
            .request(app)
            .get(`/api/v1/todos/${result.taskid}1`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(500);
                done();
            });
    });
});

// UPDATE TASK
describe('PATCH /api/v1/todos/:taskid', () => {
    it('should not update task due to invalid token', (done) => {
        chai
            .request(app)
            .patch(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer invalidd${token}`)
            .send(todosData.updateTodo)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('invalid token');
                done();
            });
    });

    it('should not update task due to unavailable token', (done) => {
        chai
            .request(app)
            .patch(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .send(todosData.updateTodo)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('Ooops! You are unauthenticated');
                done();
            });
    });

    it('should return task to be updated was not found', (done) => {
        chai
            .request(app)
            .patch(`/api/v1/todos/${todosData.taskNotFound.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(todosData.taskNotFound)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('status').equal(404);
                expect(res.body).to.have.property('message').equal('Task to be updated was not found');
                done();
            });
    });

    it('should return 500 for missing title', (done) => {
        chai
            .request(app)
            .patch(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(todosData.invalidUpdate)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(500);
                expect(res.body).to.have.property('status').equal(500);
                expect(res.body).to.have.property('message').equal('child \"title\" fails because [\"title\" is required]');
                done();
            });
    });

    it('should return 500 for missing description', (done) => {
        chai
            .request(app)
            .patch(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(todosData.invalidUpdate2)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(500);
                expect(res.body).to.have.property('status').equal(500);
                expect(res.body).to.have.property('message').equal('child \"description\" fails because [\"description\" is required]');
                done();
            });
    });

    it('should update the task', (done) => {
        chai
            .request(app)
            .patch(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send(todosData.updateTodo)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('message').equal('Task updated successfully');
                expect(res.body.data).to.have.property('userid');
                expect(res.body.data).to.have.property('taskid');
                expect(res.body.data).to.have.property('createdon');
                expect(res.body.data).to.have.property('title').equal('Updated title');
                expect(res.body.data).to.have.property('description').equal('Updated description');
                done();
            });
    });
});

// DELETE TASK
describe('DELETE /api/v1/todos/:taskid', () => {
    it('should not delete task due to invalid token', (done) => {
        chai
            .request(app)
            .delete(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer invalidd${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('invalid token');
                done();
            });
    });

    it('should not delete task due to unavailable token', (done) => {
        chai
            .request(app)
            .delete(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(401);
                expect(res.body).to.have.property('status').equal(401);
                expect(res.body).to.have.property('message').equal('Ooops! You are unauthenticated');
                done();
            });
    });

    it('should return task to be deleted was not found', (done) => {
        chai
            .request(app)
            .delete(`/api/v1/todos/${todosData.taskNotFound.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('status').equal(404);
                expect(res.body).to.have.property('message').equal('Task to be deleted was not found');
                done();
            });
    });

    it('should successfully delete the task', (done) => {
        chai
            .request(app)
            .delete(`/api/v1/todos/${result.taskid}`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(200);
                expect(res.body).to.have.property('status').equal(200);
                expect(res.body).to.have.property('message').equal('Task deleted successfully');
                done();
            });
    });

    it('should return internal server error-500- due to invalid taskid', (done) => {
        chai
            .request(app)
            .delete(`/api/v1/todos/${result.taskid}d`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(500);
                done();
            });
    });
});

describe('GET /api/v1/todos ZERO TODOS', () => {
    it('should return -You have no todos', (done) => {
        chai
            .request(app)
            .get('/api/v1/todos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                if (err) done(err);
                expect(res.body).to.be.an('object');
                expect(res.status).to.equal(404);
                expect(res.body).to.have.property('status').equal(404);
                expect(res.body).to.have.property('message').equal('You have no todos');
                done();
            });
    });
});
