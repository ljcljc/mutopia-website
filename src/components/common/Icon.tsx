/**
 * SVG 图标组件 - 方案一：SVG 作为 React 组件（推荐）
 * 
 * 使用方式：
 * 1. 使用 Icon 组件（推荐，支持颜色和大小控制）
 * 2. 直接导入 SVG 作为 URL（兼容旧代码）
 * 
 * 示例：
 * ```tsx
 * // 方式1: 使用 Icon 组件（推荐）
 * <Icon name="nav-prev" size={16} className="text-[#8b6357]" />
 * 
 * // 方式2: 直接导入 SVG 组件（特殊场景）
 * import IconNavPrev from "@/assets/icons/icon-nav-prev.svg?react";
 * <IconNavPrev className="w-4 h-4 text-[#8b6357]" />
 * 
 * // 方式3: 直接导入 URL（兼容旧代码）
 * import iconNavPrev from "@/assets/icons/icon-nav-prev.svg";
 * <img src={iconNavPrev} alt="Previous" />
 * ```
 */

import { ComponentProps, forwardRef } from "react";
import { cn } from "@/components/ui/utils";

// 导入 SVG 作为 React 组件（使用 ?react 后缀）
import IconNavPrevSvg from "@/assets/icons/icon-nav-prev.svg?react";
import IconNavNextSvg from "@/assets/icons/icon-nav-next.svg?react";
import IconLocationSvg from "@/assets/icons/icon-location.svg?react";
import IconUserSvg from "@/assets/icons/icon-user.svg?react";
import IconNotifySvg from "@/assets/icons/icon-notify.svg?react";
import IconChevronDownSvg from "@/assets/icons/icon-chevron-down.svg?react";
import IconMenuSvg from "@/assets/icons/icon-menu.svg?react";
import IconEmailSvg from "@/assets/icons/icon-email.svg?react";
import IconCalendarSvg from "@/assets/icons/icon-calendar.svg?react";
import IconAlertErrorSvg from "@/assets/icons/icon-alert-error.svg?react";
import IconAlertSuccessSvg from "@/assets/icons/icon-alert-success.svg?react";
import IconAlertWarningSvg from "@/assets/icons/icon-alert-warning.svg?react";
import IconAlertInfoSvg from "@/assets/icons/icon-alert-info.svg?react";
import IconEyeVisibleSvg from "@/assets/icons/icon-eye-visible.svg?react";
import IconEyeInvisibleSvg from "@/assets/icons/icon-eye-invisible.svg?react";
import IconFacebookSvg from "@/assets/icons/icon-facebook.svg?react";
import IconFacebookAltSvg from "@/assets/icons/icon-facebook-alt.svg?react";
import IconInstagramSvg from "@/assets/icons/icon-instagram.svg?react";
import IconTwitterSvg from "@/assets/icons/icon-twitter.svg?react";
import IconGoogleSvg from "@/assets/icons/icon-google.svg?react";
import IconFooterLogoSvg from "@/assets/icons/icon-footer-logo.svg?react";
import IconEasyBookingSvg from "@/assets/icons/icon-easy-booking.svg?react";
import IconPetFriendlySvg from "@/assets/icons/icon-pet-friendly.svg?react";
import IconProfessionalServiceSvg from "@/assets/icons/icon-professional-service.svg?react";
import IconClockSvg from "@/assets/icons/icon-clock.svg?react";
import IconBathBrushSvg from "@/assets/icons/icon-bath-brush.svg?react";
import IconFullGroomingSvg from "@/assets/icons/icon-full-grooming.svg?react";
import IconExpressGroomSvg from "@/assets/icons/icon-express-groom.svg?react";
import IconButtonArrowSvg from "@/assets/icons/icon-button-arrow.svg?react";
import IconCertifiedProfessionalsSvg from "@/assets/icons/icon-certified-professionals.svg?react";
import IconConvenientSchedulingSvg from "@/assets/icons/icon-convenient-scheduling.svg?react";
import IconPersonalizedCareSvg from "@/assets/icons/icon-personalized-care.svg?react";
import IconPremiumQualitySvg from "@/assets/icons/icon-premium-quality.svg?react";
import IconStressFreeExperienceSvg from "@/assets/icons/icon-stress-free-experience.svg?react";
import IconRealTimeUpdatesSvg from "@/assets/icons/icon-real-time-updates.svg?react";
import IconCloseArrowSvg from "@/assets/icons/icon-close-arrow.svg?react";
import IconVanSvg from "@/assets/icons/icon-van.svg?react";
import IconShopSvg from "@/assets/icons/icon-shop.svg?react";
import IconDogSvg from "@/assets/icons/icon-dog.svg?react";
import IconCatSvg from "@/assets/icons/icon-cat.svg?react";
import IconPetSvg from "@/assets/icons/icon-pet.svg?react";
import IconSearchSvg from "@/assets/icons/icon-search.svg?react";
import IconImageSvg from "@/assets/icons/icon-image.svg?react";
import IconAddSvg from "@/assets/icons/icon-add.svg?react";
import IconTrashSvg from "@/assets/icons/icon-trash.svg?react";
import IconCheckSvg from "@/assets/icons/icon-check.svg?react";
import IconZoomOutSvg from "@/assets/icons/icon-zoom-out.svg?react";
import IconZoomInSvg from "@/assets/icons/icon-zoom-in.svg?react";

