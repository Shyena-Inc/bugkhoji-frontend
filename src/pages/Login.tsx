
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';

const Login = () => {
  const { role } = useParams();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });

  const getRoleTitle = () => {
    switch (role) {
      case 'researcher': return 'Security Researcher';
      case 'organization': return 'Organization';
      default: return 'User';
    }
  };

  const getRoleDescription = () => {
    switch (role) {
      case 'researcher': return 'Report vulnerabilities and earn rewards';
      case 'organization': return 'Add your organization in the BugKhoji🔍 platform';
      default: return 'Access your account';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/registration
    console.log('Form submitted:', formData);
    
    // Redirect to appropriate dashboard
    const dashboardPath = `/${role}/dashboard`;
    window.location.href = dashboardPath;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {getRoleTitle()} Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              {getRoleDescription()}
            </p>
          </div>

          <Card className="shadow-xl">
            <CardHeader>
              <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>
                    Sign in to your {getRoleTitle().toLowerCase()} account
                  </CardDescription>
                </TabsContent>
                
                <TabsContent value="register">
                  <CardTitle>Create account</CardTitle>
                  <CardDescription>
                    Register as a {getRoleTitle().toLowerCase()}
                  </CardDescription>
                </TabsContent>
              </Tabs>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className='relative'> 
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required={!isLogin}
                      />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>   
                      </div>
                  </div>
                )}
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
                
                {isLogin && (
                  <div className="text-center">
                    <Link to="#" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
          
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
