// API utility functions
import { http, setAuthToken, setRefreshToken, clearAuthTokens } from "./http";
import { getEncryptedItem } from "./encryption";
import { STORAGE_KEYS } from "./storageKeys";

// ==================== 类型定义 ====================

// 认证相关类型
export interface EmailCheckIn {
  email: string;
}

export interface EmailCheckOut {
  exists: boolean;
}

export interface SendCodeIn {
  email: string;
  purpose?: string; // default: "register"
}

export interface SendCodeOut {
  ok: boolean;
}

export interface CodeVerifyIn {
  email: string;
  code: string;
  purpose: string;
}

export interface CodeVerifyOut {
  ok: boolean;
  vs_token?: string | null;
}

export interface LoginPasswordCheckIn {
  email: string;
  password: string;
}

export interface LoginPasswordCheckOut {
  ok: boolean;
  detail?: string | null;
}

export interface LoginConfirmIn {
  email: string;
  password: string;
  code: string;
}

// Deprecated: Use LoginConfirmIn instead
export interface LoginIn {
  email: string;
  password: string;
}

export interface TokenOut {
  access: string;
  refresh: string;
}

export interface RefreshIn {
  refresh: string;
}

export interface RegisterCompleteIn {
  email: string;
  code: string;
  first_name: string;
  last_name: string;
  birthday: string;
  address: string;
  receive_marketing_message: boolean;
  password1: string;
  password2: string;
}

export interface MeOut {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | null;
  birthday_updated_at?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
  address?: string | null;
  receive_marketing_message: boolean;
  role: string;
  is_email_verified: boolean;
  invite_code?: string | null;
  is_member?: boolean; // default: false
}

export interface SocialLoginIn {
  provider: string;
  id_token?: string | null;
  access_token?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | null;
  email?: string | null;
}

export interface ForgotPasswordSendIn {
  email: string;
}

export interface ForgotPasswordSendOut {
  ok: boolean;
  send_count: number;
}

export interface ForgotPasswordResetIn {
  vs_token: string;
  password1: string;
  password2: string;
}

export interface OkOut {
  ok: boolean;
}

// 服务目录类型
export interface ServiceItemOut {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  display_order?: number | null;
}

export interface ServiceWeightPriceOut {
  id: number;
  min_weight_kg: number | string;
  max_weight_kg?: number | string | null;
  price: number | string;
  label?: string | null;
}

export interface ServiceOut {
  id: number;
  name: string;
  type: string;
  description?: string | null;
  base_price: number | string;
  service_time?: string | null;
  items?: ServiceItemOut[] | null;
  weight_prices?: ServiceWeightPriceOut[] | null;
}

export interface AddOnOut {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  is_variable: boolean;
  service_time?: string | null;
  label?: string | null;
  most_popular?: boolean | null;
  included_in_membership?: boolean | null;
}

// 宠物管理类型
export interface PetOut {
  id: number;
  name: string;
  pet_type: string;
  breed?: string | null;
  mixed_breed?: boolean | null;
  precise_type?: string | null;
  birthday?: string | null;
  gender?: string | null;
  weight_value?: number | string | null;
  weight_unit?: string | null;
  coat_condition?: string | null;
  approve_shave?: boolean; // default: false
  behavior?: string | null;
  grooming_frequency?: string | null;
  primary_photo?: string | null; // 主照片 URL
  photos: string[]; // 照片 URL 数组
  reference_photos: string[]; // 参考照片 URL 数组
  special_notes?: string | null;
  photo_ids: number[]; // 照片 ID 数组
  reference_photo_ids: number[]; // 参考照片 ID 数组
}

export interface PetPageOut {
  total: number;
  page: number;
  page_size: number;
  items: PetOut[];
}

export interface PetBreedOut {
  id: number;
  pet_type: string;
  breed: string;
}

// PetPayload 用于提交预约时的宠物信息
export interface PetPayload {
  id?: number | null;
  name: string;
  pet_type: string;
  breed?: string | null;
  mixed_breed?: boolean;
  precise_type?: string | null;
  birthday?: string | null;
  gender?: string | null;
  weight_value?: number | string | null;
  weight_unit?: string;
  coat_condition?: string | null;
  approve_shave?: boolean | null;
  behavior?: string | null;
  grooming_frequency?: string | null;
  special_notes?: string | null;
  photo_ids?: number[];
  reference_photo_ids?: number[];
}

