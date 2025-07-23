// import HeroSection from "@/components/HeroSection";

// export default function Home() {
//   return (
//     <div>
//       <HeroSection />
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  Users,
  Shapes,
  Zap,
  Shield,
  Palette,
  Share2,
  Github,
  Mail,
  FileText,
  CheckCircle,
  Monitor,
  GraduationCap,
  Briefcase,
  Coffee,
  Star,
  Quote,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";

const Home = () => {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Real-time Collaboration",
      description:
        "Work together seamlessly with your team. See live cursors, instant updates, and collaborate in real-time.",
    },
    {
      icon: <Shapes className="h-6 w-6" />,
      title: "Rich Drawing Tools",
      description:
        "Create with rectangles, circles, lines, and text. Full suite of drawing tools for any creative project.",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description:
        "Optimized for performance with smooth interactions, quick loading, and responsive design.",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security. Private rooms with invite-only access.",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "Intuitive Interface",
      description:
        "Clean, modern design that gets out of your way. Focus on creating, not learning complex tools.",
    },
    {
      icon: <Share2 className="h-6 w-6" />,
      title: "Easy Sharing",
      description:
        "Share your boards instantly with room codes or direct links. Export and collaborate effortlessly.",
    },
  ];

  const useCases = [
    {
      icon: <Monitor className="h-8 w-8" />,
      title: "Design Teams",
      description:
        "Collaborate on wireframes, user flows, and design systems. Perfect for brainstorming sessions and design reviews.",
      features: ["Real-time feedback", "Version control", "Design handoffs"],
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "Education",
      description:
        "Interactive learning experiences for students and teachers. Create engaging lessons and collaborative projects.",
      features: [
        "Interactive lessons",
        "Student collaboration",
        "Visual learning",
      ],
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Business",
      description:
        "Strategic planning, process mapping, and team workshops. Visualize complex ideas and make decisions together.",
      features: ["Process mapping", "Strategic planning", "Team workshops"],
    },
    {
      icon: <Coffee className="h-8 w-8" />,
      title: "Remote Teams",
      description:
        "Bridge the gap for distributed teams. Maintain creativity and collaboration regardless of location.",
      features: ["Async collaboration", "Global access", "Time zone friendly"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer at TechCorp",
      content:
        "DrawFlow Studio has transformed how our design team collaborates. The real-time features are incredible and the interface is so intuitive.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Engineering Manager",
      content:
        "We use this for our architecture reviews and sprint planning. The ability to quickly sketch ideas and share them instantly is game-changing.",
      rating: 5,
    },
    {
      name: "Dr. Emily Watson",
      role: "University Professor",
      content:
        "My students love using this for group projects. It's made remote learning so much more interactive and engaging.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "10M+", label: "Drawings Created" },
    { number: "500K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" },
  ];

  const faqs = [
    {
      question: "Is DrawFlow Studio free to use?",
      answer:
        "Yes! DrawFlow Studio offers a generous free plan that includes real-time collaboration, unlimited personal boards, and all core drawing tools. Premium plans are available for teams that need advanced features.",
    },
    {
      question: "How many people can collaborate on a board simultaneously?",
      answer:
        "Our free plan supports up to 10 collaborators per board. Premium plans offer unlimited collaborators and additional team management features.",
    },
    {
      question: "Can I export my drawings?",
      answer:
        "Absolutely! You can export your boards as PNG, SVG, or PDF files. Premium users also get access to high-resolution exports and batch export features.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Security is our top priority. All data is encrypted in transit and at rest. We're SOC 2 compliant and follow industry best practices for data protection.",
    },
    {
      question: "Do you offer integrations with other tools?",
      answer:
        "Yes! We integrate with popular tools like Slack, Microsoft Teams, Google Workspace, and more. Our API also allows for custom integrations.",
    },
    {
      question: "Can I use DrawFlow Studio offline?",
      answer:
        "DrawFlow Studio requires an internet connection for real-time collaboration features. However, we're working on offline mode for individual work that syncs when you're back online.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Palette className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                DrawFlow Studio
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="hero">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="container mx-auto px-6 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Collaborate
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {" "}
                Visually
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed">
              The ultimate collaborative whiteboard for teams. Draw, design, and
              brainstorm together in real-time with powerful tools and seamless
              sharing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                  Start Drawing Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="glassmorphism"
                className="text-lg px-8 py-6"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              See It In Action
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the power of real-time collaboration with our intuitive
              whiteboard interface.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden shadow-glow border-border">
              <CardContent className="p-0">
                <Image
                  src={"/whiteboard-preview.jpg"}
                  alt="DrawFlow Studio Whiteboard Interface"
                  height={100}
                  width={100}
                  className="w-full h-auto rounded-lg"
                  priority
                  quality={90}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From idea to collaboration in minutes. No complex setup, no
              learning curve.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-primary-foreground">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Create a Room
              </h3>
              <p className="text-muted-foreground">
                Click "Create Room" and give it a name. Your collaborative
                workspace is ready instantly.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-primary-foreground">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Invite Your Team
              </h3>
              <p className="text-muted-foreground">
                Share the room code or direct link with your team. They can join
                with just one click.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <span className="text-2xl font-bold text-primary-foreground">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Start Creating
              </h3>
              <p className="text-muted-foreground">
                Draw, design, and brainstorm together in real-time. See
                everyone's changes instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Trusted by Teams Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of teams already creating amazing things together
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Perfect for Every Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're designing, teaching, planning, or brainstorming,
              DrawFlow Studio adapts to your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {useCases.map((useCase, index) => (
              <Card
                key={index}
                className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300 group"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
                      {useCase.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {useCase.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {useCase.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {useCase.features.map((feature, featureIndex) => (
                          <Badge
                            key={featureIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Real feedback from teams using DrawFlow Studio every day
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-card border-border shadow-card hover:shadow-glow transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-foreground mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about DrawFlow Studio
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Create
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed for modern teams. From simple sketches
              to complex diagrams.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Start Creating?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of teams already using DrawFlow Studio to bring
              their ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" variant="hero" className="text-lg px-8 py-6">
                  Create Your First Room
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Palette className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  DrawFlow Studio
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                The collaborative whiteboard platform designed for modern teams.
                Create, share, and collaborate visually.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon">
                  <Github className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Mail className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Updates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Privacy
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-muted-foreground">
            <p>&copy; 2024 DrawFlow Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
