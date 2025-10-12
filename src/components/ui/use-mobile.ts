import { ref, onMounted, onUnmounted } from 'vue';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const isMobile = ref<boolean>(false);

  const updateIsMobile = () => {
    isMobile.value = window.innerWidth < MOBILE_BREAKPOINT;
  };

  onMounted(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // 立即更新初始状态
    updateIsMobile();

    // 监听窗口大小变化
    mql.addEventListener('change', updateIsMobile);

    // 组件卸载时移除监听器
    onUnmounted(() => {
      mql.removeEventListener('change', updateIsMobile);
    });
  });

  return isMobile;
}
