export const LEGAL_USECASE = 'LEGAL_USECASE';

export interface ILegalUsecase {
  getTermsAndConditions(): Promise<string>;
  getPrivacyPolicy(): Promise<string>;
} 