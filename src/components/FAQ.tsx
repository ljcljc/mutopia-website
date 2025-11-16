import CustomAccordion from "./CustomAccordion";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { PurpleButton } from "./PurpleButton";
import { Label } from "./ui/label";
import svgPaths from "@/assets/icons/svg-68mxca64pe";

export default function FAQ() {
  const faqs = [
    {
      question: "How does mobile grooming work?",
      answer:
        "Our mobile grooming service brings professional pet grooming directly to your doorstep. We arrive in our fully-equipped grooming van, complete with all the tools and products needed to pamper your pet. Your pet receives one-on-one attention in a stress-free environment without the hassle of travel.",
    },
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking at least 1-2 weeks in advance to secure your preferred time slot. However, we often have same-day or next-day availability depending on your location and our groomer's schedule. Premium members get priority booking access.",
    },
    {
      question: "What if my pet is anxious or aggressive?",
      answer:
        "Our experienced groomers are trained to handle pets with various temperaments. We use calming techniques and take extra time to ensure your pet feels comfortable. For severely anxious or aggressive pets, we may recommend a consultation first or suggest specialized handling techniques.",
    },
    {
      question: "Are your groomers insured and bonded?",
      answer:
        "Yes, all our professional groomers are fully insured and bonded. We carry comprehensive liability insurance to protect both your pet and your property. Our groomers also undergo rigorous background checks and professional training certification.",
    },
    {
      question: "What breeds do you service?",
      answer:
        "We service all dog and cat breeds, from tiny Chihuahuas to large Great Danes. Our groomers are experienced with breed-specific cuts and styling requirements. We also accommodate pets with special needs or medical conditions with advance notice.",
    },
    {
      question: "What's included in a full grooming service?",
      answer:
        "Our full grooming service includes a premium bath with conditioning treatment, complete haircut and styling, nail trimming and filing, ear cleaning, teeth brushing, sanitary trim, and anal gland expression (if needed). We finish with a spritz of pet-safe cologne.",
    },
    {
      question:
        "Do you provide your own water and electricity?",
      answer:
        "Yes! Our mobile grooming vans are completely self-contained with their own water supply, heating system, and electrical generator. We don't need to use any of your utilities. However, we may occasionally request access to an outdoor outlet for extended appointments.",
    },
    {
      question:
        "What happens if I need to cancel or reschedule?",
      answer:
        "We understand plans change! You can cancel or reschedule up to 24 hours before your appointment without any fees. Cancellations with less than 24 hours notice may incur a $25 fee. Premium members receive more flexible cancellation terms.",
    },
    {
      question: "How do I become a groomer with Mutopia?",
      answer:
        "We're always looking for talented, certified pet groomers to join our team! Visit our careers page to learn about current opportunities. Requirements include professional grooming certification, 2+ years of experience, valid driver's license, and a passion for animal care.",
    },
  ];

  return (
    <div
      id="faq"
      className="bg-gradient-to-b from-[#FFF] to-[rgba(255,231,210,0.40)] w-full pt-[60px] pb-0"
      data-name="FAQ"
    >
      <div className="flex flex-col items-center w-full">
        <div className="content-stretch flex flex-col gap-[60px] md:gap-[32px] items-center w-full md:px-[28px]">
          {/* FAQ Section */}
          <div className="box-border content-stretch flex flex-col gap-[20px] md:gap-[56px] items-center px-[28px] md:px-0 w-full max-w-[784px]">
            {/* Title Section */}
            <div className="content-stretch flex flex-col gap-[16px] items-center text-center w-full">
              {/* Heading */}
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[40px] text-[#4a3c2a] text-[32px] text-center">
                Frequently Asked Questions
              </p>
              {/* Paragraph */}
              <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[28px] text-[16px] text-[rgba(74,60,42,0.7)] max-w-[265px] md:max-w-none text-center">
                Everything you need to know about our services
                and how we care for your pets.
              </p>
            </div>

            {/* Search Input - Mobile Only */}
            <div className="md:hidden bg-white h-[36px] relative rounded-[8px] w-full max-w-[348px] mx-auto">
              <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit] w-full">
                <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0">
                  <div className="relative shrink-0 size-[20px]">
                    <svg
                      className="block size-full"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <g>
                        <path
                          d={svgPaths.p1bff4f80}
                          stroke="#6B6B6B"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </g>
                    </svg>
                  </div>
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[normal] relative shrink-0 text-[#717182] text-[12.25px]">
                    Type to search
                  </p>
                </div>
                <div className="h-[6.375px] relative shrink-0 w-[11.25px]">
                  <svg
                    className="block size-full"
                    fill="none"
                    viewBox="0 0 12 7"
                  >
                    <path
                      clipRule="evenodd"
                      d={svgPaths.p18f01300}
                      fill="#111113"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute border border-gray-200 border-solid inset-0 pointer-events-none rounded-[8px]"
              />
            </div>

            {/* Accordion List */}
            <CustomAccordion items={faqs} />
          </div>

          {/* Contact Form */}
          <div
            id="contact"
            className="content-start flex flex-wrap gap-0 items-start justify-center w-full md:max-w-[784px]"
          >
            <div className="basis-0 bg-[#633479] grow min-h-px min-w-px rounded-tl-none rounded-tr-none md:rounded-tl-[40px] md:rounded-tr-[40px]">
              <div className="flex flex-col items-center size-full">
                <div className="box-border content-stretch flex flex-col gap-[28px] items-center px-[28px] md:px-[80px] py-[36px] w-full">
                  {/* Form Header and Fields - Combined */}
                  <div className="content-stretch flex flex-col gap-[12px] items-center w-full">
                    <p className="font-['Comfortaa:Bold',_sans-serif] leading-[normal] text-[24px] text-center text-white">
                      Contact us for more details
                    </p>
                    <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(255,255,255,0.9)] text-center">
                      Our friendly customer service team is here
                      to help you and your pet.
                    </p>

                    {/* Name Input */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start w-full max-w-[348px]">
                      <Label
                        htmlFor="name"
                        className="content-stretch flex gap-[7px] h-[12.25px] items-center w-full font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px]"
                        style={{
                          background:
                            "var(--Background-light, linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%))",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        className="bg-white h-[36px] rounded-[12px] border border-gray-200 w-full px-[16px] py-[4px] font-['Comfortaa:Regular',_sans-serif] font-normal text-[12.25px] placeholder:text-[#717182]"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start w-full max-w-[348px]">
                      <Label
                        htmlFor="email"
                        className="content-stretch flex gap-[7px] h-[12.25px] items-center w-full font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px]"
                        style={{
                          background:
                            "var(--Background-light, linear-gradient(135deg, #FFF7ED 0%, #FFFBEB 100%))",
                          backgroundClip: "text",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="bg-white h-[36px] rounded-[12px] border border-gray-200 w-full px-[16px] py-[4px] font-['Comfortaa:Regular',_sans-serif] font-normal text-[12.25px] placeholder:text-[#717182]"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="content-stretch flex flex-col gap-[8px] items-start w-full max-w-[349px]">
                      <Label
                        htmlFor="message"
                        className="content-stretch flex gap-[7px] h-[12.25px] items-center w-full font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-white"
                      >
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your message"
                        className="bg-white h-[120px] max-h-[120px] rounded-[12px] border border-gray-200 w-full px-[16px] py-[12px] font-['Comfortaa:Regular',_sans-serif] font-normal text-[12.25px] placeholder:text-[#717182] resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <PurpleButton
                    variant="bordered"
                    size="medium"
                    className="w-[209px]"
                  >
                    <p className="font-['Comfortaa:Bold',_sans-serif] leading-[20px] text-[14px]">
                      Submit
                    </p>
                  </PurpleButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}