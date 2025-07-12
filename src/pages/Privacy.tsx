
import Navbar from '@/components/Navbar';
import { Shield, Users, Globe, Lock } from 'lucide-react';

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

export default Privacy;
