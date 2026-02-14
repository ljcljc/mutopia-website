# HTTP 客户端和 API 接口使用指南

本项目提供了封装的 HTTP 客户端和完整的 API 接口封装，统一处理 API 请求。

## 目录

- [HTTP 客户端](#http-客户端)
- [API 接口封装](#api-接口封装)
- [Token 自动刷新](#token-自动刷新)

## 基本使用

### 导入

```typescript
import { http, HttpError } from "@/lib/http";
```

### GET 请求

```typescript
try {
  const response = await http.get<UserData>("/api/auth/me");
  console.log(response.data); // 响应数据
  console.log(response.status); // HTTP 状态码
} catch (error) {
  if (error instanceof HttpError) {
    console.error("HTTP Error:", error.status, error.message);
  }
}
```

### POST 请求

```typescript
try {
  const response = await http.post<TokenOut>(
    "/api/auth/login",
    { email: "user@example.com", password: "password" },
    { skipAuth: true } // 登录接口不需要认证
  );
  console.log(response.data);
} catch (error) {
  if (error instanceof HttpError) {
    console.error("Error:", error.status, error.message);
  }
}
```

### PUT/PATCH/DELETE 请求

```typescript
// PUT
const response = await http.put("/api/pets/pets/1", { name: "New Name" });

// PATCH
const response = await http.patch("/api/pets/pets/1", { name: "New Name" });

// DELETE
const response = await http.delete("/api/pets/pets/1");
```

## 请求配置

### 基本配置

```typescript
const response = await http.get("/api/endpoint", {
  timeout: 10000, // 超时时间（毫秒），默认 30 秒
  retry: 2, // 重试次数，默认 0
  retryDelay: 1000, // 重试延迟（毫秒），默认 1 秒
  skipAuth: false, // 跳过认证，默认 false
  headers: {
    // 自定义请求头
    "Custom-Header": "value",
  },
});
```

### 超时设置

```typescript
// 设置 10 秒超时
const response = await http.get("/api/slow-endpoint", {
  timeout: 10000,
});
```

### 重试机制

```typescript
// 失败后重试 2 次，每次间隔 1 秒
const response = await http.get("/api/unstable-endpoint", {
  retry: 2,
  retryDelay: 1000,
});
```

### 跳过认证

```typescript
// 登录、注册等公开接口不需要认证
const response = await http.post("/api/auth/login", data, {
  skipAuth: true,
});
```

## 错误处理

### HttpError 类

所有 HTTP 错误都会抛出 `HttpError` 实例：

```typescript
try {
  const response = await http.get("/api/endpoint");
} catch (error) {
  if (error instanceof HttpError) {
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Data:", error.data); // 错误响应数据

    // 根据状态码处理
    if (error.status === 401) {
      // 未授权，可能需要重新登录
    } else if (error.status === 404) {
      // 资源不存在
    } else if (error.status === 500) {
      // 服务器错误
    }
  }
}
```

### 常见错误状态码

- **400**: 请求参数错误
- **401**: 未授权，需要登录或刷新 token
- **403**: 禁止访问
- **404**: 资源不存在
- **429**: 请求过于频繁
- **500**: 服务器内部错误
- **0**: 网络错误（无法连接到服务器）

## 认证 Token 管理

### 设置 Token

```typescript
import { setAuthToken, setRefreshToken } from "@/lib/http";

// 登录成功后设置 token
setAuthToken(response.data.access);
setRefreshToken(response.data.refresh);
```

### 清除 Token

```typescript
import { clearAuthTokens } from "@/lib/http";

// 登出时清除所有 token
clearAuthTokens();
```

### 自动添加认证头

默认情况下，所有请求都会自动添加 `Authorization: Bearer <token>` 头。

如果接口不需要认证，使用 `skipAuth: true`：

```typescript
const response = await http.post("/api/public-endpoint", data, {
  skipAuth: true,
});
```

## 响应类型

### HttpResponse 接口

```typescript
interface HttpResponse<T> {
  data: T; // 响应数据
  status: number; // HTTP 状态码
  statusText: string; // HTTP 状态文本
  headers: Headers; // 响应头
}
```

### 使用泛型指定响应类型

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const response = await http.get<User>("/api/auth/me");
// response.data 的类型是 User
```

## 调试模式

在开发环境中，如果启用了调试模式（`VITE_DEBUG=true`），会在控制台输出详细的请求和响应日志：

```
[HTTP Debug] Request: { method: 'POST', url: '/api/auth/email/check', ... }
[HTTP Debug] Response: { status: 200, statusText: 'OK', ... }
[HTTP Debug] Response data: { exists: true, code_sent: false }
```

## 完整示例

```typescript
import { http, HttpError } from "@/lib/http";

// 登录
async function login(email: string, password: string) {
  try {
    const response = await http.post<TokenOut>(
      "/api/auth/login",
      { email, password },
      { skipAuth: true }
    );

    // 保存 token
    setAuthToken(response.data.access);
    setRefreshToken(response.data.refresh);

    return response.data;
  } catch (error) {
    if (error instanceof HttpError) {
      if (error.status === 401) {
        throw new Error("Invalid email or password");
      }
      throw error;
    }
    throw new Error("Login failed");
  }
}

// 获取用户信息
async function getCurrentUser() {
  try {
    const response = await http.get<MeOut>("/api/auth/me");
    return response.data;
  } catch (error) {
    if (error instanceof HttpError && error.status === 401) {
      // Token 过期，可能需要刷新
      clearAuthTokens();
      throw new Error("Please login again");
    }
    throw error;
  }
}
```

## API 接口封装

项目在 `src/lib/api.ts` 中提供了完整的 API 接口封装，包括：

### 认证相关

- `checkEmailRegistered()` - 检查邮箱是否已注册
- `sendCode()` - 发送验证码
- `verifyCode()` - 验证验证码
- `login()` - 用户登录（自动保存 token）
- `registerComplete()` - 完成注册（自动保存 token）
- `getCurrentUser()` - 获取当前用户信息
- `logout()` - 用户登出
- `refreshToken()` - 刷新访问令牌
- `sendPasswordResetCode()` - 发送密码重置验证码
- `verifyPasswordResetCode()` - 验证密码重置验证码
- `resetPassword()` - 重置密码

### 服务目录

- `getServices()` - 获取服务列表
- `getAddOns()` - 获取附加服务列表

### 宠物管理

- `getPets(params?)` - 获取宠物列表（分页）
- `getMemorializedPets(params?)` - 获取已纪念宠物列表（分页）
- `getPet(petId)` - 获取单个宠物信息
- `createPet(params, body?)` - 创建宠物（请求体为 PetCreateIn）
- `updatePet(petId, params, body?)` - 更新宠物信息（请求体为 PetUpdateIn）
- `deletePet(petId)` - 删除宠物
- `memorializePet(petId)` - 纪念宠物

### 预约管理

- `submitBooking(params)` - 提交预约（使用完整的 BookingSubmitIn 格式）
- `getBookingDetail(bookingId)` - 获取预约详情
- `getMyBookings(params?)` - 获取我的预约列表（分页）
- `getBookingQuote(params)` - 获取预约报价
- `createAddress(data)` - 创建地址
- `getAddresses(params?)` - 获取地址列表（分页）
- `updateAddress(addressId, data)` - 更新地址
- `deleteAddress(addressId)` - 删除地址
- `setDefaultAddress(addressId)` - 设置默认地址
- `groomerConfirmBooking(bookingId, confirm?)` - 美容师确认预约
- `checkInBooking(bookingId)` - 签到
- `checkOutBooking(bookingId)` - 签退
- `createAddOnRequest(bookingId, amount, description?)` - 创建附加服务请求
- `clientDecideAddOn(bookingId, requestId, approve?)` - 客户决定附加服务
- `createReview(bookingId, rating, comment?)` - 创建评价
- `cancelBooking(bookingId, reason?)` - 取消预约

### Groomer Apply

- `getGroomerApplyStatus(email?)` - 获取美容师申请状态
- `submitGroomerApply(data)` - 提交美容师申请
- `uploadGroomerApplyImage(file, category, email?, onProgress?)` - 上传美容师申请图片

### 支付管理

- `createDepositSession(bookingId)` - 创建押金支付会话（Stripe Checkout）
- `createFinalSession(bookingId)` - 创建最终支付会话（Stripe Checkout）
- `getPaymentMethods(params?)` - 获取支付方式列表（分页）

### 促销相关

- `getMembershipPlans()` - 获取会员套餐列表
- `createMembershipCheckout(data)` - 创建会员套餐结账会话（Stripe Checkout）
- `getMembershipInfo()` - 获取会员信息
- `getMyCoupons(params?)` - 获取我的优惠券列表（分页）
- `bindInvitation(data)` - 绑定邀请码

### 使用示例

```typescript
import {
  login,
  getCurrentUser,
  submitBooking,
  getPets,
  getServices,
  getAddresses,
  getMyCoupons,
  getMembershipPlans,
  createMembershipCheckout,
  getMembershipInfo,
} from "@/lib/api";

// 登录（自动保存 token）
const tokens = await login({ 
  email: "user@example.com", 
  password: "password",
  code: "123456"
});

// 获取用户信息
const user = await getCurrentUser();

// 获取宠物和服务列表（分页）
const petsPage = await getPets({ page: 1, page_size: 10 });
const pets = petsPage.items;
const services = await getServices();

// 获取地址列表（分页）
const addressesPage = await getAddresses({ page: 1, page_size: 10 });
const addresses = addressesPage.items;

// 获取优惠券列表（分页）
const couponsPage = await getMyCoupons({ page: 1, page_size: 10 });
const coupons = couponsPage.items;

// 获取会员套餐列表
const membershipPlans = await getMembershipPlans();

// 获取会员信息
const membershipInfo = await getMembershipInfo();

// 创建会员套餐结账会话
const checkoutSession = await createMembershipCheckout({ plan_id: membershipPlans[0].id });
// checkoutSession.url 是 Stripe Checkout 的 URL，可以重定向用户到该 URL

// 提交预约（使用完整的 BookingSubmitIn 格式）
const booking = await submitBooking({
  service_id: services[0].id,
  add_on_ids: [],
  weight_value: 10,
  weight_unit: "kg",
  address: {
    address: "123 Main St",
    city: "Vancouver",
    province: "BC",
    postal_code: "V6B 1A1",
    service_type: "mobile"
  },
  pet: {
    name: "Fluffy",
    pet_type: "dog",
    // ... 其他宠物信息
  },
  preferred_time_slots: [
    { date: "2024-01-01", slot: "morning" }
  ],
  notes: "Please be gentle"
});
```

## Token 自动刷新

HTTP 客户端实现了自动 token 刷新机制：

1. **自动检测**: 当请求返回 401 错误时，自动检测是否需要刷新 token
2. **自动刷新**: 使用 refresh token 自动刷新 access token
3. **自动重试**: 刷新成功后自动重试原请求
4. **失败处理**: 刷新失败时清除所有 token，抛出错误提示用户重新登录
5. **并发控制**: 使用单例模式防止多个请求同时触发刷新

### 工作原理

```typescript
// 用户无需关心 token 刷新，HTTP 客户端会自动处理
try {
  const user = await getCurrentUser(); // 如果 token 过期，会自动刷新并重试
} catch (error) {
  if (error instanceof HttpError && error.status === 401) {
    // 只有在刷新失败时才会到达这里
    // 此时需要用户重新登录
    logout();
  }
}
```

## 注意事项

1. **开发环境代理**: 开发环境会自动使用 Vite 代理，无需配置完整 URL
2. **生产环境**: 生产环境需要后端正确配置 CORS
3. **Token 存储**: Token 存储在 localStorage，注意安全性
4. **错误处理**: 始终使用 `instanceof HttpError` 检查错误类型
5. **超时设置**: 根据接口响应时间合理设置超时时间
6. **重试机制**: 仅对幂等操作使用重试（GET、PUT、DELETE）
7. **自动 Token 管理**: 登录、注册、刷新 token 等操作会自动保存 token
8. **自动刷新**: 401 错误时会自动尝试刷新 token，无需手动处理
