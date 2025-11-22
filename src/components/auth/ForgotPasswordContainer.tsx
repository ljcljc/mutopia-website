import { useState, useEffect } from "react";
import { VerificationCodeInput } from "./VerificationCodeInput";
import { ButtonMediumPrincipalOrange } from "./LoginModalUI";
import { sendPasswordResetCode, verifyPasswordResetCode } from "@/lib/api";
import { HttpError } from "@/lib/http";
import { toast } from "sonner";
import iconAlertError from "@/assets/icons/icon-alert-error.svg";
import iconAlertSuccess from "@/assets/icons/icon-alert-success.svg";

interface ForgotPasswordContainerProps {
  email: string;
  verificationCode: string[];
  setVerificationCode: (code: string[]) => void;
  onVerify: (resetToken: string) => void;
  onChangeEmail: () => void;
  onClose?: () => void;
  isLoading?: boolean;
  codeSendCount: number;
  codeVerifyFailCount: number;
  setCodeSendCount: (count: number) => void;
  setCodeVerifyFailCount: (count: number) => void;
}

export function ForgotPasswordContainer({
  email,
  verificationCode,
  setVerificationCode,
  onVerify,
  onChangeEmail,
  onClose,
  isLoading = false,
  codeSendCount,
  codeVerifyFailCount,
  setCodeSendCount,
  setCodeVerifyFailCount,
}: ForgotPasswordContainerProps) {
  // Initialize countdown to 60, but it will be reset when codeSendCount changes
  const [countdown, setCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeResent, setCodeResent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const MAX_SEND_COUNT = 5;
  const MAX_VERIFY_FAIL_COUNT = 5;

  // Initialize countdown when entering forgot password step
  // This ensures that when a new code is sent, the countdown starts from 60
  useEffect(() => {
    // When a new code is sent (codeSendCount > 0) and we're in a fresh state (no failed attempts),
    // always reset countdown to 60 to ensure proper initialization
    // This handles both:
    // 1. Component mount with codeSendCount already > 0 (e.g., returning from another step)
    // 2. codeSendCount changing from 0 to > 0 (e.g., new code sent)
    if (codeSendCount > 0 && codeVerifyFailCount === 0) {
      // Always reset countdown to 60 when entering forgot password step with a fresh code
      // This ensures the countdown starts from the beginning
      // Use a small delay to ensure state is properly initialized
      const timer = setTimeout(() => {
        setCountdown(60);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [codeSendCount, codeVerifyFailCount]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset countdown when code is resent and clear codeResent when countdown reaches 0
  useEffect(() => {
    if (codeResent) {
      setCountdown(60);
    }
  }, [codeResent]);

  // Clear codeResent state when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && codeResent) {
      setCodeResent(false);
    }
  }, [countdown, codeResent]);

  /**
   * 重新发送验证码
   * 重置失败计数，恢复可输入状态
   * 注意：在状态3（第4次失败后）时，允许立即重新发送，不受倒计时限制
   */
  const handleResendCode = async () => {
    // 检查是否达到最大发送次数
    if (codeSendCount >= MAX_SEND_COUNT) {
      return;
    }

    // 在状态3（第4次失败后）时，允许立即重新发送，不受倒计时限制
    // 其他状态下，需要等待倒计时结束
    const isLastAttemptWarning = codeVerifyFailCount === 4;
    if (!isLastAttemptWarning && countdown > 0) {
      return;
    }

    setIsResending(true);
    setError("");
    try {
      const response = await sendPasswordResetCode(email);
      // Use backend returned send_count instead of frontend calculation
      setCodeSendCount(response.send_count);
      // Reset verification fail count when resending code to restore input state
      setCodeVerifyFailCount(0);
      // Clear verification code
      setVerificationCode(["", "", "", "", "", ""]);
      // Clear any error messages
      setError("");
      // Set codeResent to true to show success state
      setCodeResent(true);
      // Reset countdown immediately
      setCountdown(60);
      toast.success("Verification code sent to your email.");
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err.message || "Failed to send verification code.");
      } else {
        setError("Failed to send verification code. Please try again.");
      }
      toast.error("Failed to send verification code.");
    } finally {
      setIsResending(false);
    }
  };

  /**
   * 提交验证码
   * 状态逻辑：
   * 1. 空验证码 → 显示 "Enter your code." 错误
   * 2. 验证失败1-3次 → 显示 "Wrong code. Try again" 错误
   * 3. 验证失败第4次 → 隐藏输入框，显示警告，显示 Resend code 大按钮
   * 4. 验证失败第5次 → 隐藏输入框，显示错误，显示 Contact 按钮
   */
  const handleSubmit = async () => {
    const codeString = verificationCode.join("");
    
    // 状态1: 检查验证码是否为空
    if (codeString.length !== 6) {
      setError("Enter your code.");
      return;
    }

    // 状态4: 检查是否已达到最大尝试次数
    if (codeVerifyFailCount >= MAX_VERIFY_FAIL_COUNT) {
      setError("For security reason. Please contact us to reset your password.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      const result = await verifyPasswordResetCode({
        email,
        code: codeString,
        purpose: "forgot_password",
      });

      if (!result.ok || !result.vs_token) {
        // 验证失败，增加失败计数
        const newFailCount = codeVerifyFailCount + 1;
        setCodeVerifyFailCount(newFailCount);
        
        // 状态2: 失败1-3次，显示普通错误
        if (newFailCount < 4) {
          setError("Wrong code. Try again");
        }
        // 状态3和4: 失败4次或5次，错误信息由UI状态控制显示
        // 不需要在这里设置错误，因为UI会根据 codeVerifyFailCount 显示相应的警告/错误框
        
        return;
      }

      // 验证成功 - 重置失败计数并继续
      setCodeVerifyFailCount(0);
      onVerify(result.vs_token);
    } catch (err) {
      // 验证失败，增加失败计数
      const newFailCount = codeVerifyFailCount + 1;
      setCodeVerifyFailCount(newFailCount);
      
      if (err instanceof HttpError) {
        // 状态2: 失败1-3次，显示错误信息
        if (newFailCount < 4) {
          setError(err.message || "Invalid verification code.");
        }
      } else {
        // 状态2: 失败1-3次，显示错误信息
        if (newFailCount < 4) {
          setError("Invalid verification code. Please try again.");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== 状态计算 ====================
  // 重要：验证码输入次数验证（codeVerifyFailCount）只在调用 Verify 接口失败后才会增加
  // - 首次进入 Forgot password 弹窗时，codeVerifyFailCount 为 0，应该显示正常的输入界面
  // - 只有当用户提交验证码（调用 Verify 接口）失败后，才会根据失败次数显示相应的状态
  // - 第4次失败后，才会显示警告和 Resend code 按钮
  // - 当用户点击 Resend code 时，会重置 codeVerifyFailCount 为 0，恢复输入状态
  
  const isMaxAttemptsReached = codeVerifyFailCount >= MAX_VERIFY_FAIL_COUNT;
  const isMaxSendReached = codeSendCount >= MAX_SEND_COUNT;
  
  // 状态3: 第4次验证失败后显示警告
  // 注意：这个状态只在用户调用 Verify 接口失败4次后才会出现
  const showLastAttemptWarning = codeVerifyFailCount === 4;
  
  // 验证码输入框显示条件：
  // - 验证失败次数 < 4
  // - 且未达到最大发送次数（如果达到最大发送次数，应该显示联系方式界面，而不是输入框）
  // 注意：当 isMaxSendReached && codeVerifyFailCount < 4 时，应该显示联系方式界面，不显示输入框
  const shouldShowCodeInput = codeVerifyFailCount < 4 && !isMaxSendReached;
  
  // 是否可以重新发送：倒计时结束 && 未达到最大发送次数 && 未达到最大验证失败次数
  const canResend = countdown === 0 && codeSendCount < MAX_SEND_COUNT && codeVerifyFailCount < MAX_VERIFY_FAIL_COUNT;
  
  // 是否显示倒计时：未显示警告 && 未达到最大失败次数 && 未达到最大发送次数
  // 注意：当 isMaxSendReached && codeVerifyFailCount < 4 时，应该显示联系方式界面，不显示倒计时
  const shouldShowCountdown = !showLastAttemptWarning && !isMaxAttemptsReached && !isMaxSendReached;

  return (
    <div className="box-border content-stretch flex flex-col gap-[28px] items-start px-[24px] py-0 relative shrink-0 w-full">
      <div className="relative shrink-0 w-full">
        <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[20px] items-center relative w-full">
          <div className="content-stretch flex flex-col gap-[32px] items-center relative shrink-0 w-full">
            <div className="content-stretch flex flex-col gap-[12px] items-center justify-center relative shrink-0 w-full">
              {/* Email label */}
              {(showLastAttemptWarning || isMaxAttemptsReached) ? (
                // 状态3和4: 显示 "Enter the 6-digital code sent to" 和邮箱地址，右侧显示 "Code expired."
                <div className="content-stretch flex font-['Comfortaa:Medium',sans-serif] font-medium gap-[8px] items-end relative shrink-0 w-full">
                  <div className="flex-[1_0_0] relative shrink-0">
                    <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[4px] items-start justify-end relative text-[#4a3c2a]">
                      <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px]">
                        Enter the<span>{` 6-digital code sent to`}</span>
                      </p>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px]">
                        {email}
                      </p>
                    </div>
                  </div>
                  <p className="leading-[17.5px] relative shrink-0 text-[12px] text-[rgba(0,0,0,0.8)]">
                    Code expired.
                  </p>
                </div>
              ) : (
                // 状态1和2: 显示 "Enter the 6-digital code sent to" 和邮箱地址
                <div className="content-stretch flex gap-[8px] items-end relative shrink-0 w-full">
                  <div className="relative shrink-0">
                    <div className="bg-clip-padding border-0 border-transparent border-solid box-border content-stretch flex flex-col gap-[4px] items-start justify-end relative text-[#4a3c2a]">
                      <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[12px]">
                        Enter the<span>{` 6-digital code sent to`}</span>
                      </p>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[14px]">
                        {email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Countdown or expired message */}
              {!showLastAttemptWarning && !isMaxAttemptsReached && !isMaxSendReached && (
                // 状态1和2: 显示倒计时或 "Code expired."
                // 注意：当 isMaxSendReached 为 true 时，不显示倒计时，而是显示联系方式界面
                <p className={`font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] min-w-full relative shrink-0 text-[12px] text-center w-min whitespace-pre-wrap ${
                  error && error.includes("Wrong code") ? "text-[#de1507]" : "text-[#de6a07]"
                }`}>
                  {shouldShowCountdown && countdown > 0 ? (
                    <>
                      <span>Expired in </span>
                      <span className="[text-underline-position:from-font] decoration-solid underline">
                        {countdown}
                      </span>
                      <span> secondes</span>
                    </>
                  ) : (
                    <span>Code expired.</span>
                  )}
                </p>
              )}

              {/* 状态1和2: 验证码输入框 */}
              {shouldShowCodeInput && (
                <>
                  <VerificationCodeInput
                    code={verificationCode}
                    onChange={setVerificationCode}
                    error={error && (error.includes("Wrong code") || error === "Enter your code.") ? error : undefined}
                  />

                  {/* 状态1和2: 错误消息 */}
                  {error && (error.includes("Wrong code") || error === "Enter your code.") && (
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <div className="relative shrink-0 size-[12px]">
                        <img src={iconAlertError} alt="Error" className="block size-full" />
                      </div>
                      <p className={`font-['Comfortaa:${error === "Enter your code." ? "Medium" : "Regular"}',sans-serif] ${
                        error === "Enter your code." ? "font-medium" : "font-normal"
                      } leading-[17.5px] relative shrink-0 text-[12px] text-[#de1507]`}>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* 状态1和2: Change email 和 Resend code 按钮 */}
                  <div className="box-border content-stretch flex items-start justify-between px-[20px] py-0 relative shrink-0 w-full">
                    <button
                      onClick={onChangeEmail}
                      className="box-border content-stretch flex gap-[8px] items-center px-[12px] py-[4px] relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity"
                      disabled={isLoading}
                    >
                      <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                        Change email
                      </p>
                    </button>
                    {codeResent ? (
                      <div className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0">
                        <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]">
                          <div className="flex-none rotate-90">
                            <div className="relative size-[12px]">
                              <img src={iconAlertSuccess} alt="Success" className="block size-full" />
                            </div>
                          </div>
                        </div>
                        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                          Code resent
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={handleResendCode}
                        disabled={!canResend || isResending || isLoading}
                        className="box-border content-stretch flex gap-[8px] items-center justify-center px-[12px] py-[4px] relative shrink-0 cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <p className="font-['Comfortaa:Medium',sans-serif] font-medium leading-[17.5px] relative shrink-0 text-[#4a3c2a] text-[12px]">
                          Resend code
                        </p>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* 状态3: 第4次失败后显示警告 */}
              {showLastAttemptWarning && !isMaxAttemptsReached && (
                <div className="bg-[#fffbed] border border-[#e8b600] border-solid h-[36px] relative rounded-[8px] shrink-0 w-full">
                  <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                      <div className="relative shrink-0 size-[12px]">
                        {/* Alert icon */}
                        <div className="absolute h-[16px] left-[-16.67%] right-[-16.67%] -top-px">
                          <div className="absolute bottom-1/4 left-[11.26%] right-[11.26%] top-[6.25%]">
                            <div className="bg-[#e8b600] w-full h-full" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                          </div>
                        </div>
                        <div className="absolute h-[7.82px] left-[5.5px] top-[2.18px] w-[1.23px] text-[#b08a00] text-[10px] font-bold">
                          !
                        </div>
                      </div>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#b08a00] text-[10px]">
                        1 attempt left. Verify your email adresse and resend code.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 状态4: 第5次失败后显示错误 */}
              {isMaxAttemptsReached && (
                <div className="border border-[#de1507] border-solid h-[36px] relative rounded-[8px] shrink-0 w-full">
                  <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                      <div className="relative shrink-0 size-[12px]">
                        <img src={iconAlertError} alt="Error" className="block size-full" />
                      </div>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#de1507] text-[10px]">
                        For security reason. Please contact us to reset your password.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 最大发送次数 reached 且验证失败次数 < 4: 显示联系方式界面 */}
              {isMaxSendReached && codeVerifyFailCount < 4 && (
                <div className="border border-[#de1507] border-solid h-[36px] relative rounded-[8px] shrink-0 w-full">
                  <div className="box-border content-stretch flex h-[36px] items-center overflow-clip px-[16px] py-[4px] relative rounded-[inherit]">
                    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                      <div className="relative shrink-0 size-[12px]">
                        <img src={iconAlertError} alt="Error" className="block size-full" />
                      </div>
                      <p className="font-['Comfortaa:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#de1507] text-[10px]">
                        For security reason. Please contact us to reset your password.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 状态3: 第4次失败后显示 Resend code 大按钮 */}
              {showLastAttemptWarning && !isMaxAttemptsReached && !isMaxSendReached && (
                <ButtonMediumPrincipalOrange
                  onClick={handleResendCode}
                  disabled={isResending || isLoading}
                  isLoading={isResending}
                  text="Resend code"
                />
              )}

              {/* 最大发送次数 reached - 不显示 Resend code 按钮，而是显示 Contact 按钮 */}
              {/* Resend code 按钮已移除，因为达到最大发送次数时应该显示 Contact 按钮 */}
            </div>

            {/* 状态1和2: Submit 按钮 */}
            {/* 注意：当 isMaxSendReached 为 true 时，不显示 Submit 按钮，而是显示 Contact 按钮 */}
            {shouldShowCodeInput && !isMaxAttemptsReached && !isMaxSendReached && (
              <ButtonMediumPrincipalOrange
                onClick={handleSubmit}
                disabled={isLoading || isSubmitting}
                isLoading={isLoading || isSubmitting}
                text="Submit"
              />
            )}

            {/* 状态4和最大发送次数: Contact 按钮 */}
            {(isMaxAttemptsReached || (isMaxSendReached && codeVerifyFailCount < 4)) && (
              <ButtonMediumPrincipalOrange
                onClick={() => {
                  // Close modal first
                  if (onClose) {
                    onClose();
                  }
                  
                  // Scroll to contact section after a short delay to ensure modal is closed
                  setTimeout(() => {
                    const scrollToAnchor = (href: string) => {
                      const targetId = href.replace("#", "");
                      const targetElement = document.getElementById(targetId);

                      if (targetElement) {
                        // Use different offset for mobile vs desktop
                        // Mobile: 100px (header + extra padding), Desktop: 80px
                        const isMobile = window.innerWidth < 1024; // lg breakpoint
                        const headerOffset = isMobile ? 100 : 80;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.scrollY - headerOffset;

                        window.scrollTo({
                          top: offsetPosition,
                          behavior: "smooth",
                        });
                      }
                    };
                    
                    scrollToAnchor("#contact");
                  }, 100);
                }}
                disabled={isLoading}
                text="Contact"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
