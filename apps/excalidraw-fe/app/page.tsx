import { AnimatedBackground } from "@/components/AnimatedBackground";
import FeatureCard from "@/components/FeatureCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Coffee,
  FileText,
  Github,
  GraduationCap,
  Lock,
  Mail,
  MessageSquare,
  Monitor,
  Pencil,
  Shapes,
  Share2,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  // const features = [
  //   {
  //     icon: <Users className="h-6 w-6" />,
  //     title: "Real-time Collaboration",
  //     description:
  //       "Work together seamlessly with your team. See live cursors, instant updates, and collaborate in real-time.",
  //   },
  //   {
  //     icon: <Shapes className="h-6 w-6" />,
  //     title: "Rich Drawing Tools",
  //     description:
  //       "Create with rectangles, circles, lines, and text. Full suite of drawing tools for any creative project.",
  //   },
  //   {
  //     icon: <Zap className="h-6 w-6" />,
  //     title: "Lightning Fast",
  //     description:
  //       "Optimized for performance with smooth interactions, quick loading, and responsive design.",
  //   },
  //   {
  //     icon: <Shield className="h-6 w-6" />,
  //     title: "Secure & Private",
  //     description:
  //       "Your data is protected with enterprise-grade security. Private rooms with invite-only access.",
  //   },
  //   {
  //     icon: <Palette className="h-6 w-6" />,
  //     title: "Intuitive Interface",
  //     description:
  //       "Clean, modern design that gets out of your way. Focus on creating, not learning complex tools.",
  //   },
  //   {
  //     icon: <Share2 className="h-6 w-6" />,
  //     title: "Easy Sharing",
  //     description:
  //       "Share your boards instantly with room codes or direct links. Export and collaborate effortlessly.",
  //   },
  // ];

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

  // const testimonials = [
  //   {
  //     name: "Sarah Chen",
  //     role: "Product Designer at TechCorp",
  //     content:
  //       "Drawly Studio has transformed how our design team collaborates. The real-time features are incredible and the interface is so intuitive.",
  //     rating: 5,
  //   },
  //   {
  //     name: "Marcus Rodriguez",
  //     role: "Engineering Manager",
  //     content:
  //       "We use this for our architecture reviews and sprint planning. The ability to quickly sketch ideas and share them instantly is game-changing.",
  //     rating: 5,
  //   },
  //   {
  //     name: "Dr. Emily Watson",
  //     role: "University Professor",
  //     content:
  //       "My students love using this for group projects. It's made remote learning so much more interactive and engaging.",
  //     rating: 5,
  //   },
  // ];

  // const stats = [
  //   { number: "10M+", label: "Drawings Created" },
  //   { number: "500K+", label: "Active Users" },
  //   { number: "99.9%", label: "Uptime" },
  //   { number: "150+", label: "Countries" },
  // ];

  const faqs = [
    {
      question: "Is Drawly Studio free to use?",
      answer:
        "Yes! Drawly Studio offers a generous free plan that includes real-time collaboration, unlimited personal boards, and all core drawing tools. Premium plans are available for teams that need advanced features.",
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
      question: "Can I use Drawly Studio offline?",
      answer:
        "Drawly Studio requires an internet connection for real-time collaboration features. However, we're working on offline mode for individual work that syncs when you're back online.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Pencil className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Drawly
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/rooms">
                <Button
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/10"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/rooms">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      {/* <section className="relative overflow-hidden">
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
              <Link href="/rooms">
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
      </section> */}

      <AnimatedBackground />

      <div className="max-w-7xl mx-auto px-6 py-32 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
            <p className="text-sm font-semibold text-purple-400">
              Collaborate in Real-Time
            </p>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold text-balance leading-tight">
            Draw, Chat &amp;{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Create Together
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The ultimate collaborative drawing platform where teams come
            together to visualize ideas in real-time. Draw shapes, chat, and
            create magic with your team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/auth/signup">
            <Button size="lg">
              Start Drawing Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/features">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500/40 hover:bg-purple-500/20"
            >
              Explore Features
            </Button>
          </Link>
        </div>

        {/* Trust Badges */}
        {/* <div className="flex flex-wrap justify-center gap-8 pt-12 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            50,000+ Users
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            1M+ Drawings Created
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
            99.9% Uptime
          </div>
        </div> */}
      </div>

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
                  alt="Drawly Studio Whiteboard Interface"
                  height={100}
                  width={100}
                  className="w-full h-auto rounded-lg"
                  priority
                  unoptimized
                  quality={90}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20">
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

          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Shapes className="w-6 h-6" />}
              title="Rich Shapes"
              description="Rectangles, circles, arrows, diamonds, and text. Everything you need to express your ideas."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Real-Time Collaboration"
              description="Invite teammates and see their changes instantly. Perfect for brainstorming sessions."
            />
            <FeatureCard
              icon={<MessageSquare className="w-6 h-6" />}
              title="Integrated Chat"
              description="Discuss ideas while drawing. Real-time messaging built right into your workspace."
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6" />}
              title="Easy Sharing"
              description="Share boards with a link or export as images. Collaborate with anyone, anywhere."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6" />}
              title="Export Drawings"
              description="Export the whole canvas drawings as either JPG or PDF anytime."
            />
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Lightning Fast"
              description="Zero latency collaboration. Experience smooth, lag-free drawing and updates."
            />
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
      {/* <section className="py-20 bg-muted/30">
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
      </section> */}

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Perfect for Every Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Whether you're designing, teaching, planning, or brainstorming,
              Drawly Studio adapts to your needs.
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
      {/* <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Real feedback from teams using Drawly Studio every day
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
      </section> */}

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Drawly Studio
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
      {/* <section className="py-20 bg-muted/30">
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
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Start Creating?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of teams already using Drawly Studio to bring their
              ideas to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/rooms">
                <Button size="lg">
                  Create your first room
                  <ArrowRight className="ml-2 w-4 h-4" />
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
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Drawly Studio
                </h1>
              </div>
              <p className="text-muted-foreground my-4 max-w-md">
                The collaborative whiteboard platform designed for modern teams.
                Create, share, and collaborate visually.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="https://github.com/ManishThulung/excalidraw"
                  target="_blank"
                >
                  <Button variant="ghost" size="icon">
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
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
            <p>&copy; 2024 Drawly Studio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
