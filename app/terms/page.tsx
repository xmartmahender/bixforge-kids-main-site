'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function TermsPage() {
  return (
    <div>
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Terms of <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Service</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Please read these terms and conditions carefully before using our service.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using Kidz Zone, you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use License</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Permission is granted to temporarily download one copy of the materials on Kidz Zone for personal, non-commercial transitory viewing only.
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>This is the grant of a license, not a transfer of title</li>
                  <li>This license shall automatically terminate if you violate any of these restrictions</li>
                  <li>Upon terminating your viewing of these materials, you must destroy any downloaded materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Content Guidelines</h2>
                <p className="text-gray-600 leading-relaxed">
                  All content on Kidz Zone is designed to be educational and age-appropriate. We maintain strict guidelines to ensure a safe learning environment for children.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Disclaimer</h2>
                <p className="text-gray-600 leading-relaxed">
                  The materials on Kidz Zone are provided on an &apos;as is&apos; basis. Kidz Zone makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at hello@kidzzone.com
                </p>
              </section>
            </div>

            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">
                Last updated: January 2025
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
