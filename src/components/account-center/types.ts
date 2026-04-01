import type { IconName } from "@/components/common/Icon";

export interface AccountInfoRowItem {
  icon: IconName;
  value: string;
  emphasize?: boolean;
}

export interface AccountListRow {
  id: string;
  label: string;
  rightIcon: IconName;
  rightIconColor?: string;
  heightClassName?: string;
}

