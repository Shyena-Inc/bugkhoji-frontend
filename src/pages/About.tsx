
import Navbar from '@/components/Navbar';
import { Shield, Users, Globe, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Shield className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            About BugKhoji🔍
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Building a safer digital world through responsible vulnerability disclosure and ethical hacking.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
                BugKhoji🔍 bridges the gap between ethical hackers and organizations by providing a secure, 
                transparent platform for vulnerability disclosure. We believe that collaboration between 
                security researchers and companies is essential for building a safer digital ecosystem.
              </p>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Our platform follows responsible disclosure principles, ensuring that vulnerabilities 
                are reported privately to organizations before any public disclosure, giving them time 
                to fix issues and protect their users.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Secure</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    End-to-end encrypted communication
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Collaborative</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Direct researcher-organization communication
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <Globe className="h-8 w-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Global</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Worldwide network of researchers
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="pt-6 text-center">
                  <Lock className="h-8 w-8 text-red-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Private</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Responsible disclosure practices
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12">
            The Team Behind BugKhoji🔍
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FF</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Flagforge</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">CTF Platform</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Begineer Level CTF Platform
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">SS</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Shyena Security</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Cybersecurity Company</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Security Solution
                </p>
              </CardContent>
            </Card>
            
          {/*  <Card className="border-0 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">EL</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Emily Liu</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">Head of Security</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ethical hacker and bug bounty expert
                </p>
              </CardContent>
            </Card>*/}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-xl font-bold">BugKhoji🔍</span>
              </div>
              <p className="text-slate-400">
                Connecting ethical hackers with organizations for a safer digital world.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 BugKhoji🔍. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
