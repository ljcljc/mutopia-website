// API utility functions
import { http, setAuthToken, setRefreshToken, clearAuthTokens } from "./http";

// ==================== 类型定义 ====================

// 认证相关类型
export interface EmailCheckIn {
  email: string;
}

export interface EmailCheckOut {
  exists: boolean;
  code_sent?: boolean; // Optional: indicates if verification code was sent
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
  vs_token: string;
  first_name: string;
  last_name: string;
  birthday: string;
  address: string;
  receive_marketing_message: boolean;
  password1: string;
  password2: string;
}

export interface MeOut {
  id: number;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  birthday?: string | null;
  address?: string | null;
  receive_marketing_message: boolean;
  role: string;
  is_email_verified: boolean;
}

export interface ForgotPasswordSendIn {
  email: string;
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
export interface ServiceOut {
  id: number;
  name: string;
  type: string;
  description?: string | null;
  base_price: number | string;
}

export interface AddOnOut {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  is_variable: boolean;
}

// 宠物管理类型
export interface PetOut {
  id: number;
  name: string;
  breed?: string | null;
  weight_kg?: number | string | null;
  age_years?: number | null;
  hair_condition?: string | null;
  special_notes?: string | null;
}

export interface CreatePetParams {
  name: string;
  breed?: string;
  weight_kg?: number | null;
  age_years?: number | null;
  hair_condition?: string;
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

  // 自动保存 token
  setAuthToken(response.data.access);
  setRefreshToken(response.data.refresh);

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

  // 自动保存新的 token
  setAuthToken(response.data.access);
  setRefreshToken(response.data.refresh);

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

  // 自动保存 token
  setAuthToken(response.data.access);
  setRefreshToken(response.data.refresh);

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
 * 发送密码重置验证码
 */
export async function sendPasswordResetCode(
  email: string
): Promise<SendCodeOut> {
  const response = await http.post<SendCodeOut>(
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
export function logout(): void {
  clearAuthTokens();
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

// ==================== 宠物管理 API ====================

/**
 * 获取宠物列表
 */
export async function getPets(): Promise<PetOut[]> {
  const response = await http.get<PetOut[]>("/api/pets/pets");
  return response.data;
}

/**
 * 创建宠物
 */
export async function createPet(params: CreatePetParams): Promise<PetOut> {
  // 构建查询参数
  const queryParams = new URLSearchParams();
  queryParams.append("name", params.name);
  if (params.breed) queryParams.append("breed", params.breed);
  if (params.weight_kg !== undefined && params.weight_kg !== null) {
    queryParams.append("weight_kg", String(params.weight_kg));
  }
  if (params.age_years !== undefined && params.age_years !== null) {
    queryParams.append("age_years", String(params.age_years));
  }
  if (params.hair_condition)
    queryParams.append("hair_condition", params.hair_condition);
  if (params.special_notes)
    queryParams.append("special_notes", params.special_notes);

  const response = await http.post<PetOut>(
    `/api/pets/pets?${queryParams.toString()}`,
    undefined,
    { headers: {} } // POST 请求但使用查询参数，不需要 body
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

// ==================== 预约管理 API ====================

/**
 * 创建预约
 */
export async function createBooking(
  params: CreateBookingParams
): Promise<BookingOut> {
  const queryParams = new URLSearchParams();
  queryParams.append("pet_id", String(params.pet_id));
  queryParams.append("service_id", String(params.service_id));
  if (params.scheduled_time)
    queryParams.append("scheduled_time", params.scheduled_time);
  if (params.notes) queryParams.append("notes", params.notes);
  if (params.guest_id) queryParams.append("guest_id", params.guest_id);

  const response = await http.post<BookingOut>(
    `/api/bookings/bookings?${queryParams.toString()}`,
    undefined
  );
  return response.data;
}

/**
 * 获取我的预约列表
 */
export async function getMyBookings(): Promise<BookingOut[]> {
  const response = await http.get<BookingOut[]>("/api/bookings/bookings");
  return response.data;
}

/**
 * 获取访客预约列表
 */
export async function getGuestBookings(guestId: string): Promise<BookingOut[]> {
  const response = await http.get<BookingOut[]>(
    `/api/bookings/bookings/guest?guest_id=${guestId}`,
    { skipAuth: true }
  );
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
