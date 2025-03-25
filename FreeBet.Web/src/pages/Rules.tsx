import { Box, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import { motion } from 'framer-motion';

const Rules = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Правила
        </Typography>
        <Paper sx={{ p: 3, mt: 2 }}>
          <List>
            <ListItem>
              <ListItemText
                primary="1. Регистрация"
                secondary="За да участвате в играта, трябва да се регистрирате с валиден телефонен номер."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Залози"
                secondary="Можете да правите прогнози за резултатите от мачовете до 5 минути преди началото им."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Точкуване"
                secondary="• Точен резултат: 3 точки
                          • Познат победител: 1 точка
                          • Грешна прогноза: 0 точки"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Класиране"
                secondary="Класирането се обновява автоматично след края на всеки мач."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="5. Награди"
                secondary="Наградите се раздават в края на всеки месец на първите трима в класирането."
              />
            </ListItem>
          </List>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default Rules; 