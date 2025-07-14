'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, User, FileText, Send, Check } from 'lucide-react';
import { generateTimeSlots } from '@/lib/judges';

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

export default function DefenseForm({ judge, existingResponse }: DefenseFormProps) {
  const [selectedTimes, setSelectedTimes] = useState<string[]>(
    existingResponse?.availableTimes.map(t => `${t.date}-${t.time}`) || []
  );
  const [notes, setNotes] = useState(existingResponse?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const timeSlots = generateTimeSlots();

  /* ──────────────────────────────── Helpers ──────────────────────────────── */
  const isTimeSelected = (date: string, time: string) =>
    selectedTimes.includes(`${date}-${time}`);

  const handleTimeToggle = (date: string, time: string) => {
    const key = `${date}-${time}`;
    setSelectedTimes(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    );
  };

  /* ─────────────────────────────── Submit ─────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTimes.length === 0) return;

    setIsSubmitting(true);

    const availableTimes = selectedTimes.map(sel => {
      const [date, time] = sel.split('-');
      const slot = timeSlots.find(s => s.date === date);
      const info = slot?.slots.find(s => s.time === time);
      return { date, dayName: slot?.dayName ?? '', time, label: info?.label ?? '' };
    });

    const formData: FormData = {
      judgeId: judge.id,
      judgeName: judge.name,
      judgeRole: judge.role,
      availableTimes,
      notes,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setSubmitMessage(
        res.ok
          ? 'اطلاعات شما با موفقیت ثبت شد. پس از هماهنگی با سایر داوران، دعوت‌نامه نهایی برای شما ارسال خواهد شد.'
          : 'خطایی رخ داده است. لطفاً دوباره تلاش کنید.'
      );
    } catch {
      setSubmitMessage('خطایی رخ داده است. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────── Render ─────────────────────────────── */
  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-6 card-elevated rounded-2xl p-8 fade-in"
    >
      {/* Judge info */}
      <div className="gradient-info rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">اطلاعات داور</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm text-muted-foreground">نام:</label>
            <p className="font-medium text-foreground">{judge.name}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">سمت:</label>
            <p className="font-medium text-foreground">{judge.role}</p>
          </div>
        </div>
      </div>

      {/* Time-slot calendar */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            زمان‌های پیشنهادی برای جلسه دفاع
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          لطفاً تمام زمان‌هایی که می‌توانید در جلسه حضور داشته باشید را انتخاب کنید:
        </p>

        {/* Three weeks */}
        <div className="space-y-8">
          {Array.from({ length: 3 }, (_, w) => {
            const week = timeSlots.slice(w * 7, w * 7 + 7);
            return (
              <div key={w} className="border border-border rounded-xl p-4 bg-card/50">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-3 calendar-grid">
                  {week.map(day => (
                    <div key={day.date} className={day.isWeekend || day.isHoliday ? 'opacity-50' : ''}>
                      {/* Header */}
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
                          {day.slots.map(t => {
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
                                <Clock className={`w-3 h-3 mx-auto mb-1 ${selected && 'text-primary-foreground'}`} />
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

        {/* Selected summary */}
        {selectedTimes.length > 0 && (
          <div className="mt-6 p-4 info-box rounded-lg">
            <p className="text-sm font-medium mb-2">
              زمان‌های انتخاب شده ({selectedTimes.length} مورد):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTimes.map(sel => {
                const [date, time] = sel.split('-');
                const slot = timeSlots.find(s => s.date === date);
                const info = slot?.slots.find(s => s.time === time);
                return (
                  <span key={sel} className="time-pill">
                    {slot?.dayName} {date} - {info?.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">توضیحات اضافی (اختیاری)</h3>
        </div>
        <textarea
          rows={4}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          className="form-textarea"
          placeholder="در صورت نیاز، توضیحات یا محدودیت‌های زمانی خود را اینجا بنویسید..."
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || selectedTimes.length === 0}
        className="w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 btn-primary
                   enabled:hover:scale-105 transition-transform"
      >
        <Send className="w-5 h-5" />
        {isSubmitting ? 'در حال ارسال...' : 'ثبت اطلاعات'}
      </button>

      {/* Feedback */}
      {submitMessage && (
        <div className={`p-4 rounded-lg text-center fade-in ${
          submitMessage.includes('موفقیت') ? 'message-success' : 'message-error'
        }`}>
          {submitMessage}
        </div>
      )}

      {/* Existing notice */}
      {existingResponse && (
        <div className="message-warning rounded-lg p-4 fade-in">
          <p className="text-sm">
            <strong>توجه:</strong> شما قبلاً این فرم را تکمیل کرده‌اید. در صورت ثبت مجدد، اطلاعات قبلی شما جایگزین خواهد شد.
          </p>
        </div>
      )}
    </form>
  );
}
