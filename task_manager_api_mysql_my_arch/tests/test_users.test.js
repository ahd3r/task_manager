const request = require('supertest');

const db = require('../utils/database_test');
const app = require('../app');

beforeEach(async(done)=>{
	const checkExist = await db.execute('SELECT * FROM users');
	if(checkExist[0].length!==0){
		await db.execute(`
			DELETE FROM users;
		`);
	}
	await db.execute(`
		INSERT users(username,password,email,permission) VALUES ('ander','$2a$07$L1aK2TaALAgJUSYKMJB8VemsjiyFn6GPySSurx7ekksh2dQfnKN3K','demo@demo.com',2)
	`);
	await db.execute(`
		INSERT users(username,password,email,confirm_token) VALUES ('ahd3r','$2a$07$L1aK2TaALAgJUSYKMJB8VemsjiyFn6GPySSurx7ekksh2dQfnKN3K','test@demo.com','hrgl54HJff]/dshuj1S')
	`);
	await db.execute(`
		INSERT users(username,password,email) VALUES ('vel','$2a$07$L1aK2TaALAgJUSYKMJB8VemsjiyFn6GPySSurx7ekksh2dQfnKN3K','test@test.com'),
		('alex','$2a$07$L1aK2TaALAgJUSYKMJB8VemsjiyFn6GPySSurx7ekksh2dQfnKN3K','newtest@test.com'),
		('peyton','$2a$07$L1aK2TaALAgJUSYKMJB8VemsjiyFn6GPySSurx7ekksh2dQfnKN3K','good@test.com'),
		('bob','$2a$07$L1aK2TaALAgJUSYKMJB8VemsjiyFn6GPySSurx7ekksh2dQfnKN3K','good@demo.ua')
	`);
	done();
});

afterEach(async(done)=>{
	await db.execute(`
		DELETE FROM users;
	`);
	done();
});

describe('User checks',()=>{
	test('Create user',async(done)=>{
		const newUserData = await request(app).post('/users/create').send({username:'GoodBoy',email:'gb@gmail.com',password:'1111111111'});
		const countUser = await db.execute('SELECT COUNT(*) AS total FROM users');
		const checkCreatedUser = await db.execute(`SELECT * FROM users WHERE id_user=${newUserData.body[0].id_user}`);
		const authCreatedUser = await request(app).get('/auth/login').send({email:'gb@gmail.com',password:'1111111111'});
		expect(checkCreatedUser[0][0].email).toBe('gb@gmail.com');
		expect(checkCreatedUser[0][0].confirm_token).toHaveLength(40);
		expect(authCreatedUser.body).toHaveProperty('err','You must to confirm');
		expect(countUser[0][0].total).toBe(7);
		expect(newUserData.status).toBe(200);
		done();
	});
	test('Auth user', async(done)=>{
		const authUserRight = await request(app).get('/auth/login').send({email:'newtest@test.com',password:'1111111111'});
		const authUserWithConf = await request(app).get('/auth/login').send({email:'test@demo.com',password:'1111111111'});
		expect(authUserRight.status).toBe(200);
		expect(authUserWithConf.status).toBe(200);
		expect(authUserRight.body.user[0]).toHaveProperty('email','newtest@test.com');
		expect(authUserRight.header).toHaveProperty('authorization',authUserRight.body.jwt);
		expect(authUserRight.header).toHaveProperty('iduser',`${authUserRight.body.user[0].id_user}`);
		expect(authUserWithConf.body).toHaveProperty('err','You must to confirm');
		done();
	});
	test('Create user with status admin', async(done)=>{
		const admin = await request(app).get('/auth/login').send({email:'demo@demo.com',password:'1111111111'});
		expect(admin.body.user[0].permission).toBe(2);
		const newUserWithStatus = await request(app).post('/users/create').set('authorization',admin.header.authorization).set('iduser',admin.header.iduser).send({username:'GoodBoy',email:'gb@gmail.com',password:'1111111111',permission:2});
		const authNewUserWithStatus = await request(app).get('/auth/login').send({email:'gb@gmail.com',password:'1111111111'});
		expect(newUserWithStatus.status).toBe(200);
		expect(newUserWithStatus.body[0].permission).toBe(2);
		expect(authNewUserWithStatus.body).toHaveProperty('err','You must to confirm');
		done();
	});
	test('Bad auth', async(done)=>{
		const authUserWrong2 = await request(app).get('/auth/login').send({email:'ewtest@test.com',password:'1111111111'});
		const authUserWrong = await request(app).get('/auth/login').send({email:'newtest@test.com',password:'111111111'});
		expect(authUserWrong2.status).toBe(200);
		expect(authUserWrong.status).toBe(200);
		expect(authUserWrong2.body).toHaveProperty('err','This user does not exist');
		expect(authUserWrong.body).toHaveProperty('err','Password is not right');
		done();
	});
	test('Search user', async(done)=>{
		const admin = await request(app).get('/auth/login').send({email:'demo@demo.com',password:'1111111111'});
		const search = await request(app).get('/users/search').set('authorization',admin.header.authorization).set('iduser',admin.header.iduser).send({searchByName:'vel'});
		expect(search.status).toBe(200);
		console.log(search.body);
		// expect(search.body).toBe();
		done();
	});
});

