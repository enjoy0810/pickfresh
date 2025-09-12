import { Resolver, Query } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import { ILegalUsecase, LEGAL_USECASE } from '../../usecase/interface/legal.usecase.interface';

@Resolver()
export class LegalResolver {
  constructor(
    @Inject(LEGAL_USECASE)
    private readonly legalUsecase: ILegalUsecase,
  ) {}

  @Query(() => String, { description: 'Get Terms and Conditions as HTML' })
  async termsAndConditions(): Promise<string> {
    return this.legalUsecase.getTermsAndConditions();
  }

  @Query(() => String, { description: 'Get Privacy Policy as HTML' })
  async privacyPolicy(): Promise<string> {
    return this.legalUsecase.getPrivacyPolicy();
  }
} 