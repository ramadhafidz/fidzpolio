import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Work } from '@/components/sections/Work';
import { Capabilities } from '@/components/sections/Capabilities';
import { ContactCTA } from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Work />
      <Capabilities />
      <ContactCTA />
    </main>
  );
}
