
import Navbar from '@/components/Navbar';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-8 md:p-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-8">
              Terms of Service
            </h1>
            
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using BugKhoji🔍, you accept and agree to be bound by the terms and provisions of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2>2. Responsible Disclosure</h2>
              <p>
                Users must follow responsible disclosure practices when reporting vulnerabilities. This includes:
              </p>
              <ul>
                <li>Providing clear and detailed vulnerability reports</li>
                <li>Not exploiting vulnerabilities for malicious purposes</li>
                <li>Allowing reasonable time for organizations to address reported issues</li>
                <li>Not disclosing vulnerabilities publicly without proper coordination</li>
              </ul>

              <h2>3. Prohibited Activities</h2>
              <p>Users are strictly prohibited from:</p>
              <ul>
                <li>Malicious exploitation of vulnerabilities</li>
                <li>Unauthorized access to systems or data</li>
                <li>Harassment or abuse of other users</li>
                <li>Submitting false or misleading vulnerability reports</li>
                <li>Attempting to compromise the platform's security</li>
              </ul>

              <h2>4. User Accounts</h2>
              <p>
                Users are responsible for maintaining the confidentiality of their account credentials and for all activities 
                that occur under their account. You must notify us immediately of any unauthorized use of your account.
              </p>

              <h2>5. Content and Intellectual Property</h2>
              <p>
                Users retain ownership of their vulnerability reports and related content. By submitting content to the platform, 
                you grant us a license to use, store, and process this content for the purpose of providing our services.
              </p>

              <h2>6. Platform Availability</h2>
              <p>
                We strive to maintain high availability but do not guarantee uninterrupted access to the platform. 
                We reserve the right to modify, suspend, or discontinue the service with reasonable notice.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, BugKhoji🔍 shall not be liable for any indirect, incidental, 
                special, or consequential damages arising from your use of the platform.
              </p>

              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant changes, 
                and continued use of the platform constitutes acceptance of the modified terms.
              </p>

              <h2>9. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through our support page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
