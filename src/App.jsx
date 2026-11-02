import { useState } from "react";
import StructureLibrary from "./components/StructureLibrary";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MolecularLab from "./components/MolecularLab";
import Essentials from "./components/Essentials";
import RnaTypes from "./components/RnaTypes";
import Sources from "./components/Sources";
import Footer from "./components/Footer";

export default function App() {
  const [selectedStructure, setSelectedStructure] = useState(null);
  return (
    <>
      <a className="skip-link" href="#contenido">
        Skip to content
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>
        <Hero />
        <div className="reading-strip page-width">
          <p>
            <span className="eyebrow">The starting idea</span> Sequence matters.{" "}
            <em>So does shape.</em>
          </p>
          <span className="strip-mark" aria-hidden="true">
            A — U &nbsp; G — C
          </span>
        </div>
        <MolecularLab
          selectedStructure={selectedStructure}
          onSelectStructure={setSelectedStructure}
        />
        <Essentials />
        <RnaTypes />
        <StructureLibrary
          selectedStructure={selectedStructure}
          onSelectStructure={setSelectedStructure}
        />
        <Sources />
      </main>
      <Footer />
    </>
  );
}
