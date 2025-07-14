'use client';

import { useState } from 'react';
import Image from 'next/image';                         // ✅ new
import {
  Calendar,
  Clock,
  User,
  FileText,
  Send,
  Check,
  MapPin,
} from 'lucide-react';
import { generateTimeSlots } from '@/lib/judges';

/* ─────────────────────────── Types ─────────────────────────── */
interface FormData {
  judgeId: string;
  judgeName: string;
  judgeRole: string;
  availableTimes: { date: string; dayName: string; time: string; label: string }[];
  notes: string;
  submittedAt?: string;
}

interface DefenseFormProps {
  judge: { id: string; name: string; role: string };
  existingResponse?: FormData | null;
}

/* ─────────────────── Polished Persian abstract ─────────────────── */
const abstract = `
خستگی خلبانان و افزایش بار شناختی آنان از عوامل اصلی سوانح مرگبار هوانوردی، خصوصاً در هوانوردی عمومی است.
این رساله چارچوبی چندوجهی، کم‌هزینه و غیرتداخلی ارائه می‌کند که با تلفیق ردیابیِ نگاه بدون کالیبراسیون،
ورودی‌های دستهٔ کنترل و نمرات آزمون عملکرد پیوسته، شاخص «پایداری عملکرد شناختی» را برمبنای خودهمبستگیِ تخطی محاسبه می‌کند.

در فاز تجربی، پروازهای متعددی تحت قوانین IFR در شبیه‌ساز سسنا تک‌موتوره، با طیفی از خلبانان با سطوح تجربهٔ متفاوت اجرا شد.
سیگنال‌های شبیه‌ساز، مختصات نگاه، ورودی‌های اهرم کنترل و خروجی آزمون، توسط زیرساختی کاملاً خودکار ضبط گردید.
پس از پیش‌پردازش، اسکالوگرام‌های تبدیل موجک پیوسته، همبستگی چشم–دست و شاخص‌های خلاصه استخراج شد.

سه خانوادهٔ مدل یادگیری عمیق آزمایش شدند:
• شبکهٔ کانولوشن تک‌وجهیِ اسکالوگرام  
• شبکهٔ کانولوشن چندوجهی با ادغام اسکالوگرام و آزمون عملکرد  
• مدل ترکیبی کانولوشن چندوجهی + LSTM برای الگوهای زمانی

بهترین عملکرد مربوط به شبکهٔ چندوجهی Inception-ResNet با دقّت ٪۹۲ بود؛ نسخهٔ سبک GoogleNet نیز برای استقرار بلادرنگ پیشنهاد می‌شود.
چارچوب ماژولارِ این پژوهش، از ضبط داده تا آموزش و گزارش را پوشش داده و آمادهٔ ادغام در سامانه‌های مدیریت خطر خستگی است.
`.trim();

