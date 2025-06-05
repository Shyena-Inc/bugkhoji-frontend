
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Upload, Moon, Sun, Settings, FileText, Users } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const SiteSettings = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [publicRegistration, setPublicRegistration] = useState(true);
  const [heroText, setHeroText] = useState('Secure the digital world through responsible disclosure');
  const [tagline, setTagline] = useState('BugKhoji🔍 - Your trusted vulnerability disclosure platform');
  const [termsOfService, setTermsOfService] = useState(`# Terms of Service

## 1. Acceptance of Terms
By accessing and using BugKhoji🔍, you accept and agree to be bound by the terms and provisions of this agreement.

## 2. Responsible Disclosure
Users must follow responsible disclosure practices when reporting vulnerabilities.

## 3. Prohibited Activities
- No malicious exploitation of vulnerabilities
- No unauthorized access to systems
- No harassment of other users

## 4. User Accounts
Users are responsible for maintaining the confidentiality of their account credentials.`);

  const [privacyPolicy, setPrivacyPolicy] = useState(`# Privacy Policy

## Information We Collect
We collect information you provide directly to us, such as when you create an account or submit vulnerability reports.

## How We Use Your Information
- To provide and maintain our services
- To process vulnerability reports
- To communicate with you about our services

## Information Sharing
We do not sell or rent your personal information to third parties.

## Data Security
We implement appropriate security measures to protect your personal information.`);

  const handleSave = () => {
    console.log('Saving site settings...');
    // Mock save functionality
  };

  const handleLogoUpload = () => {
    console.log('Logo upload functionality would be implemented here');
  };

  const handleFaviconUpload = () => {
    console.log('Favicon upload functionality would be implemented here');
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
            Site Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Configure platform settings, content, and policies
          </p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Settings</CardTitle>
                  <CardDescription>
                    Configure the platform's appearance and theme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Enable dark theme for the platform
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={setIsDarkMode}
                      />
                      <Moon className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Branding</CardTitle>
                  <CardDescription>
                    Upload and manage platform branding assets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Platform Logo</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={handleLogoUpload}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Logo
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Recommended: 200x50px PNG
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" onClick={handleFaviconUpload}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Favicon
                      </Button>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Recommended: 32x32px ICO
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Homepage Content</CardTitle>
                  <CardDescription>
                    Customize the text and messaging on your homepage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tagline">Platform Tagline</Label>
                    <Input
                      id="tagline"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="Enter platform tagline"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heroText">Hero Section Text</Label>
                    <Textarea
                      id="heroText"
                      value={heroText}
                      onChange={(e) => setHeroText(e.target.value)}
                      placeholder="Enter hero section text"
                      className="min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="policies">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Terms of Service</CardTitle>
                  <CardDescription>
                    Edit the platform's terms of service (Markdown supported)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={termsOfService}
                    onChange={(e) => setTermsOfService(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter terms of service in Markdown format"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Policy</CardTitle>
                  <CardDescription>
                    Edit the platform's privacy policy (Markdown supported)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={privacyPolicy}
                    onChange={(e) => setPrivacyPolicy(e.target.value)}
                    className="min-h-[300px] font-mono text-sm"
                    placeholder="Enter privacy policy in Markdown format"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Registration Settings</CardTitle>
                <CardDescription>
                  Configure user registration and account settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Public Registration</Label>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Allow new users to register for researcher accounts
                    </p>
                  </div>
                  <Switch
                    checked={publicRegistration}
                    onCheckedChange={setPublicRegistration}
                  />
                </div>
                
                {!publicRegistration && (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Public registration is disabled. New researchers must be invited by administrators.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;