export interface CreatePetParams {
  name: string;
  pet_type?: string;
  breed?: string;
  mixed_breed?: boolean;
  precise_type?: string;
  birthday?: string | null;
  gender?: string;
  weight_value?: number | null;
  weight_unit?: string;
  coat_condition?: string;
  approve_shave?: boolean | null;
  behavior?: string;
  grooming_frequency?: string;
  special_notes?: string;
}

// 预约管理类型
export interface BookingOut {
  id: number;
  status: string;
  scheduled_time?: string | null;
  deposit_amount: number | string;
  final_amount: number | string;
}

export interface CreateBookingParams {
  pet_id: number;
  service_id: number;
  scheduled_time?: string | null;
  notes?: string;
  guest_id?: string | null;
}

// 地址相关类型
export interface AddressOut {
  id: number;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  service_type: string;
  is_default: boolean;
  label?: string | null;
}

export interface AddressIn {
  id?: number | null;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  service_type: string;
}

export interface AddressManageIn {
  address: string;
  city: string;
  province: string;
  postal_code: string;
  service_type: string;
  label?: string | null;
  is_default?: boolean; // default: false
}

export interface AddressUpdateIn {
  address?: string | null;
  city?: string | null;
  province?: string | null;
  postal_code?: string | null;
  service_type?: string | null;
  label?: string | null;
  is_default?: boolean | null;
}

export interface AddressPageOut {
  total: number;
  page: number;
  page_size: number;
  items: AddressOut[];
}

// Booking submit types
export interface TimeSlotIn {
  date: string; // ISO date string (YYYY-MM-DD)
  slot: string; // Time slot identifier (e.g., "morning", "afternoon")
}

export interface BookingSubmitIn {
  service_id: number;
  add_on_ids?: number[];
  weight_value?: number | string | null;
  weight_unit?: string; // default: "kg"
  membership_plan_id?: number | null;
  open_membership?: boolean; // default: false
  use_gift_coupon?: boolean; // default: false
  use_birthday_coupon?: boolean; // default: false
  use_custom_coupon?: boolean; // default: false
  address: AddressIn;
  pet: PetPayload;
  preferred_time_slots?: TimeSlotIn[];
  notes?: string; // default: ""
  store_id?: number | null;
}

// Booking quote types
export interface BookingQuoteIn {
  service_id: number;
  add_on_ids?: number[]; // default: []
  weight_value?: number | string | null;
  weight_unit?: string; // default: "kg"
  membership_plan_id?: number | null;
  open_membership?: boolean; // default: false
  use_gift_coupon?: boolean; // default: false
  use_birthday_coupon?: boolean; // default: false
  use_custom_coupon?: boolean; // default: false
}

export interface BookingPriceBreakdown {
  package_amount: number | string;
  addons_amount: number | string;
  membership_fee: number | string;
  discount_rate: number | string;
  discount_amount: number | string;
  coupon_amount: number | string;
  payable_amount: number | string;
  used_coupon_ids?: number[]; // default: []
  currency?: string; // default: "usd"
}

export interface BookingListOut {
  id: number;
  status: string;
  pet_name?: string | null;
  service_name?: string | null;
  address?: string | null;
  service_type?: string | null;
  scheduled_time?: string | null;
}

export interface BookingPageOut {
  total: number;
  page: number;
  page_size: number;
  items: BookingListOut[];
}

export interface BookingPaymentOut {
  id: number;
  kind: string;
  amount: number | string;
  currency: string;
  status: string;
  payment_method?: PaymentMethodOut | null;
}

export interface BookingDetailOut {
  id: number;
  status: string;
  scheduled_time?: string | null;
  notes?: string | null;
  preferred_time_slots: Record<string, unknown>[];
  address_snapshot: Record<string, unknown>;
  pet_snapshot: Record<string, unknown>;
  package_snapshot: Record<string, unknown>;
  addons_snapshot: Record<string, unknown>[];
  membership_snapshot: Record<string, unknown>;
  coupon_snapshot: Record<string, unknown>;
  package_amount: number | string;
  addons_amount: number | string;
  membership_fee: number | string;
  discount_rate: number | string;
  discount_amount: number | string;
  coupon_amount: number | string;
  payable_amount: number | string;
  deposit_amount: number | string;
  final_amount: number | string;
  payments: BookingPaymentOut[];
}

// 门店相关类型
export interface StoreLocationOut {
  id: number;
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
}

// ==================== 认证相关 API ====================

