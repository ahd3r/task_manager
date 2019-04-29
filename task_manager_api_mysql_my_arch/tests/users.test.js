const app = require('../app');
const request = require('supertest')(app);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const authService = require('../components/auth/model/service');
const userService = require('../components/users/model/service');
const tokenService = require('../components/token/model/service');

const db = require('../utils/database_test');

describe('Test user', ()=>{



  describe('unit',()=>{

    describe('user',()=>{
      test('check pagination',()=>{
        const pagination = userService.pagination(6,3);
        expect(pagination).toBe(15);
      });
      test('check hashing password',()=>{
        const hashedString = userService.hashedPass('ronaldo07');
        expect(bcrypt.compareSync('ronaldo07',hashedString)).toBeTruthy();
        expect(hashedString.length).toBe(60);
      });
    });

    describe('auth',()=>{
      test('check jsonwebtoken',()=>{
        const check = jwt.verify(authService.createJwt('ander11110@gmail.com'),'nationzinewithl');
        expect(check).toHaveProperty('email','ander11110@gmail.com');
      });
      test('check rightness of password',()=>{
        expect(authService.isRightPass('123456789',userService.hashedPass('123456789',7))).toBeTruthy();
      });
    });

    describe('token',()=>{
      test('check random strick',()=>{
        const strick = tokenService.randomStrick();
        expect(strick.length).toBe(40);
      });
      test('check uniq token',async ()=>{
        const token = await tokenService.originToken();
        expect(token.length).toBe(40);
      });
      test.skip('send mail',async ()=>{
        const response = await tokenService.sendEmail('ander11110@gmail.com','Letter to you','<h1>Hi</h1>');
        expect(response).toHaveProperty('message','success');
      });
    });

  });



  describe.only('integration',()=>{
    
    describe('check auth',()=>{
      beforeEach(async(done)=>{
        await db.execute('DELETE FROM users');
        await db.execute('INSERT users(username,password,email,confirmed,permission) VALUES ("ander","$2a$07$ikFyQSRNjMgHgDC41d/pXeO8NXj4Q1yeFkh78.1KdjtXEn/EsrUOG","ander11110@gmail.com",1,2)');
        await db.execute(`INSERT users(username,password,email,confirmed) VALUES ('moon','$2a$07$ikFyQSRNjMgHgDC41d/pXeO8NXj4Q1yeFkh78.1KdjtXEn/EsrUOG','test@test.com',1),
        ('bob','$2a$07$og/kgyXjSJJ7fLD98EOwSeJmbyDXp75S6DPNsEk8/aZuRhqu2/DVS','demo@test.com',1)`);
        done();
      });
      afterEach(async (done)=>{
        await db.execute('DELETE FROM users');
        done();
      });

      test('wrong auth user',async (done)=>{
        const responseWrongPass = await request.post('/auth/login').send({email:'demo@test.com',password:'1111'});
        const responseUnExistingUser = await request.post('/auth/login').send({email:'google@gmail.com',password:'1111'});
        const withoutUserData = await request.post('/auth/login');
        expect(responseWrongPass.status).toBe(200);
        expect(JSON.parse(responseWrongPass.text)).toHaveProperty('err','Wrong password');
        expect(responseUnExistingUser.status).toBe(200);
        expect(JSON.parse(responseUnExistingUser.text)).toHaveProperty('err','User does not exist');
        expect(withoutUserData.status).toBe(200);
        expect(JSON.parse(withoutUserData.text)).toHaveProperty('err');
        done();
      });
      test('auth user',async (done)=>{
        const responseRight = await request.post('/auth/login').send({email:'ander11110@gmail.com',password:'1111'});
        expect(responseRight.status).toBe(200);
        expect(JSON.parse(responseRight.text)).toHaveProperty('token');
        expect(JSON.parse(responseRight.text)).toHaveProperty('idUser');
        expect(responseRight.header).toHaveProperty('authorization');
        expect(responseRight.header).toHaveProperty('iduser');
        done();
      });
    });
    
    describe.only('check user',()=>{
      beforeEach(async(done)=>{
        await db.execute('DELETE FROM token');
        await db.execute('DELETE FROM users');
        await db.execute('INSERT users(username,password,email,confirmed,permission) VALUES ("ander","$2a$07$ikFyQSRNjMgHgDC41d/pXeO8NXj4Q1yeFkh78.1KdjtXEn/EsrUOG","ander11110@gmail.com",1,2)');
        done();
      });
      afterEach(async (done)=>{
        await db.execute('DELETE FROM token');
        await db.execute('DELETE FROM users');
        done();
      });

      describe('create account',()=>{
        test('create user account',async (done)=>{
          const responseOfGoodRequest = await request.post('/users/').send({username:'moon',password:'1234',email:'fcdd227@gmail.com'});
          const createUserWithPermUser = await request.post('/users/').send({username:'root1',password:'1111',email:'demo@demo.com',permission:1});
          expect(responseOfGoodRequest.status).toBe(200);
          expect(createUserWithPermUser.status).toBe(200);
          expect(JSON.parse(responseOfGoodRequest.text)[0]).toHaveProperty('email','fcdd227@gmail.com');
          expect(JSON.parse(responseOfGoodRequest.text)[0]).toHaveProperty('confirmed',0);
          expect(JSON.parse(createUserWithPermUser.text)[0]).toHaveProperty('email','demo@demo.com');
          expect((await db.execute('SELECT COUNT(*) AS count FROM users'))[0][0].count).toBe(3);
          expect((await db.execute(`SELECT COUNT(*) AS count FROM token`))[0][0].count).toBe(2);
          done();
        });
        test('create wrong user account', async(done)=>{
          const createExistAccount = await request.post('/users/').send({username:'bob',password:'1111',email:'ander11110@gmail.com'});
          const lessPass = await request.post('/users/').send({username:'root21',password:'11',email:'demo@demo.com'}); // password must be longer then 3
          const wrongEmail = await request.post('/users/').send({username:'root22',password:'1111',email:'demo@democom'});
          const createUserWithoutData = await request.post('/users/');
          await db.execute('INSERT users(username,password,email,confirmed) VALUES ("boom","$2a$07$qVhnAZZ8nJvqoFGmNtAeK.s/4ihEF48k3uWBSFKqMLZbyQKwZkZry","took@always.here",1)');
          const authUser = await request.post('/auth/login').send({email:'took@always.here',password:'123456789'});
          const authAdmin = await request.post('/auth/login').send({email:'ander11110@gmail.com',password:'1111'});
          const createUserByAuthUser = await request.post('/users/').send({jwt:JSON.parse(authUser.text).token,idUser:JSON.parse(authUser.text).idUser,username:'root11',password:'1111',email:'demo@demo.com'});
          const createUserByAuthAdmin = await request.post('/users/').send({jwt:JSON.parse(authAdmin.text).token,idUser:JSON.parse(authAdmin.text).idUser,username:'root12',password:'1111',email:'demo@demo.com'});
          const createUserWithWrongPerm = await request.post('/users/').send({username:'root11',password:'1111',email:'demo@demo.com',permission:'admin'});
          expect((await db.execute('SELECT COUNT(*) as count FROM users'))[0][0].count).toBe(2);
          expect(JSON.parse(createExistAccount.text)).toHaveProperty('err');
          expect(JSON.parse(wrongEmail.text)).toHaveProperty('err');
          expect(JSON.parse(lessPass.text)).toHaveProperty('err');
          expect(JSON.parse(createUserWithoutData.text)).toHaveProperty('err');
          expect(JSON.parse(createUserByAuthUser.text)).toHaveProperty('err','You are authorizated');
          expect(JSON.parse(createUserByAuthAdmin.text)).toHaveProperty('err','You are authorizated');
          expect(JSON.parse(createUserWithWrongPerm.text)).toHaveProperty('err','Permission can not be string, only 1(user),2(admin),3(paid)');
          done();
        });
        test('create admin account',async (done)=>{
          const authAdmin = await request.post('/auth/login').send({email:'ander11110@gmail.com',password:'1111'});
          const createUserWithPermAdminByAdmin = await request.post('/users/').send({jwt:JSON.parse(authAdmin.text).token,idUser:JSON.parse(authAdmin.text).idUser,username:'root2',password:'1111',email:'test2@test.com',permission:2});
          expect(createUserWithPermAdminByAdmin.status).toBe(200);
          expect((await db.execute('SELECT COUNT(*) AS count FROM users'))[0][0].count).toBe(2);
          expect(createUserWithPermAdminByAdmin.header).toHaveProperty('authorization');
          expect(createUserWithPermAdminByAdmin.header).toHaveProperty('iduser');
          expect(JSON.parse(createUserWithPermAdminByAdmin.text)[0]).toHaveProperty('email','test2@test.com');
          expect(JSON.parse(createUserWithPermAdminByAdmin.text)[0]).toHaveProperty('confirmed',0);
          expect(JSON.parse(createUserWithPermAdminByAdmin.text)[0]).toHaveProperty('confirmed',0);
          expect(JSON.parse(createUserWithPermAdminByAdmin.text)[0]).toHaveProperty('permission',2);
          done();
        });
        test('create wrong admin account',async (done)=>{
          await db.execute(`INSERT users(username,password,email,confirmed) VALUES ('vel','$2a$07$ikFyQSRNjMgHgDC41d/pXeO8NXj4Q1yeFkh78.1KdjtXEn/EsrUOG','test@test.com',1)`);
          const authUser = await request.post('/auth/login').send({email:'test@test.com',password:'1111'});
          const createUserWithPermAdminForUnAuth = await request.post('/users/').send({username:'root2',password:'1111',email:'test@test.com',permission:2});
          const createUserWithPermAdminByUser = await request.post('/users/').send({jwt:JSON.parse(authUser.text).token,idUser:JSON.parse(authUser.text).idUser,username:'root4',password:'1111',email:'test4@test.com',permission:2});
          expect(JSON.parse(createUserWithPermAdminForUnAuth.text)).toHaveProperty('err','You are not auth');
          expect(JSON.parse(createUserWithPermAdminByUser.text)).toHaveProperty('err','You are not admin');
          expect((await db.execute('SELECT COUNT(*) AS count FROM users'))[0][0].count).toBe(2);
          done();
        });
        test('create paid account',async (done)=>{
          done();
        });
      });

      describe.only('check token of user, it is help for token',()=>{
        test('try to auth user with conf token',async(done)=>{
          await request.post('/users/').send({username:'moon',password:'1234',email:'fcdd227@gmail.com'});
          const authThisUser = await request.post('/auth/login').send({email:'fcdd227@gmail.com',password:'1234'});
          expect(authThisUser.status).toBe(200);
          expect((await db.execute('SELECT COUNT(*) AS count FROM users'))[0][0].count).toBe(2);
          expect((await db.execute('SELECT COUNT(*) AS count FROM token'))[0][0].count).toBe(1);
          expect(JSON.parse(authThisUser.text)).toHaveProperty('err','You must to confirm your account, we send you confirm letter again');
          // send new token to email twice — truth
          done();
        });
        test('conf user and try to auth',async(done)=>{
          const responsOfCreatingUser = await request.post('/users/').send({username:'moon',password:'1234',email:'fcdd227@gmail.com'});
          await request.patch(`/users/confirm/${JSON.parse(responsOfCreatingUser.text)[0].id_user}`);
          const authThisUser = await request.post('/auth/login').send({email:'fcdd227@gmail.com',password:'1234'});
          expect(authThisUser.status).toBe(200);
          expect(JSON.parse(authThisUser.text).idUser).toBe(JSON.parse(responsOfCreatingUser.text)[0].id_user);
          done();
        });
        test('try to auth user with reset',async(done)=>{
          done();
        });
        test('reset user pass',async(done)=>{
          done();
        });
        test('conf user by admin',async(done)=>{
          done();
        });
        test('reset user pass by admin',async(done)=>{
          done();
        });
      });

      describe('edit user data',()=>{
        test('edit auth user',async(done)=>{
          done();
        });
        test('edit user with wrongs',async(done)=>{
          done();
        });
        test('admin edits user',async(done)=>{
          done();
        });
        test('',async(done)=>{
          done();
        });
      });
    });

    describe('check token',()=>{
      test('',async(done)=>{
        done();
      });
    });

  });



});

/*
$2a$07$ikFyQSRNjMgHgDC41d/pXeO8NXj4Q1yeFkh78.1KdjtXEn/EsrUOG === '1111'
$2a$07$og/kgyXjSJJ7fLD98EOwSeJmbyDXp75S6DPNsEk8/aZuRhqu2/DVS === '1234'
$2a$07$qVhnAZZ8nJvqoFGmNtAeK.s/4ihEF48k3uWBSFKqMLZbyQKwZkZry === '123456789'
*/
