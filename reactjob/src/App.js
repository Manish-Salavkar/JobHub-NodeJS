import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JobForm from './components/JobForm';
import JobListings from './components/JobListings';


function Home() {
  return (
    <div className='container'>
      <h1>JobHub</h1>
      <div className="App">
        <Link to="/job-form">
          <button>Create Job</button>
        </Link>
        <br></br><br></br>
        <Link to="/job-listings">
          <button>Show Jobs</button>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/job-form" element={<JobForm />} />
        <Route path="/job-listings" element={<JobListings />} />
      </Routes>
    </Router>
  );
}

export default App;
