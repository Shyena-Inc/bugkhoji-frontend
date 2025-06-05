
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Bug, Users, Award, TrendingUp, Star, Zap, Target, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 font-['Inter',sans-serif] overflow-hidden">
      <Navbar />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-cyan-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-400/10 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/5 dark:bg-indigo-400/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-4 rounded-2xl border border-white/20 dark:border-slate-700/50">
                <Shield className="h-16 w-16 text-blue-600 dark:text-cyan-400" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            Bridge the Gap Between
            <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent animate-pulse">
              Security and Innovation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            BugKhoji🔍 connects ethical hackers with organizations to create a safer digital world. 
            Report vulnerabilities, earn rewards, and help build stronger security.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 text-lg rounded-2xl shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-200"
            >
              <Bug className="mr-3 h-6 w-6 group-hover:animate-bounce" />
              Submit a Vulnerability
              <Zap className="ml-2 h-4 w-4 opacity-70" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="group px-10 py-4 text-lg rounded-2xl border-2 border-blue-600/50 dark:border-cyan-400/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:bg-blue-50/80 dark:hover:bg-slate-700/80 text-blue-600 dark:text-cyan-400 hover:border-blue-600 dark:hover:border-cyan-400 transform hover:scale-105 transition-all duration-200"
            >
              <Shield className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
              Register as Organization
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Bug, count: '300+', label: 'Reports Resolved', color: 'from-green-500 to-emerald-500', delay: '0ms' },
              { icon: Users, count: '150+', label: 'Organizations', color: 'from-blue-500 to-cyan-500', delay: '100ms' },
              { icon: Award, count: '$2.5M+', label: 'Rewards Paid', color: 'from-yellow-500 to-orange-500', delay: '200ms' },
              { icon: TrendingUp, count: '95%', label: 'Resolution Rate', color: 'from-purple-500 to-indigo-500', delay: '300ms' }
            ].map((stat, index) => (
              <Card 
                key={index} 
                className="group relative text-center border-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-3xl hover:scale-105 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: stat.delay }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <CardContent className="relative pt-8 pb-6">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:scale-110 transition-transform">
                    {stat.count}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 font-medium">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="relative py-20 px-4 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Level Up Your Security Skills
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
            Earn badges, climb leaderboards, and unlock achievements
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Target, title: 'Precision Hunter', desc: 'Find critical vulnerabilities', badge: '🎯' },
              { icon: Zap, title: 'Speed Demon', desc: 'Quick response times', badge: '⚡' },
              { icon: Globe, title: 'Global Guardian', desc: 'Protect worldwide', badge: '🌍' }
            ].map((achievement, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all"></div>
                <Card className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50 rounded-3xl group-hover:scale-105 transition-all duration-300">
                  <CardContent className="pt-8 pb-6 text-center">
                    <div className="text-4xl mb-4">{achievement.badge}</div>
                    <achievement.icon className="h-8 w-8 text-blue-600 dark:text-cyan-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {achievement.desc}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Trusted by Security Professionals Worldwide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "BugKhoji🔍 has revolutionized how we handle security research. The platform makes vulnerability disclosure seamless and professional.",
                author: "Sarah Chen, Security Engineer at TechCorp",
                rating: 5
              },
              {
                quote: "As an ethical hacker, BugKhoji🔍 provides the perfect platform to contribute to cybersecurity while earning fair rewards.",
                author: "Alex Rodriguez, Security Researcher",
                rating: 5
              },
              {
                quote: "The quality of reports and professionalism of researchers on BugKhoji🔍 is unmatched. Highly recommended.",
                author: "Mark Thompson, CISO at FinanceFirst",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="group bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl hover:scale-105 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <div className="flex text-yellow-400 mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {testimonial.author}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
              <h3 className="font-semibold mb-4 text-cyan-400">Platform</h3>
              <ul className="space-y-3 text-slate-400">
                <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link></li>
                <li><Link to="/careers" className="hover:text-cyan-400 transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
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
              <h3 className="font-semibold mb-4 text-cyan-400">Social</h3>
              <ul className="space-y-3 text-slate-400">
                <li><a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-cyan-400 transition-colors">GitHub</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 BugKhoji🔍. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
