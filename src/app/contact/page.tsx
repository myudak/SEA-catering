"use client";

import React from "react";
// import { supabase } from '@/lib/supabase';
// import { useAuth } from '@/contexts/AuthContext';
// import { sanitizeInput } from '@/lib/auth';
import {
  ContactDetails,
  HeaderSection,
  TestimonialForm,
  TestimonialSection,
} from "./_components";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
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
