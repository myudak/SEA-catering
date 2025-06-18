import { ContactCard } from "./ContactCard";

export function ContactSection() {
  return (
    <section className="py-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
            Get in Touch with SEA Catering
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Got questions or ready to order? Our team is here to help you start
            your healthy food journey.
          </p>
        </div>

        <ContactCard manager="Brian" phone="0812-3456-7890" />
      </div>
    </section>
  );
}