/*
['res','request','req','text','body','files','buffered',
'headers','header','statusCode','status','statusType',
'info','ok','redirect','clientError','serverError',
'error','created','accepted','noContent','badRequest',
'unauthorized','notAcceptable','forbidden','notFound',
'unprocessableEntity','type','charset','links',
'setEncoding','redirects','pipe','get',
'_setHeaderProperties','_setStatusProperties',
'destroy','pause','resume','toError','setStatusProperties',
'toJSON','setMaxListeners','getMaxListeners','emit',
'addListener','on','prependListener','once',
'prependOnceListener','removeListener','off',
'removeAllListeners','listeners','rawListeners',
'listenerCount','eventNames' ]
*/

// 		INSERT users(username,password,email,permission) VALUES ('ander','$2a$07$Ki1CHfHlxtqBnwL.r2q57uN2Try6UZe6FQHGKvM0bHOYlo9AtPsFO','demo@demo.com',2);
// 		INSERT users(username,password,email,confirm_token) VALUES ('ahd3r','$2a$07$Ki1CHfHlxtqBnwL.r2q57uN2Try6UZe6FQHGKvM0bHOYlo9AtPsFO','test@demo.com','hrgl54HJff]/dshuj1S'),
// 		INSERT users(username,password,email) VALUES ('vel','$2a$07$Ki1CHfHlxtqBnwL.r2q57uN2Try6UZe6FQHGKvM0bHOYlo9AtPsFO','test@test.com'),
// 		('alex','$2a$07$Ki1CHfHlxtqBnwL.r2q57uN2Try6UZe6FQHGKvM0bHOYlo9AtPsFO','test@test.com'),
// 		('peyton','$2a$07$Ki1CHfHlxtqBnwL.r2q57uN2Try6UZe6FQHGKvM0bHOYlo9AtPsFO','good@test.com'),
// 		('bob','$2a$07$Ki1CHfHlxtqBnwL.r2q57uN2Try6UZe6FQHGKvM0bHOYlo9AtPsFO','good@demo.ua');

// 		INSERT tasks(task_name,task_owner) VALUES ('Do TZ',1),('Hire to job',1),('Go to home',2),('Create music',4),('Done tasks',3),('Cook a food',3),('Readed the book',5),
// 		('Do something',6),('Buy Falcon9',2),('Meet with Elon Musk',4),('Do TZ',2),('Do TZ',4),('Ride on Tesla',5),('Made a date',6),('Find a root',2),('Take a rest',3),('I dunno',2)
// 		('Buy Falcon9',6),('Buy Falcon9',5),('Buy Falcon9',1),('Meet with Elon Musk',1);
// 		CALL done_task(2);
// 		CALL done_task(3);
// 		CALL done_task(6);
// 		CALL done_task(7);
// 		CALL done_task(12);
// 		CALL done_task(15);

// 		CALL delete_task(2);
// 		CALL delete_task(1);

// 		INSERT support_message(title,body,creator) VALUES ('I can not reset my password', 'I am too stupied for it, help me, please', 3);
