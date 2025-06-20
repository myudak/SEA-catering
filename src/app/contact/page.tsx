"use client";

import React from "react";
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/contexts/AuthContext';
// import { sanitizeInput } from '@/lib/auth';
import { ContactDetails, HeaderSection, TestimonialForm } from "./_components";
import { TestimonialSection } from "@/components/testimonial-section";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <HeaderSection />

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            <ContactDetails />

            <TestimonialForm />
          </div>
        </div>
      </section>

      <TestimonialSection />
    </div>
  );
};

export default ContactPage;
