import { useState } from 'react';
import { Box, Typography, Paper, Grid, TextField, Button, Alert } from '@mui/material';
import { motion } from 'framer-motion';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
}

const Home = () => {
  const [matches, setMatches] = useState<Match[]>([
    { id: 1, homeTeam: "Левски", awayTeam: "ЦСКА", date: "2024-03-22", time: "17:30" },
    { id: 2, homeTeam: "Лудогорец", awayTeam: "Ботев Пд", date: "2024-03-22", time: "20:00" },
    { id: 3, homeTeam: "Черно море", awayTeam: "Локомотив Пд", date: "2024-03-23", time: "18:45" },
  ]);

  const [predictions, setPredictions] = useState<Record<number, { home: string; away: string }>>({});
  const [error, setError] = useState<string | null>(null);

  const handlePredictionChange = (matchId: number, team: 'home' | 'away', value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    setPredictions(prev => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: value
      }
    }));
  };

  const handleSubmit = async (matchId: number) => {
    try {
      const prediction = predictions[matchId];
      if (!prediction?.home || !prediction?.away) {
        throw new Error("Моля, въведете и двата резултата");
      }

      // TODO: Implement API call
      console.log(`Submitting prediction for match ${matchId}:`, prediction);
      
      // Clear prediction after successful submission
      setPredictions(prev => {
        const newPredictions = { ...prev };
        delete newPredictions[matchId];
        return newPredictions;
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Възникна грешка");
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Днешни Мачове
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {matches.map(match => (
            <Grid item xs={12} sm={6} md={4} key={match.id}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Typography variant="h6" align="center">
                  {match.date} - {match.time}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Typography>{match.homeTeam}</Typography>
                  <TextField
                    size="small"
                    sx={{ width: 60 }}
                    value={predictions[match.id]?.home || ''}
                    onChange={(e) => handlePredictionChange(match.id, 'home', e.target.value)}
                  />
                  <Typography>:</Typography>
                  <TextField
                    size="small"
                    sx={{ width: 60 }}
                    value={predictions[match.id]?.away || ''}
                    onChange={(e) => handlePredictionChange(match.id, 'away', e.target.value)}
                  />
                  <Typography>{match.awayTeam}</Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleSubmit(match.id)}
                >
                  Залагай
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </motion.div>
  );
};

export default Home; 