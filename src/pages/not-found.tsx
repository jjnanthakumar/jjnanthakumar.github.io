import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";

const NotFound = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      // This would typically redirect to search results
      // For now, we'll just clear the input
      setSearchQuery("");
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const numberVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-10 w-60 h-60 rounded-full bg-primary/10 blur-3xl"></div>
        <div className="absolute top-2/3 left-1/4 w-20 h-20 rounded-full bg-secondary/10 blur-2xl"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="relative z-10 container max-w-6xl px-4 py-16 mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div
          className="flex-1 text-center lg:text-left max-w-lg"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div
            className="inline-block bg-primary/10 text-primary font-medium px-4 py-1.5 rounded-full mb-4"
            variants={itemVariants}
          >
            404 Error
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight"
            variants={itemVariants}
          >
            Oops! Page not found
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-lg mb-8"
            variants={itemVariants}
          >
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </motion.p>

          {/* <motion.form
            onSubmit={handleSearch}
            className="relative mb-6"
            variants={itemVariants}
          >
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                {isSearching ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Search size={18} />
                )}
              </div>
              <input
                type="text"
                placeholder="Search for content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                disabled={isSearching}
              />
            </div>
          </motion.form> */}

          <motion.div
            className="flex flex-wrap gap-3 justify-center lg:justify-start"
            variants={itemVariants}
          >
            <Button asChild size="lg" className="rounded-full">
              <Link to="/" className="flex items-center gap-2">
                <Home size={16} />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full"
            >
              <Link to="/contact" className="flex items-center gap-2">
                Contact Support
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center items-center"
          initial="initial"
          animate="animate"
          variants={numberVariants}
        >
          <div className="relative">
            {/* Large 404 */}
            <div className="text-[180px] md:text-[250px] font-bold text-primary/10 dark:text-primary/30 leading-none select-none">
              404
            </div>

            {/* Overlay elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center">
              <motion.div
                className="w-32 h-32 md:w-44 md:h-44 mt-2 md:mt-3 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10"
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            </div>

            <motion.div
              className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm"
              animate={{
                y: [0, -10, 0],
                x: [0, 5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />

            <motion.div
              className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-secondary/20 backdrop-blur-sm"
              animate={{
                y: [0, 10, 0],
                x: [0, -5, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Quick links */}
      <motion.div
        className="relative z-10 w-full max-w-2xl mx-auto px-4 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="bg-background/50 backdrop-blur-sm border border-primary/30 dark:border-primary/50 rounded-xl p-6">
          <h3 className="text-lg font-medium mb-4">Popular Pages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { title: "Blog", path: "/blog" },
              { title: "Projects", path: "/projects" },
              // { title: "Services", path: "/services" },
              { title: "About", path: "/about" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 rounded-lg bg-background/80 hover:bg-primary/10 border border-border text-center transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
