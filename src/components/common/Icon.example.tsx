/**
 * Icon 组件使用示例
 * 
 * 这个文件展示了如何使用 Icon 组件
 * 可以删除或作为参考
 */

import { Icon } from "./Icon";

export function IconExamples() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold">Icon 组件使用示例</h1>

      {/* 基础使用 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">基础使用</h2>
        <div className="flex gap-4 items-center">
          <Icon name="location" size={24} />
          <Icon name="user" size={32} />
          <Icon name="notify" size={20} />
        </div>
      </section>

      {/* 颜色控制 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">颜色控制</h2>
        <div className="flex gap-4 items-center">
          <Icon name="nav-prev" size={24} className="text-[#8b6357]" />
          <Icon name="nav-next" size={24} className="text-[#de6a07]" />
          <Icon name="location" size={24} className="text-blue-500" />
          <Icon name="user" size={24} className="text-green-500" />
        </div>
      </section>

      {/* Hover 效果 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Hover 效果</h2>
        <div className="flex gap-4 items-center">
          <Icon
            name="notify"
            size={24}
            className="text-[#8b6357] hover:text-[#de6a07] transition-colors cursor-pointer"
          />
          <Icon
            name="menu"
            size={24}
            className="text-gray-600 hover:text-[#8b6357] transition-colors cursor-pointer"
          />
        </div>
      </section>

      {/* 响应式大小 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">响应式大小</h2>
        <div className="flex gap-4 items-center">
          <Icon
            name="location"
            className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#8b6357]"
          />
          <Icon
            name="user"
            className="w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 text-[#8b6357]"
          />
        </div>
      </section>

      {/* 在按钮中使用 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">在按钮中使用</h2>
        <div className="flex gap-4 items-center">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#8b6357] text-white rounded">
            <Icon name="location" size={16} className="text-white" />
            <span>Location</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#8b6357] text-[#8b6357] rounded hover:bg-[#8b6357] hover:text-white transition-colors">
            <Icon name="user" size={16} className="text-current" />
            <span>User</span>
          </button>
        </div>
      </section>

      {/* 所有可用图标 */}
      <section>
        <h2 className="text-xl font-semibold mb-4">所有可用图标</h2>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {[
            "nav-prev",
            "nav-next",
            "location",
            "user",
            "notify",
            "chevron-down",
            "menu",
            "email",
            "calendar",
            "alert-error",
            "alert-success",
            "alert-warning",
            "eye-visible",
            "eye-invisible",
            "facebook",
            "google",
          ].map((iconName) => (
            <div
              key={iconName}
              className="flex flex-col items-center gap-2 p-4 border rounded"
            >
              <Icon name={iconName as any} size={32} className="text-[#8b6357]" />
              <span className="text-xs text-center">{iconName}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

