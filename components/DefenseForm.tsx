'use client';

import { useState } from 'react';
import Image from 'next/image';
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

/* ---------- Types ---------- */
type Available = { date: string; dayName: string; time: string; label: string };
interface FormData {
  judgeId: string;
  judgeName: string;
  judgeRole: string;
  availableTimes: Available[];
  notes: string;
  submittedAt: string;
}
interface Props {
  judge: { id: string; name: string; role: string };
  existingResponse?: FormData | null;
}

/* ---------- Abstract ---------- */
const abstract = `
خستگی خلبانان و افزایش بار شناختی آنان از عوامل اصلی سوانح مرگبار هوانوردی است؛
در این پژوهش با تلفیق ردیابی نگاه، ورودی‌های دستهٔ کنترل و آزمون عملکرد پیوسته،
شاخص پایداری عملکرد شناختی به‌صورت برخط تخمین زده می‌شود.
`.trim();

/* ---------- Component ---------- */
export default function DefenseForm({ judge, existingResponse }: Props) {
  /* state */
  const [selected, setSelected] = useState<string[]>(
    existingResponse?.availableTimes.map((t) => t.time) ?? []
  );
  const [notes, setNotes] = useState(existingResponse?.notes ?? '');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  /* data */
  const days = generateTimeSlots();

  /* helpers */
  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const isOn = (id: string) => selected.includes(id);

  /* submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const avail: Available[] = selected.flatMap((id) => {
      for (const d of days) {
        const s = d.slots.find((x) => x.id === id);
        if (s) return [{ date: d.date, dayName: d.dayName, time: s.time, label: s.label }];
      }
      return [];
    });
    if (!avail.length) return setMsg('هیچ بازهٔ معتبری انتخاب نشده است.');

    setBusy(true);
    const ok = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        judgeId: judge.id,
        judgeName: judge.name,
        judgeRole: judge.role,
        availableTimes: avail,
        notes,
        submittedAt: new Date().toISOString(),
      } satisfies FormData),
    }).then((r) => r.ok);
    setMsg(
      ok
        ? 'اطلاعات شما با موفقیت ثبت شد.'
        : 'خطایی رخ داده است؛ دوباره تلاش کنید.'
    );
    setBusy(false);
  };

  /* UI */
  return (
    <form onSubmit={handleSubmit} className="space-y-10 card-elevated rounded-2xl p-8 fade-in">
      {/* abstract + images */}
      <section className="space-y-6">
        <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <MapPin className="w-5 h-5 text-primary" /> چکیده رساله
        </h2>
        <p className="whitespace-pre-line leading-7 text-justify text-muted-foreground">
          {abstract}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Image
            src="/img/test1.jpg"
            alt="نمای آزمایش"
            width={800}
            height={533}
            className="rounded-lg shadow-md"
            sizes="(max-width:640px) 100vw, 50vw"
            priority
          />
          <Image
            src="/img/test2.jpg"
            alt="نتایج مدل"
            width={800}
            height={533}
            className="rounded-lg shadow-md"
            sizes="(max-width:640px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* judge info */}
      <section className="gradient-info rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-3">
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
      </section>

      {/* calendar */}
      <section className="space-y-8">
        <header className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            زمان‌های پیشنهادی برای جلسه دفاع
          </h3>
        </header>
        {Array.from({ length: 3 }).map((_, w) => {
          const week = days.slice(w * 7, w * 7 + 7);
          return (
            <div key={w} className="border border-border rounded-xl p-4 bg-card/50">
              <div className="calendar-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {week.map((d) => (
                  <div key={d.date} className={d.isWeekend || d.isHoliday ? 'opacity-50' : undefined}>
                    <div
                      className={`p-3 rounded-t-lg text-center font-medium ${
                        d.isHoliday
                          ? 'day-header-holiday'
                          : d.isWeekend
                          ? 'day-header-inactive'
                          : 'day-header-active'
                      }`}
                    >
                      <div className="text-sm">{d.dayName}</div>
                      <div className="text-xs mt-1">{d.date}</div>
                      {d.isHoliday && <div className="text-xs mt-1 font-bold">تعطیل</div>}
                    </div>
                    {!d.isWeekend && !d.isHoliday && (
                      <div className="space-y-2 p-2 bg-card rounded-b-lg border border-t-0 border-border">
                        {d.slots.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => toggle(s.id)}
                            className={`w-full p-3 rounded-lg text-xs transition-all duration-200 ${
                              isOn(s.id) ? 'time-slot-selected' : 'time-slot-unselected'
                            }`}
                          >
                            <Clock
                              className={`w-3 h-3 mx-auto mb-1 ${
                                isOn(s.id) ? 'text-primary-foreground' : ''
                              }`}
                            />
                            {s.label.replace('ساعت ', '')}
                            {isOn(s.id) && <Check className="w-3 h-3 mx-auto mt-1" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* notes */}
      <section>
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
      </section>

      {/* submit */}
      <button
        type="submit"
        disabled={busy || selected.length === 0}
        className="w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 btn-primary
                   enabled:hover:scale-105 transition-transform"
      >
        <Send className="w-5 h-5" />
        {busy ? 'در حال ارسال…' : 'ثبت اطلاعات'}
      </button>

      {msg && (
        <p
          className={`p-4 rounded-lg text-center fade-in ${
            msg.includes('موفقیت') ? 'message-success' : 'message-error'
          }`}
        >
          {msg}
        </p>
      )}
    </form>
  );
}
