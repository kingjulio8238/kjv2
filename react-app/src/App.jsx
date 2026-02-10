import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Statement from './components/Statement';
import Projects from './components/Projects';
import BioCta from './components/BioCta';
import Feed from './components/Feed';
import Footer from './components/Footer';
import ContactPage from './components/ContactPage';
import BioPage from './components/BioPage';
import FeedPage from './components/FeedPage';
import FeedArticlePage from './components/FeedArticlePage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route
          path="/"
          element={
            <main id="mainContent">
              <Hero />
              <Statement />
              <Projects />
              <BioCta />
              <Feed />
              <Footer />
            </main>
          }
        />
        <Route path="/bio" element={<><BioPage /><Footer /></>} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feed" element={<><FeedPage /><Footer /></>} />
        <Route path="/feed/:slug" element={<><FeedArticlePage /><Footer /></>} />
      </Routes>
    </>
  );
}

export default App;
