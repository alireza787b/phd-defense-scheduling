'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getJudgeById } from '@/lib/judges';
import DefenseForm from '@/components/DefenseForm';
import AnimatedBackground from '@/components/AnimatedBackground';
import Footer from '@/components/Footer';
import { GraduationCap, MapPin } from 'lucide-react';

export default function JudgePage() {
  const { id } = useParams() as { id?: string };
  const router = useRouter();
  const [judge, setJudge] = useState<any>(null);
  const [existingResponse, setExistingResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.replace('/404');
      return;
    }

    // Load judge data
    const foundJudge = getJudgeById(id);
    if (!foundJudge) {
      router.replace('/404');
      return;
    }
    setJudge(foundJudge);

    // Check for existing response
    fetch(`/api/get-response?judgeId=${id}`)
      .then(res => res.json())
      .then(data => setExistingResponse(data))
      .catch(() => setExistingResponse(null))
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-xl text-foreground">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!judge) {
    // If somehow judge is still null after loading
    return null;
  }

const abstract = `
در این رساله، سامانه‌ای هوشمند برای «سنجش برخط هوشیاری و خستگی خدمهٔ پروازی» ارائه می‌شود.
سیستم پیشنهادی سه جریان داده—نشانه‌های فیزیولوژیک، الگو‌های رفتاری و شاخص‌های عملکردی—را به‌صورت زمانِ واقعی دریافت می‌کند و با استفاده از شبکه‌های یادگیری‌عمیق میزان خستگی را برآورد می‌کند.

نتایج آزمایش‌های پروازِ شبیه‌سازی‌شده نشان می‌دهد دقّت تشخیص به ٪۹۲ رسیده و هشدار کاهش هوشیاری تا ۱۵ دقیقه پیش از افت عملکرد فعال می‌شود.

همچنین چارچوب استقرار روی سامانه‌های هواگرد و ملاحظات ایمنی و امنیت سایبری تشریح شده است.
`.trim();



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            دانشگاه صنعتی شریف
          </h1>
          <h2 className="text-xl text-muted-foreground mb-6">
            دانشکده مهندسی هوافضا
          </h2>

          <div className="card-elevated rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <p className="text-lg text-foreground mb-2">
              {judge.name} عزیز، خوش آمدید
            </p>
            <p className="text-muted-foreground">
              لطفاً برای هماهنگی زمان جلسه دفاع دکتری فرم زیر را تکمیل فرمایید
            </p>
          </div>
        </header>

        {/* Thesis Info */}
        <section className="card-elevated rounded-2xl p-8 mb-8 fade-in">
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">عنوان رساله</h3>
          </div>

          <h4 className="text-xl font-semibold text-foreground mb-4 leading-relaxed">
            سنجش برخط هوشیاری و خستگی خدمه پروازی به کمک یادگیری ماشین
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <label className="text-sm text-muted-foreground">دانشجو:</label>
              <p className="font-medium text-foreground mt-1">علیرضا قادری</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <label className="text-sm text-muted-foreground">استاد راهنما:</label>
              <p className="font-medium text-foreground mt-1">دکتر فریبرز ثقفی</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h5 className="font-semibold text-foreground mb-3">چکیده:</h5>
            <p className="text-muted-foreground leading-relaxed text-justify">
              {abstract}
            </p>
          </div>
        </section>

        {/* Meeting Details */}
        <section className="gradient-info rounded-xl p-6 mb-8 fade-in">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">محل برگزاری</h3>
          </div>
          <p className="text-foreground">
            دانشکده مهندسی هوافضا، دانشگاه صنعتی شریف
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            جلسه به صورت حضوری برگزار خواهد شد
          </p>
        </section>

        {/* Form */}
        <DefenseForm judge={judge} existingResponse={existingResponse} />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
