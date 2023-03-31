import { FastifyInstance } from "fastify";
import knex from "knex";
import crypto from 'node:crypto';

export async function transactionsRoutes(app: FastifyInstance) {
  app.get('/transactions', async () => {
    const transaction = await knex('transactions').insert({
        id: crypto.randomUUID(),
        title: 'Transação de teste',
        amount: 1000,
    }).returning('*')

    return transaction;
  })
}