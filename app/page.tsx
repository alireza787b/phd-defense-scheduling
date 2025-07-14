import Link from 'next/link';
import { JUDGES_DB } from '@/lib/judges';
import Footer from '@/components/Footer';

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3020';
  
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
          سیستم هماهنگی جلسه دفاع دکتری
        </h1>
        
        <div className="card-elevated rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">لینک‌های داوران:</h2>
          <div className="space-y-4">
            {JUDGES_DB.map(judge => (
              <div key={judge.id} className="border border-border rounded-lg p-4 bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <p className="font-medium mb-2 text-foreground">{judge.name} - {judge.role}</p>
                <div className="bg-card p-3 rounded text-sm font-mono break-all text-muted-foreground border border-border">
                  {baseUrl}/judge/{judge.id}
                </div>
                <Link 
                  href={`/judge/${judge.id}`}
                  className="link-primary text-sm mt-2 inline-block font-medium"
                  target="_blank"
                >
                  باز کردن لینک ←
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 message-warning rounded-lg p-4">
          <p className="text-sm">
            <strong>توجه:</strong> این صفحه فقط برای مدیریت سیستم است. 
            لینک‌های بالا را برای داوران ارسال کنید.
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
}