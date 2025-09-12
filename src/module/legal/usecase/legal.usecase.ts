import { Injectable } from '@nestjs/common';
import { ILegalUsecase } from './interface/legal.usecase.interface';

@Injectable()
export class LegalUsecase implements ILegalUsecase {
  async getTermsAndConditions(): Promise<string> {
    return `
<h1>PickFresh Terms and Conditions</h1>
<p><strong>Effective Date: May 15, 2025</strong></p>

<p>Welcome to PickFresh! Please read these Terms and Conditions ("Terms") carefully before using the PickFresh app ("Platform"), operated by PickFresh.</p>

<p>By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree to any part of the Terms, you may not use the Platform.</p>

<h2>1. Overview</h2>
<p>PickFresh is a platform that connects local homeowners ("Sellers") with individuals ("Buyers") looking to purchase fresh, backyard-grown fruit.</p>

<h2>2. Eligibility</h2>
<p>You must be at least 18 years old to use this Platform.</p>

<h2>3. Account Registration</h2>
<p>You are responsible for maintaining the confidentiality of your account and agree to provide accurate, current information.</p>

<h2>4. Seller Responsibilities</h2>
<ul>
  <li>Only fruit may be sold.</li>
  <li>Fruit must be safe for human consumption.</li>
  <li>Sellers must comply with local laws.</li>
  <li>Sellers set their own prices.</li>
  <li>PickFresh may remove listings that violate these terms.</li>
</ul>

<h2>5. Buyer Responsibilities</h2>
<ul>
  <li>Buyers are responsible for inspecting fruit before use.</li>
  <li>Reviews and ratings help maintain community standards.</li>
  <li>PickFresh does not guarantee fruit quality or safety.</li>
</ul>

<h2>6. Payments & Fees</h2>
<ul>
  <li>Payments are processed via third-party providers.</li>
  <li>PickFresh may charge a service fee, disclosed at checkout.</li>
  <li>PickFresh does not store payment information.</li>
</ul>

<h2>7. Refunds & Disputes</h2>
<ul>
  <li>Refunds may be requested within 24 hours of purchase for misrepresented items.</li>
  <li>PickFresh will mediate disputes based on community feedback and evidence.</li>
</ul>

<h2>8. Prohibited Uses</h2>
<p>You may not:</p>
<ul>
  <li>Sell non-fruit items</li>
  <li>Misrepresent items or impersonate others</li>
  <li>Disrupt the platform or engage in fraud</li>
</ul>

<h2>9. Termination</h2>
<p>PickFresh may suspend or terminate accounts that violate these Terms or community guidelines.</p>

<h2>10. Disclaimers</h2>
<p>PickFresh is a marketplace. We are not responsible for actions of buyers or sellers. Use the app at your own risk.</p>

<h2>11. Limitation of Liability</h2>
<p>To the fullest extent allowed by law, PickFresh shall not be liable for any damages arising from your use of the Platform.</p>

<h2>12. Changes to Terms</h2>
<p>These Terms may be updated at any time. Continued use indicates acceptance of updated Terms.</p>
    `.trim();
  }

  async getPrivacyPolicy(): Promise<string> {
    return `
<h1>PickFresh Privacy Policy</h1>
<p><strong>Effective Date: May 15, 2025</strong></p>

<p>PickFresh values your privacy. This policy outlines how we collect, use, and share your personal information.</p>

<h2>1. Information We Collect</h2>
<ul>
  <li>Account Info: Name, email, location</li>
  <li>Usage Info: Device ID, IP address, session data</li>
  <li>Transaction Data: Listings, prices, purchase history</li>
  <li>Location Data: With permission, to match local buyers/sellers</li>
</ul>

<h2>2. How We Use Information</h2>
<ul>
  <li>To facilitate buying and selling</li>
  <li>To improve app performance</li>
  <li>To send transactional updates</li>
  <li>To comply with legal obligations</li>
</ul>

<h2>3. Sharing of Information</h2>
<p>We may share your data with:</p>
<ul>
  <li>Payment processors</li>
  <li>Service providers (e.g., app hosting, analytics)</li>
  <li>Legal authorities if required</li>
</ul>
<p>We do not sell your personal data.</p>

<h2>4. Your Rights & Choices</h2>
<ul>
  <li>Update or delete your profile at any time</li>
  <li>Opt out of promotional emails</li>
  <li>Request account deletion via gopickfresh@gmail.com</li>
</ul>

<h2>5. Data Security</h2>
<p>We use encryption and secure servers, but no system is completely secure. Please use the Platform responsibly.</p>

<h2>6. Children's Privacy</h2>
<p>PickFresh is not intended for users under 18. We do not knowingly collect data from children.</p>

<h2>7. International Users</h2>
<p>By using the app, you consent to data processing in the United States.</p>

<h2>8. Contact Us</h2>
<p>If you have questions about this policy, contact us at:</p>
<p>Email: gopickfresh@gmail.com</p>
    `.trim();
  }
} 