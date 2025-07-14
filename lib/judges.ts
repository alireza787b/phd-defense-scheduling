/* ───────────── types ───────────── */
export interface Judge {
  id: string;
  name: string;
  role: string;
}

export interface TimeSlot {
  date: string;                                // ۲۷ مرداد
  dayName: string;                             // شنبه
  slots: {
    id: string;                                // 27-5-morning
    time: string;                              // 9-12
    label: string;                             // ساعت ۹:۰۰ تا ۱۲:۰۰
  }[];
  isWeekend: boolean;
  isHoliday: boolean;
}

/* ───────────── judges ───────────── */
export const JUDGES_DB: Judge[] = [
  { id: '7f8a9b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c', name: 'دکتر افشین بنازاده',  role: 'داور داخل دانشکده' },
  { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', name: 'دکتر علیرضا شریفی',  role: 'داور داخل دانشکده' },
  { id: '9e8d7c6b-5a4f-3e2d-1c0b-9a8f7e6d5c4b', name: 'دکتر سعید خدایگان',  role: 'داور داخل دانشگاه' },
  { id: '5c4b3a2f-1e0d-9c8b-7a6f-5e4d3c2b1a0f', name: 'دکتر علیرضا رودباری', role: 'داور خارج دانشگاه' },
  { id: '3c2b3ف2f-1e0d-9cلb-7a6f-5e4d3c2b1a1f', name: 'دکتر محمد مراد', role: 'ناظر جلسه' },
];

export const getJudgeById = (id: string): Judge | null =>
  JUDGES_DB.find((j) => j.id === id) ?? null;

/* ───────────── Timeslots ───────────── */
export const generateTimeSlots = (): TimeSlot[] => {
  const dates = [
    // مرداد
    { date: '۲۷ مرداد', dayName: 'شنبه',     day: 27, month: 5 },
    { date: '۲۸ مرداد', dayName: 'یکشنبه',   day: 28, month: 5 },
    { date: '۲۹ مرداد', dayName: 'دوشنبه',   day: 29, month: 5 },
    { date: '۳۰ مرداد', dayName: 'سه‌شنبه',  day: 30, month: 5 },
    { date: '۳۱ مرداد', dayName: 'چهارشنبه', day: 31, month: 5 },
    // شهریور
    { date: '۱ شهریور',  dayName: 'پنج‌شنبه', day: 1,  month: 6 },
    { date: '۲ شهریور',  dayName: 'جمعه',     day: 2,  month: 6 },
    { date: '۳ شهریور',  dayName: 'شنبه',     day: 3,  month: 6 },
    { date: '۴ شهریور',  dayName: 'یکشنبه',   day: 4,  month: 6 },
    { date: '۵ شهریور',  dayName: 'دوشنبه',   day: 5,  month: 6 },
    { date: '۶ شهریور',  dayName: 'سه‌شنبه',  day: 6,  month: 6 },
    { date: '۷ شهریور',  dayName: 'چهارشنبه', day: 7,  month: 6 },
    { date: '۸ شهریور',  dayName: 'پنج‌شنبه', day: 8,  month: 6 },
    { date: '۹ شهریور',  dayName: 'جمعه',     day: 9,  month: 6 },
    { date: '۱۰ شهریور', dayName: 'شنبه',     day: 10, month: 6 },
    { date: '۱۱ شهریور', dayName: 'یکشنبه',   day: 11, month: 6 },
    { date: '۱۲ شهریور', dayName: 'دوشنبه',   day: 12, month: 6 },
    { date: '۱۳ شهریور', dayName: 'سه‌شنبه',  day: 13, month: 6 },
    { date: '۱۴ شهریور', dayName: 'چهارشنبه', day: 14, month: 6 },
    { date: '۱۵ شهریور', dayName: 'پنج‌شنبه', day: 15, month: 6 },
  ];

  const ranges = [
    { key: 'morning', time: '9-12',  label: 'ساعت ۹:۰۰ تا ۱۲:۰۰' },
    { key: 'noon',    time: '12-15', label: 'ساعت ۱۲:۰۰ تا ۱۵:۰۰' },
    { key: 'evening', time: '15-18', label: 'ساعت ۱۵:۰۰ تا ۱۸:۰۰' },
  ];

  return dates.map((d) => {
    const isWeekend = d.dayName === 'پنج‌شنبه' || d.dayName === 'جمعه';
    const isHoliday =
      isWeekend || (d.month === 6 && (d.day === 2 || d.day === 10));

    return {
      date: d.date,
      dayName: d.dayName,
      isWeekend,
      isHoliday,
      slots: ranges.map((r) => ({
        id: `${d.day}-${d.month}-${r.key}`,          // ← شناسه یکتا
        time: r.time,
        label: r.label,
      })),
    };
  });
};
