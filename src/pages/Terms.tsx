import Navbar from "@/components/Navbar";
import { Shield, Users, Globe, Lock } from 'lucide-react';

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
                By accessing and using BugKhoji🔍, you accept and agree to be
                bound by the terms and provisions of this agreement. If you do
                not agree to abide by the above, please do not use this service.
              </p>

              <h2>2. Responsible Disclosure</h2>
              <p>
                Users must follow responsible disclosure practices when
                reporting vulnerabilities. This includes:
              </p>
              <ul>
                <li>Providing clear and detailed vulnerability reports</li>
                <li>Not exploiting vulnerabilities for malicious purposes</li>
                <li>
                  Allowing reasonable time for organizations to address reported
                  issues
                </li>
                <li>
                  Not disclosing vulnerabilities publicly without proper
                  coordination
                </li>
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
                Users are responsible for maintaining the confidentiality of
                their account credentials and for all activities that occur
                under their account. You must notify us immediately of any
                unauthorized use of your account.
              </p>

              <h2>5. Content and Intellectual Property</h2>
              <p>
                Users retain ownership of their vulnerability reports and
                related content. By submitting content to the platform, you
                grant us a license to use, store, and process this content for
                the purpose of providing our services.
              </p>

              <h2>6. Platform Availability</h2>
              <p>
                We strive to maintain high availability but do not guarantee
                uninterrupted access to the platform. We reserve the right to
                modify, suspend, or discontinue the service with reasonable
                notice.
              </p>

              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, BugKhoji🔍 shall not be
                liable for any indirect, incidental, special, or consequential
                damages arising from your use of the platform.
              </p>

              <h2>8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Users
                will be notified of significant changes, and continued use of
                the platform constitutes acceptance of the modified terms.
              </p>

              <h2>9. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please
                contact us through our support page.
              </p>
            </div>
          </div>
        </div>
      </div>
{/* Footer */}
            <footer className="relative bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-xl text-white py-16 px-4 border-t border-white/10">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="relative">
                        <Shield className="h-8 w-8 text-cyan-400 mr-3" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        BugKhoji🔍
                      </span>
                    </div>
                    <p className="text-slate-400 leading-relaxed">
                      Connecting ethical hackers with organizations for a safer digital world.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold mb-4 text-cyan-400">Platform</h3>
                    <ul className ="space-y-3 text-slate-400">
                      <li> <a href="/about" className="hover:text-cyan-400 transition-colors">About</a></li>
                      <li> <a href="/careers" className="hover:text-cyan-400 transition-colors">Careers</a></li>
                      <li> <a href="/contact" className="hover:text-cyan-400 transition-colors">Contact</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4 text-cyan-400">Legal</h3>
                    <ul className="space-y-3 text-slate-400">
                      <li><a href="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</a></li>
                      <li><a href="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
                      <li><a href="/support" className="hover:text-cyan-400 transition-colors">Support</a></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4 text-cyan-400">Socials</h3>
                    <ul className="space-y-3 text-slate-400">
                      <li><a href="#" className="hover:text-cyan-400 transition-colors">X</a></li>
                      <li><a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn</a></li>
                      <li><a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
                    </ul>
                  </div>
                </div>
                
                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
                  <p>&copy; 2025 BugKhoji🔍. All rights reserved.</p>
                </div>
              </div>
            </footer>  
    </div>
  );
};

export default Terms;
