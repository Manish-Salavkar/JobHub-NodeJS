import React, { useEffect, useState } from 'react';

function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {

    fetchJobs();
    }, []);

    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs', {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
          console.log('Job data fetched:', data);
        } else {
          console.error('Failed to fetch job data');
        }
      } catch (err) {
        console.error('Error:', err);
      }
    };

    // fetchJobs();

  const handleJobItemClick = (jobId) => {
    setSelectedJob(jobs.find(job => job._id === jobId));
    setShowOverlay(true);
  };

  const handleCloseWidget = () => {
    setSelectedJob(null);
    setShowOverlay(false);
  };

  const handleUpdateJob = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${selectedJob._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedJob),
      });
      if (response.ok) {
        console.log('Job updated successfully');
        handleCloseWidget();
        fetchJobs();
      } else {
        console.error('Failed to update job');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDeleteJob = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${selectedJob._id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        console.log('Job deleted successfully');
        handleCloseWidget();
        fetchJobs();
      } else {
        console.error('Failed to delete job');
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedJob(prevJob => ({
      ...prevJob,
      [name]: value,
    }));
  };

  return (
    <div>
      <h1>Job Listings</h1>
      <div className='job-listings-container'>
        {jobs.map((job) => (
          <div key={job._id} className='job-item' onClick={() => handleJobItemClick(job._id)}>
            <h2>{job.jobTitle}</h2>
            <p>Company: {job.companyName}</p>
            <p>Salary: {job.salary}</p>
            <p>Description: {job.jobDescription}</p>
          </div>
        ))}
      </div>
      {showOverlay && <div className='overlay' onClick={handleCloseWidget}></div>}
      {selectedJob && (
        <div className='job-widget'>
          <div className='widget-head'>
            <h2>Edit/Delete Job</h2>
            <button onClick={handleCloseWidget} className='close'>X</button>
          </div>
          <form>
            <label htmlFor="jobTitle">Job Title:</label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={selectedJob.jobTitle}
              onChange={handleChange}
            />

            <label htmlFor="companyName">Company Name:</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={selectedJob.companyName}
              onChange={handleChange}
            />

            <label htmlFor="salary">Salary:</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={selectedJob.salary}
              onChange={handleChange}
            />

            <label htmlFor="jobDescription">Job Description:</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={selectedJob.jobDescription}
              onChange={handleChange}
            ></textarea>
            <button type="button" onClick={handleUpdateJob}>Update</button>
            <button type="button" onClick={handleDeleteJob}>Delete</button>
          </form>
        </div>
      )}
    </div>
    
  );
}

export default JobListings;
