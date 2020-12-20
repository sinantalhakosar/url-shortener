
const request = require('supertest');
const app = require('../app.js');
const faker = require('faker');
const jwt = require("jsonwebtoken");
var sinon = require("sinon");
const UserService = require('../services/user.services');
const UrlService = require('../services/url.services');

describe('Home, Login, Register pages GET TEST', () => {
        it('should load homepage', async done => {
            const res = await request(app).get('/');
            expect(res.statusCode).toEqual(200);
            done();
        });
        it('should load login page', async done => {
            const res = await request(app).get('/auth/login');
            expect(res.statusCode).toEqual(200)
            done();
        });
        it('should load register page', async done => {
            const res = await request(app).get('/auth/register');
            expect(res.statusCode).toEqual(200)
            done();
        });
});

describe('User & Url Test', () => {
    const username = 'sinan'
    const email = 'sinan@sinan.com'
    const password = 'password';
    let token = "", user_id="", url1_short ="", url2_short = "";
    it('should register user', async done => {
        const user = {
            username: username,
            pass: password,
            email:email,
            token:null
        };
        await request(app).post('/auth/register').send(user).then(async(res)=>{
            const registeredUser = await UserService.findUserById(res.text);
            user_id = registeredUser.user_id;
            expect(registeredUser.user_id).toEqual(res.text);
            expect(registeredUser.username).toEqual(user.username);
            expect(registeredUser.email).toEqual(user.email);
        })
        done();
    });
    it('should NOT register user', async done => {
        const user = {
            username: "",
            pass: password,
            email:email,
            token:null
        };
        await request(app).post('/auth/register').send(user).then(async(res)=>{
            const registeredUser = await UserService.findUserById(res.text);
            expect(registeredUser).toEqual(undefined);
        })
        done();
    });
    it('should login user', async done => {
        const user = {
            username: username,
            pass: password,
        };
        await request(app).post('/auth/login').send(user).then(async(res)=>{
            token = res.header['set-cookie'][0].split("=")[1].split(";")[0];
            expect(res.statusCode).toEqual(302);
        })
        done();
    });
    it('should NOT login user, not found', async done => {
        const user = {
            username: "username",
            pass: password,
        };
        await request(app).post('/auth/login').send(user).then(async(res)=>{
            expect(res.header.location).toEqual(undefined);
        })
        done();
    });
    it('should load dashboard page', async done => {
        const res = await request(app).get('/dashboard/shortener').set('cookie', `token=${token}`);
        expect(res.statusCode).toEqual(200)
        done();
    });
    it('should create URL', async done => {
        let url = {
            long_url:"https://github.com",
            short_url:"sinan"
        }
        await request(app).post('/dashboard/shortener').set('cookie', `token=${token}`).send(url).then(async(res)=>{
            const addedUrl = await UrlService.findUrlsOfUserByShortUrl(res.text);
            url1_short = addedUrl.short_url;
            expect(addedUrl.long_url).toEqual(url.long_url);
            expect(addedUrl.short_url).toEqual(url.short_url);
        })
        done();
    });
    it('should open URL', async done => {
        await request(app).get('/'+url1_short).then(async(res)=>{
           expect(res.redirect).toEqual(true)
        })
        done();
    });
    it('should open URL stat', async done => {
        await request(app).get('/dashboard/stats/'+url1_short).set('cookie', `token=${token}`).then(async(res)=>{
           expect(res.statusCode).toEqual(200)
        })
        done();
    });
    it('should remove URL', async done => {
        await request(app).post('/dashboard/remove').set('cookie', `token=${token}`).send({short_url:"localhost:3000/"+url1_short}).then(async(res)=>{
           expect(res.redirect).toEqual(true)
        })
        done();
    });
});