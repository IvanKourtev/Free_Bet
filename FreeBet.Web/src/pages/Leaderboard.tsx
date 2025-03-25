import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  position: number;
  username: string;
  points: number;
  correctPredictions: number;
}

const mockData: LeaderboardEntry[] = [
  { position: 1, username: "Иван", points: 150, correctPredictions: 15 },
  { position: 2, username: "Мария", points: 140, correctPredictions: 14 },
  { position: 3, username: "Георги", points: 130, correctPredictions: 13 },
];

const Leaderboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Класиране
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Позиция</TableCell>
                <TableCell>Потребител</TableCell>
                <TableCell align="right">Точки</TableCell>
                <TableCell align="right">Познати</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mockData.map((entry) => (
                <TableRow
                  key={entry.position}
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell component="th" scope="row">
                    {entry.position}
                  </TableCell>
                  <TableCell>{entry.username}</TableCell>
                  <TableCell align="right">{entry.points}</TableCell>
                  <TableCell align="right">{entry.correctPredictions}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </motion.div>
  );
};

export default Leaderboard; 