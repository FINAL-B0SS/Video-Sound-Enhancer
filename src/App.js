import './App.css';
import React from 'react';
import Header from "./components/Header"
import Footer from "./components/Footer"
import PlayerContainer from './PlayerContainer'

function App() {
  return (
    <div className="App">
      <Header />
      <PlayerContainer />
      <Footer />
    </div>
  );
}

export default App;
