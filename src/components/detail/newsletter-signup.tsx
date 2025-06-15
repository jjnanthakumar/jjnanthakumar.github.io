
import React from "react";
import { Button } from "@/components/ui/button";

const NewsletterSignup = () => {
  return (
    <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
      <h3 className="font-medium mb-3">Newsletter</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Subscribe to get notified about new articles and updates.
      </p>
      <form className="space-y-2">
        <input
          type="email"
          placeholder="Your email address"
          className="w-full px-3 py-2 text-sm rounded-lg border border-border/50 bg-background focus:outline-none focus:ring-1 focus:ring-primary/30"
        />
        <Button type="submit" className="w-full rounded-lg">
          Subscribe
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
