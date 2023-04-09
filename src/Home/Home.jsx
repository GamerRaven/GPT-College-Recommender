import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import GitHubIcon from '@material-ui/icons/GitHub';
import Link from '@mui/material/Link';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    '& .MuiTextField-root, & .MuiSelect-root': {
      margin: theme.spacing(1),
      width: '100%',
      maxWidth: 300,
    },
    '& .MuiButton-root': {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      '& .MuiTextField-root, & .MuiSelect-root': {
        width: 'auto',
      },
    },
  },
  header: {
    position: 'relative',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  responseBox: {
    // Add your custom styles for the response box
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    borderRadius: theme.shape.borderRadius,
  },
}));

function Home() {
  const classes = useStyles();
  const [grade, setGrade] = useState('');
  const [gpa, setGPA] = useState('');
  const [location, setLocation] = useState('');
  const [major, setMajor] = useState('');
  const [hobby, setHobby] = useState('');
  const [achievements, setAchievements] = useState('');
  const [gradeError, setGradeError] = useState(false);
  const [gpaError, setGpaError] = useState(false);
  const [hobbyError, setHobbyError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleGPAChange = (event) => {
    setGPA(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleMajorChange = (event) => {
    setMajor(event.target.value);
  };

  const handleHobbyChange = (event) => {
    setHobby(event.target.value);
  };

  const handleAchievements = (event) => {
    setAchievements(event.target.value);
  };

  const [recommendationResult, setRecommendationResult] = useState([]);

  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setGradeError(!grade);
    setGpaError(!gpa);
    setHobbyError(!hobby);

    if (!grade || !gpa || !hobby) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    const cooldownInSeconds = 10 * 1000;
    if (now - lastSubmitTime < cooldownInSeconds) {
      setLoading(false);
      alert('Please wait for 10 seconds between requests.');
      return;
    }
    setLastSubmitTime(now);

    const prompt = `The user:
    - is in grade ${grade}
    - has a GPA of ${gpa}
    - has the following academic achievements: ${achievements}
    - has a hobby/interest in: ${hobby}` +
    (location ? `\n- prefers a school at ${location}` : '') +
    (major ? `\n- would like to study ${major}` : '') +
    `\nPlease provide a list of college recommendations separated by commas with no other text.`;    
  
    try {
      const response = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'YOUR API KEY',
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      });
  
      const data = await response.json();
      const text = data.choices[0].text.trim();
      const promptRegex = new RegExp(prompt.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'i');
      const filteredText = text.replace(promptRegex, '').trim();      
      const collegesArray = filteredText.split(/[\n,-]+/).map(college => college.trim()).filter(college => college);
      setRecommendationResult(collegesArray);
           
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false); // Add this line
    }
  };
   
  return (
    <div>
    <div className={classes.header}>
      <Typography component="h1" variant="h5">
        College Recommender
      </Typography>
      <Link href="https://github.com/GamerRaven/GPT-College-Recommender" target="_blank" color="inherit">
      <GitHubIcon
        style={{
        position: 'absolute',
        top: '50%',
        right: 40,
        transform: 'translateY(-50%)',
        }}
      />
      </Link>
    </div>
      <form className={classes.form} onSubmit={handleSubmit} style={{marginTop:"30px"}}>
      <Box
      sx={{
        marginTop: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
        <FormControl variant="outlined">
          <InputLabel id="grade-label">Grade</InputLabel>
          <Select
            labelId="grade-label"
            label="Grade"
            value={grade}
            onChange={handleGradeChange}
            style={{width:"100px",height:"60px"}}
          >
          <MenuItem value="7-8">7-8</MenuItem>
          <MenuItem value="9">9</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="11">11</MenuItem>
          <MenuItem value="12">12</MenuItem>
          </Select>
        </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
        <FormControl variant="outlined">
          <InputLabel id="gpa-label">GPA</InputLabel>
          <Select
            labelId="gpa-label"
            label="GPA"
            value={gpa}
            onChange={handleGPAChange}
            style={{width:"100px",height:"60px"}}
          >
          <MenuItem value="2.5 or lower">2.5 or lower</MenuItem>
          <MenuItem value="2.5 - 3.0">2.5 - 3.0</MenuItem>
          <MenuItem value="3.0 - 3.5">3.0 - 3.5</MenuItem>
          <MenuItem value="3.5 - 4.0">3.5 - 4.0</MenuItem>
          <MenuItem value="4.0 or higher">4.0 or higher</MenuItem>
        </Select>
        </FormControl>
        </Grid>
      </Grid>
      </Box>
        <TextField
          label="Prefered Location"
          variant="outlined"
          value={location}
          onChange={handleLocationChange}
          style={{ marginTop: '1rem' }}
          helperText="Leave blank if none"
        />
        <TextField
          label="Intended Major"
          variant="outlined"
          value={major}
          onChange={handleMajorChange}
          style={{ marginTop: '1rem' }}
          helperText="Leave blank if none"
        />
        <TextField
          label="Academic Achievements"
          variant="outlined"
          value={achievements}
          onChange={handleAchievements}
          style={{ marginTop: '1rem' }}
          helperText="Competitions, Standardized Testing Score, etc"
        />
        <TextField
          label="Hobbies / Interests"
          variant="outlined"
          value={hobby}
          onChange={handleHobbyChange}
          style={{ marginTop: '1rem' }}
        />
        {(gradeError || gpaError || hobbyError) && (
          <div style={{ marginTop: '1rem' }}>
            {gradeError && (
              <FormHelperText error>
                Please fill in the Grade field.
              </FormHelperText>
            )}
            {gpaError && (
              <FormHelperText error>
                Please fill in the GPA field.
              </FormHelperText>
            )}
            {hobbyError && (
              <FormHelperText error>
                Please fill in the Hobbies field.
              </FormHelperText>
            )}
          </div>
        )}
        <Button type="submit" variant="contained" color="primary">
          Get Recommendations
        </Button>
  </form>
  {loading && (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <CircularProgress />
      </div>
    )}
  <div
    style={{
      marginTop: '1rem',
      padding: '1rem',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
      maxWidth: '800px',
      margin: '1rem auto',
      marginTop: "25px",
    }}
  >
    <Typography variant="h6">College Recommendations:</Typography>
    {recommendationResult.length > 0 && (
    <ul>
      {recommendationResult.map((college, index) => (
        <li key={index}>
          <Typography variant="body1">{college}</Typography>
        </li>
      ))}
    </ul>)}
  </div>


    </div>
  );
}

export default Home;