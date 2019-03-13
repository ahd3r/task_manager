const request = require('supertest');

const db = require('../utils/database_test');
const app = require('../app');

beforeAll(async(done)=>{
  const checkExist = await db.execute('SELECT * FROM users');
	if(checkExist[0].length!==0){
		await db.execute(`
			DELETE FROM users;
		`);
	}
	await db.execute(`
		INSERT users(username,password,email,permission) VALUES ('ander','$2a$07$L1aK2TaALAgJUSYKMJB8VemsjiyFn6GPySSurx7ekksh2dQfnKN3K','demo@demo.com',2)
  `);
  done();
});

afterAll(async(done)=>{
	await db.execute(`
		DELETE FROM users;
	`);
	done();
});

describe('Status check',()=>{
  test('Get all statuses',async(done)=>{
    const admin = await request(app).get('/auth/login').send({email:'demo@demo.com',password:'1111111111'});
    const statuses1 = await request(app).get('/users/statuses').set('authorization',admin.header.authorization).set('iduser',admin.header.iduser);
    const statuses2 = await request(app).get('/users/statuses');
    expect(statuses1.body.length).toBe(3);
    expect(statuses1.body[0]).toHaveProperty('permission','admin');
    expect(statuses2.body).toHaveProperty('err');
    done();
  });
});
