export interface Judge {
  id: string;
  name: string;
  role: string;
}

export interface TimeSlot {
  date: string; // Persian date
  dayName: string;
  slots: {
    time: string;
    label: string;
  }[];
  isWeekend: boolean;
  isHoliday: boolean;
}

// Fixed UUIDs for each judge
export const JUDGES_DB: Judge[] = [
  {
    id: "7f8a9b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c",
    name: "دکتر افشین بنازاده",
    role: "داور داخل دانشکده"
  },
  {
    id: "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
    name: "دکتر علیرضا شریفی",
    role: "داور داخل دانشکده"
  },
  {
    id: "9e8d7c6b-5a4f-3e2d-1c0b-9a8f7e6d5c4b",
    name: "دکتر سعید خدایگان",
    role: "داور داخل دانشگاه"
  },
  {
    id: "5c4b3a2f-1e0d-9c8b-7a6f-5e4d3c2b1a0f",
    name: "دکتر علیرضا رودباری",
    role: "داور خارج دانشگاه"
  }
];

export function getJudgeById(id: string): Judge | null {
  return JUDGES_DB.find(judge => judge.id === id) || null;
}

// Generate time slots from 27 Mordad to 15 Shahrivar
export function generateTimeSlots(): TimeSlot[] {
  const timeSlots: TimeSlot[] = [];
  
  // Persian calendar days and dates
  const dates = [
    // Mordad (مرداد)
    { date: '۲۷ مرداد', dayName: 'شنبه', day: 27, month: 5 },
    { date: '۲۸ مرداد', dayName: 'یکشنبه', day: 28, month: 5 },
    { date: '۲۹ مرداد', dayName: 'دوشنبه', day: 29, month: 5 },
    { date: '۳۰ مرداد', dayName: 'سه‌شنبه', day: 30, month: 5 },
    { date: '۳۱ مرداد', dayName: 'چهارشنبه', day: 31, month: 5 },
    // Shahrivar (شهریور)
    { date: '۱ شهریور', dayName: 'پنج‌شنبه', day: 1, month: 6 },
    { date: '۲ شهریور', dayName: 'جمعه', day: 2, month: 6 },
    { date: '۳ شهریور', dayName: 'شنبه', day: 3, month: 6 },
    { date: '۴ شهریور', dayName: 'یکشنبه', day: 4, month: 6 },
    { date: '۵ شهریور', dayName: 'دوشنبه', day: 5, month: 6 },
    { date: '۶ شهریور', dayName: 'سه‌شنبه', day: 6, month: 6 },
    { date: '۷ شهریور', dayName: 'چهارشنبه', day: 7, month: 6 },
    { date: '۸ شهریور', dayName: 'پنج‌شنبه', day: 8, month: 6 },
    { date: '۹ شهریور', dayName: 'جمعه', day: 9, month: 6 },
    { date: '۱۰ شهریور', dayName: 'شنبه', day: 10, month: 6 },
    { date: '۱۱ شهریور', dayName: 'یکشنبه', day: 11, month: 6 },
    { date: '۱۲ شهریور', dayName: 'دوشنبه', day: 12, month: 6 },
    { date: '۱۳ شهریور', dayName: 'سه‌شنبه', day: 13, month: 6 },
    { date: '۱۴ شهریور', dayName: 'چهارشنبه', day: 14, month: 6 },
    { date: '۱۵ شهریور', dayName: 'پنج‌شنبه', day: 15, month: 6 },
  ];

  const timeRanges = [
    { time: '9-12', label: 'ساعت ۹:۰۰ تا ۱۲:۰۰' },
    { time: '12-15', label: 'ساعت ۱۲:۰۰ تا ۱۵:۰۰' },
    { time: '15-18', label: 'ساعت ۱۵:۰۰ تا ۱۸:۰۰' }
  ];

  dates.forEach(dateInfo => {
    const isWeekend = dateInfo.dayName === 'پنج‌شنبه' || dateInfo.dayName === 'جمعه';
    const isHoliday = (dateInfo.month == 6 && (dateInfo.day == 10 || dateInfo.day == 2 )) || dateInfo.dayName === 'پنج‌شنبه' || dateInfo.dayName === 'جمعه';
    
    timeSlots.push({
      date: dateInfo.date,
      dayName: dateInfo.dayName,
      slots: timeRanges.map(range => ({
        time: range.time,
        label: range.label
      })),
      isWeekend,
      isHoliday
    });
  });

  return timeSlots;
}