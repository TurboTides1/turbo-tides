import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Services from "@/components/landing/Services";
import InstructorCards from "@/components/landing/InstructorCards";
import Location from "@/components/landing/Location";
import CTA from "@/components/landing/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <InstructorCards />
      <Location />
      <CTA />
    </>
  );
}
