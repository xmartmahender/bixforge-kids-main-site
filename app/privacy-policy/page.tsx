'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';

export default function PrivacyPolicyPage() {
  return (
    <div>
      <UserTracker contentType="general" contentId="main" />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">Privacy Policy</h1>

          {/* Last Updated */}
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-8 text-center">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Introduction */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Our Commitment to Children&apos;s Privacy</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              At Kidz Zone, we take children&apos;s privacy very seriously. This Privacy Policy explains how we
              collect, use, and protect information when children use our website. We comply with the
              Children&apos;s Online Privacy Protection Act (COPPA) and other applicable privacy laws.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">1. Information We Collect</h2>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Information We DO NOT Collect from Children</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Personal names or real names</li>
                    <li>Home addresses or school addresses</li>
                    <li>Email addresses</li>
                    <li>Telephone numbers</li>
                    <li>Social Security numbers</li>
                    <li>Photos or videos of children</li>
                    <li>Any other personal identifying information</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Information We May Collect</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Age group selection (for age-appropriate content)</li>
                    <li>Anonymous usage data (which stories/videos are viewed)</li>
                    <li>Technical information (browser type, device type) for website functionality</li>
                    <li>Cookies for website functionality (no personal data)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">2. How We Use Information</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">We use the limited information we collect only to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Provide age-appropriate content and experiences</li>
                  <li>Improve our website functionality and user experience</li>
                  <li>Ensure the safety and security of our platform</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p className="text-gray-700 mt-3 font-semibold">
                  We NEVER use children&apos;s information for marketing, advertising, or commercial purposes.
                </p>
              </div>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">3. Information Sharing</h2>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-700 font-semibold mb-2">We DO NOT sell, rent, or share children&apos;s information with third parties, except:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>When required by law or legal process</li>
                  <li>To protect the safety of children or others</li>
                  <li>With service providers who help us operate our website (under strict confidentiality agreements)</li>
                </ul>
              </div>
            </section>

            {/* Parental Rights */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">4. Parental Rights and Control</h2>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">Parents have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Review any personal information we have collected from their child</li>
                  <li>Request deletion of their child&apos;s personal information</li>
                  <li>Refuse to allow further collection of their child&apos;s information</li>
                  <li>Contact us with questions about our privacy practices</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  <strong>Contact us at:</strong> privacy@kidzzone.com or +1 (555) 123-KIDZ
                </p>
              </div>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">5. Cookies and Tracking</h2>
              <div className="space-y-3">
                <p className="text-gray-700">
                  We use minimal cookies and tracking technologies only for essential website functionality:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                    <li><strong>Preference Cookies:</strong> Remember age group selection</li>
                    <li><strong>Analytics:</strong> Anonymous usage statistics to improve our content</li>
                  </ul>
                </div>
                <p className="text-gray-700">
                  We do NOT use cookies for advertising, marketing, or behavioral tracking.
                </p>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">6. Data Security</h2>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">We protect information through:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Secure servers and encrypted data transmission</li>
                  <li>Limited access to information by authorized personnel only</li>
                  <li>Regular security audits and updates</li>
                  <li>Immediate deletion of any accidentally collected personal information</li>
                </ul>
              </div>
            </section>

            {/* Third-Party Links */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">7. Third-Party Links</h2>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Our website may contain links to educational content on other websites. We are not
                  responsible for the privacy practices of other websites. We encourage parents to
                  review the privacy policies of any websites their children visit.
                </p>
              </div>
            </section>

            {/* Age Verification */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">8. Age Verification</h2>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Our website is designed for children under 13 with parental supervision. We do not
                  knowingly collect personal information from children without parental consent. If we
                  discover we have collected personal information from a child without parental consent,
                  we will delete it immediately.
                </p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">9. Changes to This Policy</h2>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  We may update this Privacy Policy from time to time. We will notify parents of any
                  material changes by posting the updated policy on our website and updating the
                  &quot;Last Updated&quot; date. We encourage parents to review this policy regularly.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">10. Contact Us</h2>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">Email:</h4>
                    <p className="text-gray-700">privacy@kidzzone.com</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Phone:</h4>
                    <p className="text-gray-700">+1 (555) 123-KIDZ</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Mail:</h4>
                    <p className="text-gray-700">
                      Kidz Zone Privacy Team<br />
                      123 Learning Street<br />
                      Education City, EC 12345
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Response Time:</h4>
                    <p className="text-gray-700">Within 24 hours for privacy concerns</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Call to Action */}
          <div className="mt-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Questions About Privacy?</h3>
            <p className="text-lg mb-6">
              We&apos;re here to help! Contact our privacy team with any questions or concerns.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
