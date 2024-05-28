// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());


mongoose.connect("mongodb://localhost:27017/dbjob", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.use(bodyParser.json());

const JobSchema = new mongoose.Schema({
  jobid: { type: Number, unique: true },
  jobTitle: String,
  companyName: String,
  salary: Number,
  jobDescription: String,
});

const JobModel = mongoose.model('Job', JobSchema);


// GET 
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await JobModel.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
});


// GET ID
app.get('/api/getid/:id', async (req, res) => {
  try {
    const jobid = req.params.id;

    const job = await JobModel.findOne({ jobid });

    if (!job) {
      return res.status(404).json({error:'Job not found'});
    }

    console.log(job);
    res.json(job);
  } catch (err) {
    res.status(500).json({error:err.message});
  }
});


// POST
app.post('/api/jobs', async (req, res) => {
  console.log(res);
  try {
    const { jobTitle, companyName, salary, jobDescription } = req.body;
    const randomJobId = Math.floor(Math.random() * 100);
    const newJob = new JobModel({
      jobid: randomJobId,
      jobTitle,
      companyName,
      salary,
      jobDescription,
    });
    await newJob.save();
    res.json({message: 'Job created successfully', job:newJob});
  } catch (err) {
    res.status(500).json({error:err.message});
  }
});


// PUT 
app.put('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { jobTitle, companyName, salary, jobDescription } = req.body;

    const updatedJob = await JobModel.findByIdAndUpdate(jobId, {
      jobTitle,
      companyName,
      salary,
      jobDescription,
    }, { new: true });

    if (!updatedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job updated successfully', job: updatedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// DELETE 
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    const deletedJob = await JobModel.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully', job: deletedJob });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
