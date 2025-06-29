
import Navbar from '@/components/Navbar';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-8 md:p-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-8">
              Privacy Policy
            </h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h2>Information We Collect</h2>
              <p>We collect information you provide directly to us, including:</p>
              <ul>
                <li>Account information (name, email, profile details)</li>
                <li>Vulnerability reports and related documentation</li>
                <li>Communication with our support team</li>
                <li>Usage data and analytics</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul>
                <li>Provide and maintain our vulnerability disclosure services</li>
                <li>Process and validate vulnerability reports</li>
                <li>Communicate with you about our services and your reports</li>
                <li>Improve our platform and user experience</li>
                <li>Ensure security and prevent fraud</li>
              </ul>

              <h2>Information Sharing</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share your information:
              </p>
              <ul>
                <li>With organizations when you submit vulnerability reports to them</li>
                <li>When required by law or to protect our rights</li>
                <li>With service providers who assist in operating our platform</li>
                <li>In anonymized form for research and analytics</li>
              </ul>

              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. This includes encryption, access controls, 
                and regular security audits.
              </p>

              <h2>Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and comply with legal 
                obligations. Vulnerability reports may be retained longer for security research purposes.
              </p>

              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and update your personal information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of non-essential communications</li>
                <li>Export your data in a portable format</li>
              </ul>

              <h2>Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services. 
                You can control cookie preferences through your browser settings.
              </p>

              <h2>International Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate 
                safeguards are in place to protect your privacy rights.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not intended for children under 13. We do not knowingly collect personal information from 
                children under 13 years of age.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new 
                policy on this page and updating the "Last updated" date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us through our 
                support page or email us directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
