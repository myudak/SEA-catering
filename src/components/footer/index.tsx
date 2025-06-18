import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#dfd9ca] dark:bg-muted py-12 px-6 border-t border-neutral-300 dark:border-neutral-700">
      <div className="max-w-6xl mx-auto text-center space-y-4">
        <h3 className="text-2xl font-semibold text-foreground tracking-tight">
          SEA Catering
        </h3>
        <p className="text-muted-foreground text-base italic">
          “Healthy Meals, Anytime, Anywhere”
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} SEA Catering · Serving health & happiness
          across Indonesia
        </p>
      </div>
    </footer>
  );
};

export default Footer;
