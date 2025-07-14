/* app/fonts.ts (new file) */
import { Vazirmatn } from 'next/font/google';

export const vazir = Vazirmatn({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '700'],
  display: 'swap',          // prevents FOIT
});
