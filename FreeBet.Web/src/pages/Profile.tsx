import { Box, Typography, Paper, Grid, Avatar, Button } from '@mui/material';
import { motion } from 'framer-motion';

const Profile = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Моят Профил
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
              >
                И
              </Avatar>
              <Typography variant="h6">Иван Иванов</Typography>
              <Typography color="textSecondary">+359 888 123 456</Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Статистика
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4">150</Typography>
                      <Typography color="textSecondary">Точки</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4">15</Typography>
                      <Typography color="textSecondary">Познати</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h4">3</Typography>
                      <Typography color="textSecondary">Позиция</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              <Button variant="contained" color="primary" fullWidth>
                Редактирай профила
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default Profile; 