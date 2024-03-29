import { Request, Response } from "express";
import { CreateTransactionUseCase } from "../../../domain/usecases/create-transaction-usecase";
import { GetAvailableTransactionUseCase } from "../../../domain/usecases/get-available-transaction-usecase";
import { GetWaitingFundsTransactionUseCase } from "../../../domain/usecases/get-waiting-funds-transaction-usecase";
import logger from "../../helper/logger";
import { TransactionPostgresRepository } from "../../repositories/prisma/transaction-repository";

interface RequestQuery {
  cpf: string
}

export class TransactionController {
  constructor(
    private readonly createTransaction: CreateTransactionUseCase,
    private readonly getAvailableTransaction: GetAvailableTransactionUseCase,
    private readonly getWaitingFundsTransaction: GetWaitingFundsTransactionUseCase,
    private readonly transactionRepository: TransactionPostgresRepository
  ) { }

  async create(request: Request, response: Response) {
    try {
      await this.createTransaction.create(request.body);
      const transaction = await this.transactionRepository.findAll();

      logger.info({ req: request, res: response });

      return response.json(transaction);
    } catch (error: any) {
      logger.warn(error);
      return response.status(400).json({ message: error.message });
    }
  }

  async getAvailable(request: Request, response: Response) {
    try {
      const { cpf } = request.query as unknown as RequestQuery
      const transaction = await this.getAvailableTransaction.getAvailable(cpf);

      logger.info({ req: request, res: response });

      return response.json(transaction);
    } catch (error: any) {
      logger.warn(error);
      return response.status(400).json({ message: error.message });
    }
  }

  async getWaitingFunds(request: Request, response: Response) {
    try {
      const { cpf } = request.query as unknown as RequestQuery
      const transaction = await this.getWaitingFundsTransaction.getWaitingFunds(cpf);

      logger.info({ req: request, res: response });

      return response.json(transaction);
    } catch (error: any) {
      logger.warn(error);
      return response.status(400).json({ message: error.message });
    }
  }
}
