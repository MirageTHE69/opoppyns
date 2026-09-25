import Nav from "@/components/shared/Nav";
import Footer from "@/components/shared/Footer";
import Marquee from "@/components/shared/Marquee";
import ScrollEffects from "@/components/shared/ScrollEffects";
import HeroIntro from "@/components/home/HeroIntro";
import Manifesto from "@/components/home/Manifesto";
import Atmosphere from "@/components/home/Atmosphere";
import Services from "@/components/home/Services";
import Quote from "@/components/home/Quote";
import HowWeThink from "@/components/home/HowWeThink";
import Work from "@/components/home/Work";
import Blog from "@/components/home/Blog";
import Contact from "@/components/home/Contact";
import { values } from "@/content/home";
import { site } from "@/content/site";

// Motion intensity: the design ships on "heavy".
//   subtle = reveal .5 / fx .5 / merge .6
//   noticeable = 1 / 1 / 1
//   heavy = 1.8 / 1.7 / 1.6
const MOTION = { reveal: 1.8, fx: 1.7, merge: 1.6 };

export default function HomePage() {
  return (
    <div
      className="root"
      style={
        {
          "--reveal-d": `${26 * MOTION.reveal}px`,
          "--rise-d": `${34 * MOTION.fx}px`,
        } as React.CSSProperties
      }
    >
      <ScrollEffects progress marquee parallax counter k={MOTION.fx} />
      <Nav talkHref="#contact" />
      <HeroIntro />
      <Manifesto />
      <Marquee words={values} />
      <Atmosphere />
      <Services />
      <Quote k={MOTION.merge} />
      <HowWeThink />
      <Work />
      <Blog />
      <Contact />
      <Footer
        links={[
          { label: "Back to top ↑", href: "#top" },
          { label: `${site.email} ↗`, href: `mailto:${site.email}` },
          { label: "Instagram ↗", href: site.instagram, external: true },
        ]}
      />
    </div>
  );
}
