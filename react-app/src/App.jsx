import { useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Projects from './components/Projects';
import BioCta from './components/BioCta';
import Feed from './components/Feed';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';

function App() {
  const [isContactPage, setIsContactPage] = useState(false);

  const showContact = () => {
    setIsContactPage(true);
    window.scrollTo(0, 0);
  };

  const showMain = () => {
    setIsContactPage(false);
    window.scrollTo(0, 0);
  };

  const navigateToSection = (sectionId) => {
    showMain();
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <Nav
        isContactPage={isContactPage}
        onShowContact={showContact}
        onShowMain={showMain}
        onNavigateToSection={navigateToSection}
      />

      <main
        id="mainContent"
        style={{ display: isContactPage ? 'none' : 'block' }}
      >
        <Hero />
        <Statement />
        <Projects />
        <BioCta />
        <Feed />
      </main>

      <ContactPage isActive={isContactPage} />

      <Footer onShowContact={showContact} onNavigateToSection={navigateToSection} />
    </>
  );
}

export default App;
