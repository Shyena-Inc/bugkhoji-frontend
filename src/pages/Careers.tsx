
import Navbar from '@/components/Navbar';
import { Shield, MapPin, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Careers = () => {
  const jobs = [
    {
      title: "Senior Security Engineer",
      location: "Remote / San Francisco, CA",
      type: "Full-time",
      salary: "$140k - $180k",
      description: "Lead security initiatives and work with our platform security team to ensure BugKhoji🔍 remains secure.",
    },
    {
      title: "Frontend Developer",
      location: "Remote / New York, NY",
      type: "Full-time",
      salary: "$110k - $140k",
      description: "Build beautiful and intuitive user interfaces for our vulnerability disclosure platform.",
    },
    {
      title: "DevOps Engineer",
      location: "Remote",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Manage and scale our cloud infrastructure to support thousands of security researchers.",
    },
    {
      title: "Product Manager",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$130k - $170k",
      description: "Drive product strategy and work closely with security researchers and organizations.",
    }
  ];

  const values = [
    {
      title: "Security First",
      description: "Everything we build prioritizes security and privacy of our users."
    },
    {
      title: "Transparency",
      description: "We believe in open communication and responsible disclosure practices."
    },
    {
      title: "Innovation",
      description: "We continuously improve our platform with cutting-edge technology."
    },
    {
      title: "Community",
      description: "We support and grow the ethical hacking community worldwide."
    }
  ];

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
            Join Our Mission
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Help us build the future of cybersecurity and make the digital world safer for everyone.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Open Positions
          </h2>
          <div className="space-y-6">
            {jobs.map((job, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900 dark:text-white">
                    {job.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-slate-600 dark:text-slate-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-slate-600 dark:text-slate-300">
                      <Clock className="h-4 w-4 mr-2" />
                      {job.type}
                    </div>
                    <div className="flex items-center text-slate-600 dark:text-slate-300">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {job.salary}
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    {job.description}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            We're always looking for talented individuals who share our passion for cybersecurity. 
            Send us your resume and tell us how you'd like to contribute to BugKhoji🔍.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
            Send Us Your Resume
          </Button>
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

export default Careers;
