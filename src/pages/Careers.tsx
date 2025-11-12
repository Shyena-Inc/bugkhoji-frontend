
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Shield, MapPin, Clock, DollarSign, Loader2, Briefcase, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/utils/api';
import { toast } from '@/hooks/use-toast';
import { ErrorHandler } from '@/utils/errorHandler';

interface Position {
  id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  department: string;
  requirements: string[];
  responsibilities: string[];
  salary?: string;
  isActive: boolean;
  createdAt: string;
}

const Careers = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/v1/positions');
      if (response.data.success) {
        setPositions(response.data.data);
      }
    } catch (error: any) {
      ErrorHandler.handleApiError(error, 'Failed to load positions');
      toast({
        title: 'Error',
        description: 'Failed to load positions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (position: Position) => {
    // Open email client with pre-filled subject
    const subject = encodeURIComponent(`Application for ${position.title}`);
    const body = encodeURIComponent(`Dear Hiring Team,\n\nI am interested in applying for the ${position.title} position.\n\nBest regards,`);
    window.location.href = `mailto:careers@bugkhoji.com?subject=${subject}&body=${body}`;
  };

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
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : positions.length > 0 ? (
            <div className="space-y-6">
              {positions.map((position) => (
                <Card key={position.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-900 dark:text-white mb-2">
                          {position.title}
                        </CardTitle>
                        <Badge variant="outline" className="mb-2">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {position.department}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <MapPin className="h-4 w-4 mr-2" />
                        {position.location}
                      </div>
                      <div className="flex items-center text-slate-600 dark:text-slate-300">
                        <Clock className="h-4 w-4 mr-2" />
                        {position.type}
                      </div>
                      {position.salary && (
                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                          <DollarSign className="h-4 w-4 mr-2" />
                          {position.salary}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {position.description}
                    </p>

                    {selectedPosition?.id === position.id && (
                      <div className="mt-4 space-y-4 border-t pt-4">
                        {position.requirements.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Requirements:</h4>
                            <ul className="space-y-1">
                              {position.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start text-slate-600 dark:text-slate-300">
                                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {position.responsibilities.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Responsibilities:</h4>
                            <ul className="space-y-1">
                              {position.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex items-start text-slate-600 dark:text-slate-300">
                                  <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-600 flex-shrink-0" />
                                  <span>{resp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleApply(position)}
                      >
                        Apply Now
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedPosition(selectedPosition?.id === position.id ? null : position)}
                      >
                        {selectedPosition?.id === position.id ? 'Show Less' : 'View Details'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12 text-center">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Open Positions
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We don't have any open positions at the moment, but we're always looking for talented individuals.
                  Feel free to send us your resume!
                </p>
              </CardContent>
            </Card>
          )}
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
              <h3 className="font-semibold mb-4">Socials</h3>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">X</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2025 BugKhoji🔍. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Careers;
