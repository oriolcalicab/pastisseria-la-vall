type SettingRow = { key: string; value: string }

export const readNumberSetting = (
  settings: SettingRow[],
  key: string,
  fallback: number,
): number => {
  const value = Number(settings.find((setting) => setting.key === key)?.value)

  return Number.isInteger(value) && value >= 0 ? value : fallback
}