// 图标组件映射表
const iconComponentMap = {
  "nav-prev": IconNavPrevSvg,
  "nav-next": IconNavNextSvg,
  "location": IconLocationSvg,
  "user": IconUserSvg,
  "notify": IconNotifySvg,
  "chevron-down": IconChevronDownSvg,
  "menu": IconMenuSvg,
  "email": IconEmailSvg,
  "calendar": IconCalendarSvg,
  "alert-error": IconAlertErrorSvg,
  "alert-success": IconAlertSuccessSvg,
  "alert-warning": IconAlertWarningSvg,
  "alert-info": IconAlertInfoSvg,
  "eye-visible": IconEyeVisibleSvg,
  "eye-invisible": IconEyeInvisibleSvg,
  "facebook": IconFacebookSvg,
  "facebook-alt": IconFacebookAltSvg,
  "instagram": IconInstagramSvg,
  "twitter": IconTwitterSvg,
  "google": IconGoogleSvg,
  "footer-logo": IconFooterLogoSvg,
  "easy-booking": IconEasyBookingSvg,
  "pet-friendly": IconPetFriendlySvg,
  "professional-service": IconProfessionalServiceSvg,
  "clock": IconClockSvg,
  "bath-brush": IconBathBrushSvg,
  "full-grooming": IconFullGroomingSvg,
  "express-groom": IconExpressGroomSvg,
  "button-arrow": IconButtonArrowSvg,
  "certified-professionals": IconCertifiedProfessionalsSvg,
  "convenient-scheduling": IconConvenientSchedulingSvg,
  "personalized-care": IconPersonalizedCareSvg,
  "premium-quality": IconPremiumQualitySvg,
  "stress-free-experience": IconStressFreeExperienceSvg,
  "real-time-updates": IconRealTimeUpdatesSvg,
  "close-arrow": IconCloseArrowSvg,
  "van": IconVanSvg,
  "shop": IconShopSvg,
  "dog": IconDogSvg,
  "cat": IconCatSvg,
  "pet": IconPetSvg,
  "search": IconSearchSvg,
  "image": IconImageSvg,
  "add": IconAddSvg,
  "trash": IconTrashSvg,
  "check": IconCheckSvg,
  "zoom-out": IconZoomOutSvg,
  "zoom-in": IconZoomInSvg,
} as const;

export type IconName = keyof typeof iconComponentMap;

export interface IconProps extends Omit<ComponentProps<"svg">, "name"> {
  name: IconName;
  size?: number | string;
  /**
   * 使用方式：
   * - "svg": 使用内联 SVG（默认，推荐，支持颜色控制）
   * - "img": 使用 <img> 标签（兼容旧代码）
   */
  as?: "svg" | "img";
  /**
   * 可访问性：图标的描述（用于 aria-label）
   */
  "aria-label"?: string;
}

/**
 * Icon 组件
 * 
 * 提供统一的图标使用接口，支持：
 * - 类型安全的图标名称
 * - 统一的大小控制
 * - 通过 className 控制样式（颜色、hover 等）
 * - SVG 内联，支持 currentColor
 * 
 * @example
 * ```tsx
 * // 基础使用
 * <Icon name="location" size={20} />
 * 
 * // 带颜色控制（推荐）
 * <Icon name="user" size={24} className="text-[#8b6357] hover:text-[#de6a07]" />
 * 
 * // 响应式大小
 * <Icon name="notify" className="w-4 h-4 md:w-6 md:h-6" />
 * 
 * // 使用 currentColor（SVG 会自动使用当前文本颜色）
 * <Icon name="nav-prev" className="text-[#8b6357]" />
 * ```
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, size, className, as = "svg", ...props }, ref) => {
    const IconComponent = iconComponentMap[name];

    if (!IconComponent) {
      console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconComponentMap));
      return null;
    }

    // 检查 IconComponent 是否是有效的 React 组件
    if (typeof IconComponent !== "function" && typeof IconComponent !== "object") {
      console.error(`Icon "${name}" is not a valid React component. It appears to be:`, typeof IconComponent, IconComponent);
      return null;
    }

    // 使用 SVG 组件方式（推荐，支持颜色控制）
    if (as === "svg") {
      const sizeStyle = size
        ? typeof size === "number"
          ? { width: size, height: size }
          : { width: size, height: size }
        : {};

      // 确保 IconComponent 是 React 组件
      if (typeof IconComponent === "function" || (typeof IconComponent === "object" && "$$typeof" in IconComponent)) {
        return (
          <IconComponent
            ref={ref}
            className={cn("inline-block shrink-0", className)}
            style={sizeStyle}
            {...props}
          />
        );
      } else {
        console.error(`Icon "${name}" is not a valid React component.`);
        return null;
      }
    }

    // 兼容旧代码：使用 <img> 方式
    // 注意：需要导入 URL 版本
    console.warn(
      `Icon "${name}" used with as="img". Consider using as="svg" for better color control.`
    );
    return null;
  }
);

Icon.displayName = "Icon";

/**
 * 获取所有可用的图标名称
 */
export const getAvailableIcons = (): IconName[] => {
  return Object.keys(iconComponentMap) as IconName[];
};