/* ─────────────────────────── Component ─────────────────────────── */
export default function DefenseForm({ judge, existingResponse }: DefenseFormProps) {
  /* ---------- state ---------- */
  const [selectedTimes, setSelectedTimes] = useState<string[]>(
    existingResponse?.availableTimes.map((t) => `${t.date}-${t.time}`) || []
  );
  const [notes, setNotes] = useState(existingResponse?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const timeSlots = generateTimeSlots();

  /* ---------- helpers ---------- */
  const isTimeSelected = (d: string, t: string) => selectedTimes.includes(`${d}-${t}`);
  const handleTimeToggle = (d: string, t: string) =>
    setSelectedTimes((prev) =>
      prev.includes(`${d}-${t}`) ? prev.filter((s) => s !== `${d}-${t}`) : [...prev, `${d}-${t}`]
    );

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTimes.length === 0) return;
    setIsSubmitting(true);

    const availableTimes = selectedTimes.map((sel) => {
      const [date, time] = sel.split('-');
      const slot = timeSlots.find((s) => s.date === date)!;
      const info = slot.slots.find((s) => s.time === time)!;
      return { date, dayName: slot.dayName, time, label: info.label };
    });

    const payload: FormData = {
      judgeId: judge.id,
      judgeName: judge.name,
      judgeRole: judge.role,
      availableTimes,
      notes,
      submittedAt: new Date().toISOString(),
    };

    try {
      const ok = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.ok);

      setSubmitMessage(
        ok
          ? 'اطلاعات شما با موفقیت ثبت شد. پس از هماهنگی با سایر داوران، دعوت‌نامه نهایی برای شما ارسال خواهد شد.'
          : 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.'
      );
    } catch {
      setSubmitMessage('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <form onSubmit={handleSubmit} className="relative space-y-8 card-elevated rounded-2xl p-8 fade-in">
      {/* ─────────────── Abstract + images ─────────────── */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" /> چکیده رساله
        </h2>

        <p className="whitespace-pre-line leading-7 text-justify text-muted-foreground">{abstract}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Image
            src="/img/test1.jpg"
            alt="نمایی از محیط آزمایش"
            className="rounded-lg shadow-md"
            width={800}
            height={533}
            sizes="(max-width:640px) 100vw, 50vw"
            priority
          />
          <Image
            src="/img/test2.jpg"
            alt="نتیجهٔ بصری مدل یادگیری"
            className="rounded-lg shadow-md"
            width={800}
            height={533}
            sizes="(max-width:640px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* ─────────────── Judge info ─────────────── */}
      <div className="gradient-info rounded-lg p-6">
        <div className="flex items-center gap-3 mb-3">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">اطلاعات داور</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">نام:</span>
            <p className="font-medium text-foreground">{judge.name}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">سمت:</span>
            <p className="font-medium text-foreground">{judge.role}</p>
          </div>
        </div>
      </div>

      {/* ─────────────── Calendar ─────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">زمان‌های پیشنهادی برای جلسه دفاع</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          لطفاً تمام زمان‌هایی که می‌توانید در جلسه حضور داشته باشید را انتخاب کنید:
        </p>

        <div className="space-y-8">
          {Array.from({ length: 3 }).map((_, w) => {
            const week = timeSlots.slice(w * 7, w * 7 + 7);
            return (
              <div key={w} className="border border-border rounded-xl p-4 bg-card/50">
                <div className="calendar-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                  {week.map((day) => (
                    <div
                      key={day.date}
                      className={day.isWeekend || day.isHoliday ? 'opacity-50' : undefined}
                    >
                      {/* Day header */}
                      <div
                        className={`p-3 rounded-t-lg text-center font-medium ${
                          day.isHoliday
                            ? 'day-header-holiday'
                            : day.isWeekend
                            ? 'day-header-inactive'
                            : 'day-header-active'
                        }`}
                      >
                        <div className="text-sm">{day.dayName}</div>
                        <div className="text-xs mt-1">{day.date}</div>
                        {day.isHoliday && <div className="text-xs mt-1 font-bold">تعطیل</div>}
                      </div>

                      {/* Slots */}
                      {!day.isWeekend && !day.isHoliday && (
                        <div className="space-y-2 p-2 bg-card rounded-b-lg border border-t-0 border-border">
                          {day.slots.map((t) => {
                            const selected = isTimeSelected(day.date, t.time);
                            return (
                              <button
                                key={t.time}
                                type="button"
                                onClick={() => handleTimeToggle(day.date, t.time)}
                                className={`w-full p-3 rounded-lg text-xs transition-all duration-200 ${
                                  selected ? 'time-slot-selected' : 'time-slot-unselected'
                                }`}
                              >
                                <Clock
                                  className={`w-3 h-3 mx-auto mb-1 ${
                                    selected ? 'text-primary-foreground' : ''
                                  }`}
                                />
                                {t.label.replace('ساعت ', '')}
                                {selected && <Check className="w-3 h-3 mx-auto mt-1" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─────────────── Notes ─────────────── */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">توضیحات اضافی (اختیاری)</h3>
        </div>
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="form-textarea"
          placeholder="در صورت نیاز، توضیحات یا محدودیت‌های زمانی خود را اینجا بنویسید..."
        />
      </div>

      {/* ─────────────── Submit ─────────────── */}
      <button
        type="submit"
        disabled={isSubmitting || selectedTimes.length === 0}
        className="w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 btn-primary
                   enabled:hover:scale-105 transition-transform"
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? 'در حال ارسال...' : 'ثبت اطلاعات'}
      </button>

      {/* feedback */}
      {submitMessage && (
        <div
          className={`p-4 rounded-lg text-center fade-in ${
            submitMessage.includes('موفقیت') ? 'message-success' : 'message-error'
          }`}
        >
          {submitMessage}
        </div>
      )}

      {/* existing-response notice */}
      {existingResponse && (
        <div className="message-warning rounded-lg p-4 fade-in">
          <p className="text-sm">
            <strong>توجه:</strong> شما قبلاً این فرم را تکمیل کرده‌اید. در صورت ثبت مجدد، اطلاعات قبلی شما جایگزین
            خواهد شد.
          </p>
        </div>
      )}
    </form>
  );
}
