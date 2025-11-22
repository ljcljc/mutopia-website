import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitFeedback } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import { z } from "zod";
import { emailSchema } from "@/components/auth/authSchemas";

// Feedback form validation schema
const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100, "Name is too long."),
  email: emailSchema,
  message: z
    .string()
    .min(1, "Message is required.")
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message is too long."),
});

export default function Contact() {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Error state
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError("");
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (messageError) setMessageError("");
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      feedbackSchema.parse({ name, email, message });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          const message = issue.message;
          if (field === "name") setNameError(message);
          else if (field === "email") setEmailError(message);
          else if (field === "message") setMessageError(message);
        });
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setNameError("");
    setEmailError("");
    setMessageError("");

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFeedback({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });

      // Success
      toast.success("Thank you! Your message has been sent successfully.");
      
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      let errorMessage = "Failed to send message. Please try again.";

      if (err instanceof HttpError) {
        if (err.status === 400) {
          errorMessage = err.message || "Invalid form data. Please check your input.";
        } else if (err.status >= 400 && err.status < 500) {
          errorMessage = err.message || "Invalid request. Please try again.";
        } else {
          errorMessage = err.message || "Server error. Please try again later.";
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="contact"
      className="bg-gradient-to-b from-[rgba(255,231,210,0.40)] to-[rgba(255,231,210,0.60)] w-full flex flex-col items-center pt-[32px] pb-0"
    >
      <div className="content-start flex flex-wrap gap-0 items-start justify-center w-full max-w-[729px]">
      <div className="basis-0 bg-[#633479] grow min-h-px min-w-px rounded-tl-none rounded-tr-none md:rounded-tl-[40px] md:rounded-tr-[40px]">
        <div className="flex flex-col items-center size-full">
          <div className="box-border content-stretch flex flex-col gap-[28px] items-center px-[28px] md:px-[80px] py-[36px] w-full">
            {/* Form Header and Fields - Combined */}
            <div className="content-stretch flex flex-col gap-[12px] items-center w-full">
              <p className="font-['Comfortaa:Bold',_sans-serif] leading-[normal] text-[24px] text-center text-white">
                Contact us for more details
              </p>
              <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[22.75px] text-[14px] text-[rgba(255,255,255,0.9)] text-center">
                Our friendly customer service team is here to help you and
                your pet.
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
                  value={name}
                  onChange={handleNameChange}
                  disabled={isSubmitting}
                  className={`bg-white h-[36px] rounded-[12px] border w-full px-[16px] py-[4px] font-['Comfortaa:Regular',_sans-serif] font-normal text-[12.25px] placeholder:text-[#717182] ${
                    nameError
                      ? "border-[#de1507] focus:border-[#de1507] focus:ring-[#de1507]"
                      : "border-gray-200"
                  }`}
                />
                {nameError && (
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[#de1507] text-[12px]">
                    {nameError}
                  </p>
                )}
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
                  value={email}
                  onChange={handleEmailChange}
                  disabled={isSubmitting}
                  className={`bg-white h-[36px] rounded-[12px] border w-full px-[16px] py-[4px] font-['Comfortaa:Regular',_sans-serif] font-normal text-[12.25px] placeholder:text-[#717182] ${
                    emailError
                      ? "border-[#de1507] focus:border-[#de1507] focus:ring-[#de1507]"
                      : "border-gray-200"
                  }`}
                />
                {emailError && (
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[#de1507] text-[12px]">
                    {emailError}
                  </p>
                )}
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
                  value={message}
                  onChange={handleMessageChange}
                  disabled={isSubmitting}
                  className={`bg-white h-[120px] max-h-[120px] rounded-[12px] border w-full px-[16px] py-[12px] font-['Comfortaa:Regular',_sans-serif] font-normal text-[12.25px] placeholder:text-[#717182] resize-none ${
                    messageError
                      ? "border-[#de1507] focus:border-[#de1507] focus:ring-[#de1507]"
                      : "border-gray-200"
                  }`}
                />
                {messageError && (
                  <p className="font-['Comfortaa:Regular',_sans-serif] font-normal leading-[17.5px] text-[#de1507] text-[12px]">
                    {messageError}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button - 适配紫色背景的设计 */}
            <form onSubmit={handleSubmit} className="w-full flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting || !name || !email || !message}
                className={`
                  relative rounded-[32px] transition-all duration-200 cursor-pointer group
                  h-[36px] 
                  px-[28px] py-[16px] focus-visible:px-[30px] focus-visible:py-[18px]
                  bg-white hover:bg-[rgba(255,255,255,0.9)] focus-visible:bg-white
                  border-2 border-white hover:border-white focus-visible:border-[#2374ff]
                  text-[#633479] hover:text-[#633479] focus-visible:text-[#633479]
                  shadow-sm hover:shadow-md focus-visible:shadow-md
                  w-[209px]
                  flex gap-[8px] items-center justify-center
                  ${isSubmitting || !name || !email || !message ? "opacity-60 cursor-not-allowed" : ""}
                `}
              >
                {isSubmitting ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="size-4 border-2 border-[#633479] border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : null}
                <p className={`
                  font-['Comfortaa:Bold',_sans-serif] font-bold leading-[20px] text-[14px] relative shrink-0 text-[#633479]
                  ${isSubmitting ? "invisible" : ""}
                `}>
                  Submit
                </p>
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

