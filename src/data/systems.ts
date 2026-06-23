// الأنظمة الستة للعناية العامة (الهيكل الرسمي من content/systems/systems-structure.json)
export type CareSystem = {
  id: string;
  order: number;
  nameAr: string;
  icon: string;
  trackMode: "dual" | "sudanese_only" | "na";
};

export const careSystems: CareSystem[] = [
  { id: "face_care", order: 1, nameAr: "العناية بالوجه", icon: "✨", trackMode: "dual" },
  { id: "body_care", order: 2, nameAr: "العناية بالجسم", icon: "🌸", trackMode: "dual" },
  { id: "hair_care", order: 3, nameAr: "العناية بالشعر", icon: "💇‍♀️", trackMode: "dual" },
  { id: "care_exercises", order: 4, nameAr: "تمارين العناية", icon: "🏃‍♀️", trackMode: "na" },
  { id: "daily_habits", order: 5, nameAr: "العادات اليومية", icon: "💧", trackMode: "na" },
  {
    id: "smoke_blends",
    order: 6,
    nameAr: "الدخان والخلطات السودانية",
    icon: "🔥",
    trackMode: "sudanese_only",
  },
];