/**
 * 检查邮箱是否已注册
 */
export async function checkEmailRegistered(
  email: string
): Promise<EmailCheckOut> {
  const response = await http.post<EmailCheckOut>(
    "/api/auth/email/check",
    { email },
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 发送验证码
 */
export async function sendCode(data: SendCodeIn): Promise<SendCodeOut> {
  const response = await http.post<SendCodeOut>(
    "/api/auth/send_code",
    { email: data.email, purpose: data.purpose || "register" },
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 验证验证码
 */
export async function verifyCode(data: CodeVerifyIn): Promise<CodeVerifyOut> {
  const response = await http.post<CodeVerifyOut>(
    "/api/auth/code/verify",
    data,
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 检查密码是否正确（登录前验证）
 */
export async function loginPasswordCheck(
  data: LoginPasswordCheckIn
): Promise<LoginPasswordCheckOut> {
  const response = await http.post<LoginPasswordCheckOut>(
    "/api/auth/login/password-check",
    data,
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 用户登录（需要验证码）
 */
export async function login(data: LoginConfirmIn): Promise<TokenOut> {
  const response = await http.post<TokenOut>("/api/auth/login", data, {
    skipAuth: true,
  });

  // 自动保存 token（加密存储）
  await setAuthToken(response.data.access);
  await setRefreshToken(response.data.refresh);

  return response.data;
}

/**
 * 刷新访问令牌
 */
export async function refreshToken(refresh: string): Promise<TokenOut> {
  const response = await http.post<TokenOut>(
    "/api/auth/refresh",
    { refresh },
    { skipAuth: true }
  );

  // 自动保存新的 token（加密存储）
  await setAuthToken(response.data.access);
  await setRefreshToken(response.data.refresh);

  return response.data;
}

/**
 * 完成注册
 */
export async function registerComplete(
  data: RegisterCompleteIn
): Promise<TokenOut> {
  const response = await http.post<TokenOut>(
    "/api/auth/register/complete",
    data,
    { skipAuth: true }
  );

  // 自动保存 token（加密存储）
  await setAuthToken(response.data.access);
  await setRefreshToken(response.data.refresh);

  return response.data;
}

/**
 * 获取当前用户信息
 */
export async function getCurrentUser(): Promise<MeOut> {
  const response = await http.get<MeOut>("/api/auth/me");
  return response.data;
}

/**
 * 更新用户个人信息
 */
export interface UpdateUserInfoIn {
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | null;
  phone?: string | null;
  receive_marketing_message?: boolean | null;
}

export interface AvatarOut {
  url: string;
}

export interface PasswordChangeIn {
  old_password: string;
  password1: string;
  password2: string;
}

export async function updateUserInfo(data: UpdateUserInfoIn): Promise<MeOut> {
  const response = await http.patch<MeOut>("/api/auth/me", data);
  return response.data;
}

/**
 * 上传用户头像
 */
export async function uploadAvatar(
  file: File,
  onProgress?: (progress: number) => void
): Promise<AvatarOut> {
  return uploadFileWithProgress("/api/auth/avatar", file, onProgress) as Promise<AvatarOut>;
}

/**
 * 修改密码
 */
export async function changePassword(data: PasswordChangeIn): Promise<OkOut> {
  const response = await http.post<OkOut>("/api/auth/password/change", data);
  return response.data;
}

/**
 * 发送密码重置验证码
 */
export async function sendPasswordResetCode(
  email: string
): Promise<ForgotPasswordSendOut> {
  const response = await http.post<ForgotPasswordSendOut>(
    "/api/auth/password/forgot/send",
    { email },
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 验证密码重置验证码
 */
export async function verifyPasswordResetCode(
  data: CodeVerifyIn
): Promise<CodeVerifyOut> {
  const response = await http.post<CodeVerifyOut>(
    "/api/auth/password/forgot/verify",
    data,
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 重置密码
 */
export async function resetPassword(
  data: ForgotPasswordResetIn
): Promise<OkOut> {
  const response = await http.post<OkOut>(
    "/api/auth/password/forgot/reset",
    data,
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 用户登出（清除本地 token）
 */
export async function logout(): Promise<void> {
  await clearAuthTokens();
}

/**
 * 社交登录（Google/Facebook 等）
 * 添加了重试机制以处理网络连接问题
 */
export async function socialLogin(data: SocialLoginIn): Promise<TokenOut> {
  // 添加调试信息
  if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === "true") {
    console.log("[Social Login] Request data:", {
      provider: data.provider,
      hasIdToken: !!data.id_token,
      hasAccessToken: !!data.access_token,
      firstName: data.first_name,
      lastName: data.last_name,
    });
  }

  try {
    const response = await http.post<TokenOut>("/api/auth/social/login", data, {
      skipAuth: true,
      retry: 2, // 重试 2 次（总共 3 次尝试）
      retryDelay: 1000, // 每次重试延迟 1 秒
      timeout: 30000, // 30 秒超时
    });

    // 自动保存 token（加密存储）
    await setAuthToken(response.data.access);
    await setRefreshToken(response.data.refresh);

    return response.data;
  } catch (error) {
    // 添加详细的错误日志
    console.error("[Social Login] Error details:", {
      error,
      provider: data.provider,
      url: "/api/auth/social/login",
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

// ==================== 服务目录 API ====================

/**
 * 获取服务列表
 */
export async function getServices(): Promise<ServiceOut[]> {
  const response = await http.get<ServiceOut[]>("/api/catalog/services");
  return response.data;
}

/**
 * 获取附加服务列表
 */
export async function getAddOns(): Promise<AddOnOut[]> {
  const response = await http.get<AddOnOut[]>("/api/catalog/add_ons");
  return response.data;
}

// ==================== Membership Plans ====================

export interface MembershipBenefitOut {
  content: string;
  is_highlight: boolean;
  display_order: number;
}

export interface MembershipPlanOut {
  id: number;
  name: string;
  description?: string | null;
  fee: number | string;
  discount_rate: number | string;
  coupon_count: number;
  coupon_amount: number | string;
  duration_days: number;
  coupon_valid_days: number;
  benefits?: MembershipBenefitOut[] | null;
}

// 促销相关类型
export interface CouponOut {
  id: number;
  template_id: number;
  template_name?: string | null;
  type: string;
  category: string;
  apply_scope: string;
  amount: number | string;
  valid_from?: string | null;
  expires_at?: string | null;
  status: string;
  notes?: string | null;
  activated_at?: string | null;
}

export interface CouponPageOut {
  total: number;
  page: number;
  page_size: number;
  items: CouponOut[];
}

export interface InviteBindIn {
  invite_code: string;
}

// 已废弃：redeemCouponCode 和 claimBirthdayCoupon 端点已从 API 中移除

/**
 * 获取会员套餐列表
 */
export async function getMembershipPlans(): Promise<MembershipPlanOut[]> {
  const response = await http.get<MembershipPlanOut[]>(
    "/api/promotions/membership_plans",
    {
      skipAuth: true,
    }
  );
  return response.data;
}

/**
 * 获取我的优惠券列表（分页）
 */
export async function getMyCoupons(params?: {
  page?: number;
  page_size?: number;
  category?: string | null;
}): Promise<CouponPageOut> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.page_size) queryParams.append("page_size", String(params.page_size));
  if (params?.category !== undefined) {
    queryParams.append("category", params.category || "");
  }

  const url = `/api/promotions/coupons${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  const response = await http.get<CouponPageOut>(url);
  return response.data;
}

/**
 * 绑定邀请码
 */
export async function bindInvitation(data: InviteBindIn): Promise<OkOut> {
  const response = await http.post<OkOut>(
    "/api/promotions/invite/bind",
    data
  );
  return response.data;
}

// ==================== 宠物管理 API ====================

/**
 * 获取宠物列表（分页）
 */
export async function getPets(params?: {
  page?: number;
  page_size?: number;
}): Promise<PetPageOut> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.page_size) queryParams.append("page_size", String(params.page_size));

  const url = `/api/pets/pets${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  const response = await http.get<PetPageOut>(url);
  return response.data;
}

/**
 * 获取单个宠物信息
 */
export async function getPet(petId: number): Promise<PetOut> {
  const response = await http.get<PetOut>(`/api/pets/pets/${petId}`);
  return response.data;
}

/**
 * 创建宠物
 */
export async function createPet(
  params: CreatePetParams,
  body?: { photo_ids?: number[] | null; reference_photo_ids?: number[] | null }
): Promise<PetOut> {
  // 将所有参数合并到 data 中
  const data = {
    name: params.name,
    ...(params.pet_type && { pet_type: params.pet_type }),
    ...(params.breed && { breed: params.breed }),
    ...(params.mixed_breed !== undefined && { mixed_breed: params.mixed_breed }),
    ...(params.precise_type && { precise_type: params.precise_type }),
    ...(params.birthday && { birthday: params.birthday }),
    ...(params.gender && { gender: params.gender }),
    ...(params.weight_value !== undefined && params.weight_value !== null && { weight_value: params.weight_value }),
    ...(params.weight_unit && { weight_unit: params.weight_unit }),
    ...(params.coat_condition && { coat_condition: params.coat_condition }),
    ...(params.behavior && { behavior: params.behavior }),
    ...(params.grooming_frequency && { grooming_frequency: params.grooming_frequency }),
    ...(params.special_notes && { special_notes: params.special_notes }),
    ...(body || { photo_ids: null, reference_photo_ids: null }),
  };

  const response = await http.post<PetOut>(
    `/api/pets/pets`,
    data
  );
  return response.data;
}

/**
 * 更新宠物信息
 */
export interface UpdatePetParams {
  name?: string | null;
  pet_type?: string | null;
  breed?: string | null;
  mixed_breed?: boolean | null;
  precise_type?: string | null;
  birthday?: string | null;
  gender?: string | null;
  weight_value?: number | null;
  weight_unit?: string | null;
  coat_condition?: string | null;
  approve_shave?: boolean | null;
  behavior?: string | null;
  grooming_frequency?: string | null;
  special_notes?: string | null;
}

export async function updatePet(
  petId: number,
  params: UpdatePetParams,
  body?: { photo_ids?: number[] | null; reference_photo_ids?: number[] | null }
): Promise<PetOut> {
  // 构建查询参数
  const queryParams = new URLSearchParams();
  if (params.name !== undefined) {
    queryParams.append("name", params.name || "");
  }
  if (params.pet_type !== undefined) {
    queryParams.append("pet_type", params.pet_type || "");
  }
  if (params.breed !== undefined) {
    queryParams.append("breed", params.breed || "");
  }
  if (params.mixed_breed !== undefined) {
    queryParams.append("mixed_breed", String(params.mixed_breed));
  }
  if (params.precise_type !== undefined) {
    queryParams.append("precise_type", params.precise_type || "");
  }
  if (params.birthday !== undefined) {
    queryParams.append("birthday", params.birthday || "");
  }
  if (params.gender !== undefined) {
    queryParams.append("gender", params.gender || "");
  }
  if (params.weight_value !== undefined && params.weight_value !== null) {
    queryParams.append("weight_value", String(params.weight_value));
  }
  if (params.weight_unit !== undefined) {
    queryParams.append("weight_unit", params.weight_unit || "");
  }
  if (params.coat_condition !== undefined) {
    queryParams.append("coat_condition", params.coat_condition || "");
  }
  if (params.approve_shave !== undefined) {
    queryParams.append("approve_shave", String(params.approve_shave));
  }
  if (params.behavior !== undefined) {
    queryParams.append("behavior", params.behavior || "");
  }
  if (params.grooming_frequency !== undefined) {
    queryParams.append("grooming_frequency", params.grooming_frequency || "");
  }
  if (params.special_notes !== undefined) {
    queryParams.append("special_notes", params.special_notes || "");
  }

  const response = await http.put<PetOut>(
    `/api/pets/pets/${petId}?${queryParams.toString()}`,
    body || { photo_ids: null, reference_photo_ids: null }
  );
  return response.data;
}

/**
 * 删除宠物
 */
export async function deletePet(petId: number): Promise<OkOut> {
  const response = await http.delete<OkOut>(`/api/pets/pets/${petId}`);
  return response.data;
}

/**
 * 获取宠物品种列表
 */
export async function getPetBreeds(): Promise<PetBreedOut[]> {
  const response = await http.get<PetBreedOut[]>("/api/pets/breeds", {
    skipAuth: true,
  });
  return response.data;
}

/**
 * 上传宠物照片
 * @param file 图片文件
 * @param onProgress 上传进度回调 (0-100)
 * @returns 返回照片信息（包含 ID 和 URL）
 */
export interface PhotoUploadResponse {
  id: number;
  url: string; // 相对路径，例如 "/media/pets/anonymous/temp/photos/dog-2.jpg"
}

/**
 * 构建图片的完整 URL
 * @param relativeUrl 相对路径（例如 "/media/pets/anonymous/temp/photos/dog-2.jpg"）
 * @returns 图片 URL（开发环境使用 Vite 代理，生产环境使用 Cloudflare Pages Function 代理）
 */
export function buildImageUrl(relativeUrl: string): string {
  if (!relativeUrl) return "";
  // 如果已经是完整 URL，直接返回
  if (relativeUrl.startsWith("http://") || relativeUrl.startsWith("https://")) {
    return relativeUrl;
  }
  
  // 确保 relativeUrl 以 / 开头
  const path = relativeUrl.startsWith("/") ? relativeUrl : `/${relativeUrl}`;
  
  // 开发环境和生产环境都使用相对路径，通过代理转发
  // - 开发环境：通过 Vite 代理（vite.config.ts）
  // - 生产环境：通过 Cloudflare Pages Function（functions/media/[[path]].ts）
  return path;
}

export async function uploadPetPhoto(
  file: File,
  onProgress?: (progress: number) => void
): Promise<PhotoUploadResponse> {
  return uploadFileWithProgress("/api/pets/photos", file, onProgress);
}

/**
 * 上传参考照片
 * @param file 图片文件
 * @param onProgress 上传进度回调 (0-100)
 * @returns 返回照片信息（包含 ID 和 URL）
 */
export async function uploadReferencePhoto(
  file: File,
  onProgress?: (progress: number) => void
): Promise<PhotoUploadResponse> {
  return uploadFileWithProgress("/api/pets/reference_photos", file, onProgress);
}

/**
 * 使用 XMLHttpRequest 上传文件，支持进度回调
 */
async function uploadFileWithProgress<T = PhotoUploadResponse>(
  url: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    // 获取 API base URL
    const API_BASE_URL = import.meta.env.DEV
      ? "" // 开发环境使用相对路径，通过 Vite 代理
      : import.meta.env.VITE_API_BASE_URL || ""; // 生产环境默认使用相对路径
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

    // 上传进度事件
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    // 请求完成事件
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText) as T;
          resolve(response);
        } catch {
          reject(new Error("Failed to parse response"));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    // 请求错误事件
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    // 请求中止事件
    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was aborted"));
    });

    // 设置请求头（包括认证 token）
    xhr.open("POST", fullUrl);
    
    // 获取并设置认证 token
    (async () => {
      try {
        const token = await getEncryptedItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }
        // 发送请求（FormData 会自动设置 Content-Type）
        xhr.send(formData);
      } catch (err) {
        reject(err);
      }
    })();
  });
}

// ==================== 预约管理 API ====================

/**
 * 获取门店列表
 */
export async function getStores(): Promise<StoreLocationOut[]> {
  const response = await http.get<StoreLocationOut[]>("/api/bookings/stores", {
    skipAuth: true,
  });
  return response.data;
}

/**
 * 获取地址列表（需要认证，分页）
 */
export async function getAddresses(params?: {
  page?: number;
  page_size?: number;
}): Promise<AddressPageOut> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.page_size) queryParams.append("page_size", String(params.page_size));

  const url = `/api/bookings/addresses${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  const response = await http.get<AddressPageOut>(url);
  return response.data;
}

/**
 * 创建地址
 */
export async function createAddress(data: AddressManageIn): Promise<AddressOut> {
  const response = await http.post<AddressOut>("/api/bookings/addresses", data);
  return response.data;
}

/**
 * 更新地址
 */
export async function updateAddress(
  addressId: number,
  data: AddressUpdateIn
): Promise<AddressOut> {
  const response = await http.patch<AddressOut>(
    `/api/bookings/addresses/${addressId}`,
    data
  );
  return response.data;
}

/**
 * 删除地址
 */
export async function deleteAddress(addressId: number): Promise<OkOut> {
  const response = await http.delete<OkOut>(`/api/bookings/addresses/${addressId}`);
  return response.data;
}

/**
 * 设置默认地址
 */
export async function setDefaultAddress(addressId: number): Promise<OkOut> {
  const response = await http.post<OkOut>(
    `/api/bookings/addresses/${addressId}/default`,
    undefined
  );
  return response.data;
}

/**
 * 创建预约（已废弃，请使用 submitBooking）
 * @deprecated 此函数使用已废弃的端点，请使用 submitBooking 代替
 */
export async function createBooking(
  _params: CreateBookingParams
): Promise<BookingOut> {
  // 注意：旧的 /api/bookings/bookings 端点已从 API 中移除
  // 请使用 submitBooking 函数代替
  console.warn(
    "createBooking is deprecated. The /api/bookings/bookings endpoint has been removed. " +
    "Please use submitBooking with BookingSubmitIn format instead."
  );
  throw new Error(
    "createBooking is deprecated. Please use submitBooking with BookingSubmitIn format instead."
  );
}

/**
 * 获取预约报价（价格明细）
 */
export async function getBookingQuote(
  params: BookingQuoteIn
): Promise<BookingPriceBreakdown> {
  const response = await http.post<BookingPriceBreakdown>(
    "/api/bookings/quote",
    params
  );
  return response.data;
}

/**
 * 提交订单（使用完整的 BookingSubmitIn 格式）
 */
export async function submitBooking(
  params: BookingSubmitIn
): Promise<BookingOut> {
  const response = await http.post<BookingOut>(
    "/api/bookings/submit",
    params
  );
  return response.data;
}

/**
 * 获取我的预约列表（分页）
 */
export async function getMyBookings(params?: {
  group?: string;
  page?: number;
  page_size?: number;
}): Promise<BookingPageOut> {
  const queryParams = new URLSearchParams();
  if (params?.group) queryParams.append("group", params.group);
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.page_size) queryParams.append("page_size", String(params.page_size));

  const url = `/api/bookings/${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  const response = await http.get<BookingPageOut>(url);
  return response.data;
}

/**
 * 获取预约详情
 */
export async function getBookingDetail(bookingId: number): Promise<BookingDetailOut> {
  const response = await http.get<BookingDetailOut>(`/api/bookings/${bookingId}`);
  return response.data;
}

export interface AddOnRequestOut {
  id: number;
  status: string;
}

export interface ReviewCreatedOut {
  ok: boolean;
  review_id: number;
}

export interface CheckOutOut {
  ok: boolean;
  status: string;
}

/**
 * 美容师确认预约
 */
export async function groomerConfirmBooking(
  bookingId: number,
  confirm: boolean = true
): Promise<OkOut> {
  const response = await http.post<OkOut>(
    `/api/bookings/bookings/${bookingId}/groomer_confirm?confirm=${confirm}`,
    undefined
  );
  return response.data;
}

/**
 * 创建附加服务请求
 */
export async function createAddOnRequest(
  bookingId: number,
  amount: number,
  description: string = ""
): Promise<AddOnRequestOut> {
  const queryParams = new URLSearchParams();
  queryParams.append("amount", String(amount));
  if (description) queryParams.append("description", description);

  const response = await http.post<AddOnRequestOut>(
    `/api/bookings/bookings/${bookingId}/addon_request?${queryParams.toString()}`,
    undefined
  );
  return response.data;
}

/**
 * 创建评价
 */
export async function createReview(
  bookingId: number,
  rating: number,
  comment: string = ""
): Promise<ReviewCreatedOut> {
  const queryParams = new URLSearchParams();
  queryParams.append("rating", String(rating));
  if (comment) queryParams.append("comment", comment);

  const response = await http.post<ReviewCreatedOut>(
    `/api/bookings/bookings/${bookingId}/review?${queryParams.toString()}`,
    undefined
  );
  return response.data;
}

/**
 * 签到
 */
export async function checkInBooking(bookingId: number): Promise<OkOut> {
  const response = await http.post<OkOut>(
    `/api/bookings/bookings/${bookingId}/check_in`,
    undefined
  );
  return response.data;
}

/**
 * 签退
 */
export async function checkOutBooking(bookingId: number): Promise<CheckOutOut> {
  const response = await http.post<CheckOutOut>(
    `/api/bookings/bookings/${bookingId}/check_out`,
    undefined
  );
  return response.data;
}

/**
 * 客户决定附加服务
 */
export async function clientDecideAddOn(
  bookingId: number,
  requestId: number,
  approve: boolean = true
): Promise<CheckOutOut> {
  const response = await http.post<CheckOutOut>(
    `/api/bookings/bookings/${bookingId}/addon_request/${requestId}/client_decide?approve=${approve}`,
    undefined
  );
  return response.data;
}

/**
 * 取消预约
 */
export async function cancelBooking(
  bookingId: number,
  reason: string = ""
): Promise<OkOut> {
  const queryParams = new URLSearchParams();
  if (reason) queryParams.append("reason", reason);

  const response = await http.post<OkOut>(
    `/api/bookings/bookings/${bookingId}/cancel${queryParams.toString() ? "?" + queryParams.toString() : ""}`,
    undefined
  );
  return response.data;
}

// ==================== 支付管理 API ====================

export interface PaymentIntentOut {
  client_secret: string;
  payment_id: number;
}

export interface PaymentSessionOut {
  url: string;
  session_id: string;
  payment_id: number;
}

export interface PaymentMethodOut {
  id: number;
  method_type?: string | null;
  brand?: string | null;
  last4?: string | null;
  exp_month?: number | null;
  exp_year?: number | null;
  funding?: string | null;
  country?: string | null;
  billing_name?: string | null;
  created_at: string;
}

export interface PaymentMethodPageOut {
  total: number;
  page: number;
  page_size: number;
  items: PaymentMethodOut[];
}

/**
 * 创建押金支付意图
 */
export async function createDepositIntent(
  bookingId: number
): Promise<PaymentIntentOut> {
  const response = await http.post<PaymentIntentOut>(
    `/api/payments/payments/create_deposit_intent?booking_id=${bookingId}`,
    undefined
  );
  return response.data;
}

/**
 * 创建押金支付会话（Stripe Checkout）
 */
export async function createDepositSession(
  bookingId: number
): Promise<PaymentSessionOut> {
  const response = await http.post<PaymentSessionOut>(
    `/api/payments/payments/create_deposit_session?booking_id=${bookingId}`,
    undefined
  );
  return response.data;
}

/**
 * 创建最终支付意图
 */
export async function createFinalIntent(
  bookingId: number
): Promise<PaymentIntentOut> {
  const response = await http.post<PaymentIntentOut>(
    `/api/payments/payments/create_final_intent?booking_id=${bookingId}`,
    undefined
  );
  return response.data;
}

/**
 * 创建最终支付会话（Stripe Checkout）
 */
export async function createFinalSession(
  bookingId: number
): Promise<PaymentSessionOut> {
  const response = await http.post<PaymentSessionOut>(
    `/api/payments/payments/create_final_session?booking_id=${bookingId}`,
    undefined
  );
  return response.data;
}

/**
 * 获取支付方式列表（分页）
 */
export async function getPaymentMethods(params?: {
  page?: number;
  page_size?: number;
}): Promise<PaymentMethodPageOut> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", String(params.page));
  if (params?.page_size) queryParams.append("page_size", String(params.page_size));

  const url = `/api/payments/payment_methods${queryParams.toString() ? "?" + queryParams.toString() : ""}`;
  const response = await http.get<PaymentMethodPageOut>(url);
  return response.data;
}

// ==================== 访客相关 API ====================

export interface GuestStartOut {
  guest_id: string;
  expires_at: string;
}

export interface UpgradeGuestIn {
  guest_id: string;
  email: string;
  password: string;
}

/**
 * 访客开始（创建访客会话）
 */
export async function guestStart(
  email?: string | null
): Promise<GuestStartOut> {
  const queryParams = new URLSearchParams();
  if (email) queryParams.append("email", email);

  const response = await http.post<GuestStartOut>(
    `/api/auth/guest/start${queryParams.toString() ? "?" + queryParams.toString() : ""}`,
    undefined,
    { skipAuth: true }
  );
  return response.data;
}

/**
 * 升级访客账户为正式账户
 */
export async function upgradeGuest(
  data: UpgradeGuestIn
): Promise<TokenOut> {
  const response = await http.post<TokenOut>(
    "/api/auth/guest/upgrade",
    data,
    { skipAuth: true }
  );

  // 自动保存 token（加密存储）
  await setAuthToken(response.data.access);
  await setRefreshToken(response.data.refresh);

  return response.data;
}

// ==================== 社交账号关联 API ====================

export interface SocialIn {
  provider: string;
  provider_account_id: string;
  email?: string | null;
  raw_info?: Record<string, unknown>;
}

/**
 * 关联社交账号（需要认证）
 */
export async function linkSocial(data: SocialIn): Promise<OkOut> {
  const response = await http.post<OkOut>("/api/auth/social/link", data);
  return response.data;
}

// ==================== 公共 API ====================

export interface FeedbackIn {
  name: string;
  email: string;
  message: string;
}

export interface FeedbackOut {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

/**
 * 提交反馈
 */
export async function submitFeedback(data: FeedbackIn): Promise<FeedbackOut> {
  const response = await http.post<FeedbackOut>(
    "/api/public/feedback",
    data,
    { skipAuth: true }
  );
  return response.data;
}
