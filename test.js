const supertest = require('supertest');

const server = supertest.agent('http://localhost:3000');

describe('test search page', () => {
	it('should return results', (done) => {
		server.get('/search?q=a').expect('content-type', /text/).expect(200).end((err, res) => {
			done();
		});
	});
});

describe('test knowledge panel', () => {
	it('should return 200', (done) => {
		server.get('/knowledge?q=a').expect('content-type', /json/).expect(200).end((err, res) => {
			done();
		});
	});
});

describe('test autocomplete', () => {
	it('should return array of results', (done) => {
		server.get('/autocomplete?q=a').expect('content-type', /json/).expect(200).end((err, res) => {
			done();
		});
	});
});

describe('test images page', () => {
	it('should return page with images', (done) => {
		server.get('/search/images?q=a').expect('content-type', /text/).expect(200).end((err, res) => {
			done();
		});
	});
});

describe('test images proxy', () => {
	it('should error due to invalid image', (done) => {
		server.get('/proxy?q=https://localhost:3000').expect('content-type', /text/).expect(400).end((err, res) => {
			done();
		});
	});
});