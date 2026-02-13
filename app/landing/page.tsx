import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Users,
  FileText,
  Target,
  Database,
  Settings,
  ArrowRight,
  Mail,
  Brain,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Email Intelligence</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              Never Let Another Email
              <br />
              <span className="text-primary">Get Lost in the Shuffle</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automatically route every customer email to the right team member
              with AI-powered context analysis. Save hours of manual triage and
              never miss an important message.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/">
                <Button size="lg" className="gap-2 text-lg px-8">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 text-lg px-8"
                >
                  <Mail className="h-5 w-5" />
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 lg:py-28 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  The Email Triage Problem
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Companies receive hundreds of customer emails daily. Manual
                  routing is slow, error-prone, and wastes valuable time.
                  Support tickets get assigned to the wrong team, leading to
                  delays and frustrated customers.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                    </div>
                    <p className="text-muted-foreground">
                      Hours wasted on manual email sorting and assignment
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                    </div>
                    <p className="text-muted-foreground">
                      Emails routed to wrong teams, causing delays
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-5 w-5 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                    </div>
                    <p className="text-muted-foreground">
                      No visibility into why assignments were made
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  The MailSplit Solution
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our AI analyzes email content, understands context, and
                  instantly routes messages to the perfect team member. Every
                  assignment includes transparent reasoning, and you maintain
                  full control with manual overrides.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-muted-foreground">
                      AI-powered instant routing based on content & context
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Transparent assignment reasoning for every decision
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-primary flex-shrink-0" />
                    <p className="text-muted-foreground">
                      Manual override with full team collaboration tools
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 lg:py-28 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Everything You Need
              </h2>
              <p className="text-xl text-muted-foreground">
                Powerful features that transform how you handle customer emails
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">AI-Powered Routing</h3>
                  <p className="text-muted-foreground">
                    Advanced keyword and context analysis automatically assigns
                    emails to the most relevant team based on content
                    understanding.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Smart Team Management
                  </h3>
                  <p className="text-muted-foreground">
                    Organize teams by products, issues handled, and contact
                    emails. AI uses this data to make intelligent routing
                    decisions.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Collaborative Notes</h3>
                  <p className="text-muted-foreground">
                    Add context and observations to emails. Notes auto-save and
                    sync in real-time for seamless team collaboration.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 4 */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Document Intelligence
                  </h3>
                  <p className="text-muted-foreground">
                    Upload PDFs, DOCX, or TXT files and AI automatically
                    extracts team information to populate forms instantly.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 5 */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Real-Time Sync</h3>
                  <p className="text-muted-foreground">
                    Powered by Supabase for lightning-fast real-time updates.
                    All data syncs instantly across your entire team.
                  </p>
                </CardContent>
              </Card>

              {/* Feature 6 */}
              <Card className="border-primary/20 bg-card/50 backdrop-blur hover:border-primary/40 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Manual Override</h3>
                  <p className="text-muted-foreground">
                    Human-in-the-loop design. Override AI decisions anytime with
                    intuitive dropdown selectors and reassignment controls.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-28 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-xl text-muted-foreground">
                Three simple steps to intelligent email routing
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="relative">
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-3xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-2xl font-semibold">Email Arrives</h3>
                  <p className="text-muted-foreground">
                    When a customer email hits your inbox, MailSplit immediately
                    analyzes the subject, content, and context to understand the
                    inquiry.
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/20" />
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="space-y-4">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-3xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="text-2xl font-semibold">AI Matches Team</h3>
                  <p className="text-muted-foreground">
                    Our AI engine compares the email against your team
                    configurations, matching it to the perfect POC based on
                    products and issues handled.
                  </p>
                </div>
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-primary/20" />
              </div>

              {/* Step 3 */}
              <div className="space-y-4">
                <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="text-3xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-2xl font-semibold">Instant Assignment</h3>
                <p className="text-muted-foreground">
                  The email is automatically routed with full transparency. View
                  assignment reasoning, add notes, or reassign with one click.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits with Metrics */}
      <section className="py-20 lg:py-28 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Measurable Impact
              </h2>
              <p className="text-xl text-muted-foreground">
                Real results that transform your customer support
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-primary/20">
                <CardContent className="p-6 text-center space-y-2">
                  <Clock className="h-8 w-8 text-primary mx-auto" />
                  <div className="text-4xl font-bold text-primary">10+</div>
                  <div className="text-sm text-muted-foreground">
                    Hours Saved Weekly
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-6 text-center space-y-2">
                  <Target className="h-8 w-8 text-primary mx-auto" />
                  <div className="text-4xl font-bold text-primary">99%</div>
                  <div className="text-sm text-muted-foreground">
                    Routing Accuracy
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-6 text-center space-y-2">
                  <Users className="h-8 w-8 text-primary mx-auto" />
                  <div className="text-4xl font-bold text-primary">100%</div>
                  <div className="text-sm text-muted-foreground">
                    Team Collaboration
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardContent className="p-6 text-center space-y-2">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto" />
                  <div className="text-4xl font-bold text-primary"></div>
                  <div className="text-sm text-muted-foreground">
                    Scalability
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 lg:py-28 border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-lg text-muted-foreground">
                Powered by the latest tools and frameworks
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-6 py-3 rounded-lg bg-card border border-border">
                <span className="font-medium">Next.js 14</span>
              </div>
              <div className="px-6 py-3 rounded-lg bg-card border border-border">
                <span className="font-medium">TypeScript</span>
              </div>
              <div className="px-6 py-3 rounded-lg bg-card border border-border">
                <span className="font-medium">Supabase</span>
              </div>
              <div className="px-6 py-3 rounded-lg bg-card border border-border">
                <span className="font-medium">OpenAI / Anthropic</span>
              </div>
              <div className="px-6 py-3 rounded-lg bg-card border border-border">
                <span className="font-medium">Tailwind CSS</span>
              </div>
              <div className="px-6 py-3 rounded-lg bg-card border border-border">
                <span className="font-medium">Shadcn UI</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-4xl lg:text-5xl font-bold">
                  Ready to Transform Your Email Workflow?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join teams that are saving hours every week with intelligent
                  email routing. Get started in minutes.
                </p>
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Link href="/">
                    <Button size="lg" className="gap-2 text-lg px-8">
                      Start Using MailSplit
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 text-lg px-8"
                    >
                      <Mail className="h-5 w-5" />
                      View Live Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 MailSplit. Built with Next.js, TypeScript, and AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
