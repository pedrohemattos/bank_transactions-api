import { beforeAll, afterAll, beforeEach, describe, it, expect } from 'vitest';
import supertest from 'supertest';
import { app } from '../app';
import { execSync } from 'node:child_process';

describe('Transaction routes', () => {

  beforeAll(async () => {
    await app.ready();
  });
  
  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  });
  
  it('should be able to create a new transaction', async () => {
    const response = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      })
      .expect(201)
  });

  it('should be able to list all transactions', async () => {
    const createTransactionRequest = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      });

    const cookies = createTransactionRequest.get('Set-Cookie');

    const listTransactionsResponse = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 5000
      })
    ]);
  });

  it('should be able to list a specific transaction', async () => {
    const createTransactionRequest = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 5000,
        type: 'credit'
      });

    const cookies = createTransactionRequest.get('Set-Cookie');

    const listTransactionsRequest = await supertest(app.server)
      .get('/transactions')
      .set('Cookie', cookies);

    const transaction_id = listTransactionsRequest.body.transactions[0].id;

    const listSpecificTransactionRequest = await supertest(app.server)
      .get(`/transactions/${transaction_id}`)
      .set('Cookie', cookies)
    
    expect(listSpecificTransactionRequest.body.transaction).toEqual(
      expect.objectContaining({
        id: transaction_id,
        title: 'New transaction',
        amount: 5000
      })
    );
  });

  it('should be able to get the summary', async () => {
    const createTransactionRequest = await supertest(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 5000,
        type: 'credit'
      });

    const cookies = createTransactionRequest.get('Set-Cookie');

    await supertest(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit'
      });

    const getSummaryRequest = await supertest(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
    
    expect(getSummaryRequest.body.summary).toEqual({
      amount: 3000
    })

  })

})
