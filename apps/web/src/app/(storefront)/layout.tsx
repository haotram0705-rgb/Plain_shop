import '../globals.css';
import './homepage-reference.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { ContactWidget } from '@/components/layout/ContactWidget';
import { ThemeRuntime } from '@/components/layout/ThemeRuntime';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <ThemeRuntime />
      <Header />
      <main>{children}</main>
      <ContactWidget />
      <Footer />
      <MobileTabBar />
    </div>
  );
}
