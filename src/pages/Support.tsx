import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Send,
  HelpCircle,
  MessageCircle,
  Book,
  Mail,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const Support = () => {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Support request submitted:", contactForm);
    // Here you would typically send the form data to your backend
  };

  const handleInputChange = (field: string, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navbar />

      <div className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
              Support Center
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Get help with vulnerability reporting, account management, and
              platform features
            </p>
          </div>

          <Tabs defaultValue="faq" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>

              <TabsTrigger
                value="resources"
                className="flex items-center gap-2"
              >
                <Book className="h-4 w-4" />
                Resources
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>
                    Find answers to common questions about using BugKhoji🔍
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>
                        How do I submit a vulnerability report?
                      </AccordionTrigger>
                      <AccordionContent>
                        To submit a vulnerability report, log in to your
                        researcher account and navigate to the "Submit Report"
                        page. Fill out the form with detailed information about
                        the vulnerability, including steps to reproduce, impact
                        assessment, and any supporting evidence.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger>
                        What makes a good vulnerability report?
                      </AccordionTrigger>
                      <AccordionContent>
                        A good vulnerability report should include: clear
                        description of the vulnerability, step-by-step
                        reproduction instructions, proof of concept or
                        screenshots, impact assessment, and suggested
                        remediation steps. Be specific and provide enough detail
                        for the organization to understand and fix the issue.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3">
                      <AccordionTrigger>
                        How long does it take to get a response?
                      </AccordionTrigger>
                      <AccordionContent>
                        Response times vary by organization and severity of the
                        vulnerability. Typically, you should expect an initial
                        acknowledgment within 3-5 business days. Critical
                        vulnerabilities may receive faster responses, while
                        lower-severity issues might take longer to review.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-4">
                      <AccordionTrigger>
                        Can I report vulnerabilities anonymously?
                      </AccordionTrigger>
                      <AccordionContent>
                        While you need an account to submit reports through our
                        platform, you can choose to remain anonymous to the
                        organization receiving the report. However, we recommend
                        providing contact information to facilitate
                        communication and potentially earn rewards.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-5">
                      <AccordionTrigger>
                        What types of vulnerabilities can I report?
                      </AccordionTrigger>
                      <AccordionContent>
                        You can report various types of security vulnerabilities
                        including but not limited to: SQL injection, XSS, CSRF,
                        authentication bypasses, privilege escalation, data
                        exposure, and infrastructure vulnerabilities. Check each
                        organization's scope and guidelines before testing.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-6">
                      <AccordionTrigger>
                        How do I update my account information?
                      </AccordionTrigger>
                      <AccordionContent>
                        You can update your account information by logging in
                        and navigating to your profile settings. From there, you
                        can modify your personal details, contact information,
                        and security preferences.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* <TabsContent value="contact">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <MessageCircle className="h-6 w-6 text-blue-600 dark:text-cyan-400" />
                      Contact Form
                    </CardTitle>
                    <CardDescription>
                      Send us a message and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your full name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="your.email@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          value={contactForm.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Brief description of your inquiry"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={contactForm.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Describe your issue or question in detail"
                          className="min-h-[120px]"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <div className="space-y-6">
                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Other Ways to Reach Us</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                        <div>
                          <p className="font-medium">Email Support</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">support@bugkhoji.com</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                        <div>
                          <p className="font-medium">Phone Support</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">+1 (555) 123-4567</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                    <CardHeader>
                      <CardTitle className="text-xl">Response Times</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">General Inquiries</span>
                        <span className="text-sm font-medium">24-48 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Technical Support</span>
                        <span className="text-sm font-medium">12-24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Critical Issues</span>
                        <span className="text-sm font-medium">2-6 hours</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent> */}

            <TabsContent value="resources">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Getting Started Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Learn the basics of vulnerability reporting and platform
                      navigation.
                    </p>
                    <Button variant="outline" className="w-full">
                      View Guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Tips for writing effective vulnerability reports and
                      following responsible disclosure.
                    </p>
                    <Button variant="outline" className="w-full">
                      Read More
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-white/20 dark:border-slate-700/50">
                  <CardHeader>
                    <CardTitle className="text-lg">API Documentation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Technical documentation for developers integrating with
                      our platform.
                    </p>
                    <Button variant="outline" className="w-full">
                      View Docs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Support;
