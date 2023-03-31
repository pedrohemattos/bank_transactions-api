import fastify from 'fastify';
import { knex } from './database';
import crypto from 'node:crypto';

const app = fastify();

app.listen({
    port: 3333
}).then(() => {
    console.log('🚀 Server HTTP Running!')
})

app.get('/transactions', async () => {
    const transaction = await knex('transactions').insert({
        id: crypto.randomUUID(),
        title: 'Transação de teste',
        amount: 1000,
    }).returning('*')

    return transaction;

    // const transactions = await knex('transactions').select('*')

    // return transactions;

})