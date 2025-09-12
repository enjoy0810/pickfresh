import { User } from '../../domain/model/user.entity';

export const USER_USECASE = 'USER_USECASE';

export interface IUserUsecase {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByFirebaseUid(firebaseUid: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User | null>;
  softDelete(id: string): Promise<boolean>;

  getBalance(userId: string): Promise<number>;
  withdrawToBank(userId: string, amount: number): Promise<User>;

  // Add new method
  getBalanceByEmail(email: string): Promise<number>;

} 