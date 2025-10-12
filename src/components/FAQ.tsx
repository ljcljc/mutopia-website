import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "How does mobile grooming work?",
      answer: "Our professional groomers come directly to your home with a fully equipped mobile grooming van. We bring everything needed including water, electricity, and all grooming supplies. Your pet gets pampered in the comfort of your driveway while you relax at home."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking at least 1-2 weeks in advance, especially during busy seasons. However, we often have same-day or next-day availability. Premium and Luxury members get priority booking privileges."
    },
    {
      question: "What if my pet is anxious or aggressive?",
      answer: "Our groomers are trained to handle pets with various temperaments. We use gentle, stress-reducing techniques and can work with anxious pets at their pace. For aggressive pets, we may recommend a consultation first to develop the best approach."
    },
    {
      question: "Are your groomers insured and bonded?",
      answer: "Yes, all our groomers are fully licensed, insured, and bonded. They've also undergone background checks and extensive training in pet safety and behavior. Your pet's safety and your peace of mind are our top priorities."
    },
    {
      question: "What breeds do you service?",
      answer: "We service all dog breeds and sizes, from tiny Chihuahuas to giant Great Danes. We also groom cats, though we recommend mentioning this when booking as some groomers specialize in feline care. Each groomer has experience with breed-specific cuts and requirements."
    },
    {
      question: "What's included in a full grooming service?",
      answer: "Our full grooming includes bath with premium shampoo, blow dry, haircut/styling, nail trimming, ear cleaning, teeth brushing, sanitary trimming, and a finishing spritz. We'll also do a basic health check and let you know if we notice anything unusual."
    },
    {
      question: "Do you provide your own water and electricity?",
      answer: "Yes! Our mobile grooming vans are completely self-contained with their own water tanks, water heaters, and generators. We don't need to use your water or electricity. We just need a spot in your driveway or nearby parking."
    },
    {
      question: "What happens if I need to cancel or reschedule?",
      answer: "We understand that plans change! You can cancel or reschedule up to 24 hours before your appointment without any fees. Cancellations with less than 24 hours notice may incur a small fee, though we're always flexible for emergencies."
    },
    {
      question: "How do I become a groomer with Mutopia?",
      answer: "We're always looking for talented, passionate groomers to join our team! Click the 'Apply to Groomer' button in our header to learn about requirements, training, and benefits. We provide ongoing education, equipment, and marketing support."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, PayPal, and Apple Pay. Payment is processed through our secure app after the service is complete. Membership packages can be set up for automatic monthly billing for your convenience."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-br from-white to-accent relative overflow-hidden">
      {/* Curved background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-foreground/70">
            Everything you need to know about our services and how we care for your pets.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border border-gray-200 rounded-3xl px-6 hover:border-primary/50 transition-colors bg-white/80 backdrop-blur-sm"
            >
              <AccordionTrigger className="text-left py-6 hover:no-underline">
                <span className="font-medium text-foreground pr-4">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-foreground/70 leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Contact CTA */}
        <div className="text-center mt-16 p-8 bg-accent rounded-3xl border-2 border-primary/10">
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Still have questions?
          </h3>
          <p className="text-foreground/70 mb-6">
            Our friendly customer service team is here to help you and your pet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:hello@mutopia.ca" 
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary rounded-full hover:bg-primary/10 transition-colors"
            >
              Contact us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}