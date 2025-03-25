import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowForward, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 20,
    padding: theme.spacing(2),
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    minWidth: '600px',
    maxWidth: '90vw',
    position: 'relative',
    zIndex: 1,
    [theme.breakpoints.down('sm')]: {
      minWidth: 'unset',
      margin: theme.spacing(2),
    },
  },
}));

const AnimatedButton = styled(Button)`
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  background: linear-gradient(45deg, #2196F3, #1976D2);
  height: 44px;
  font-size: 1rem;
  
  &:hover {
    background: linear-gradient(45deg, #1976D2, #2196F3);
  }

  &:disabled {
    background: #e0e0e0;
  }
`;

const StyledPhoneInput = styled(Box)(({ theme }) => ({
  '& .react-tel-input': {
    width: '100%',
    position: 'relative',
    zIndex: 9999,
    '& .form-control': {
      width: '100%',
      height: '48px',
      borderRadius: '8px',
      fontSize: '1rem',
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.divider}`,
      paddingLeft: '48px',
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
      '&:focus': {
        borderColor: theme.palette.primary.main,
        boxShadow: 'none',
        borderWidth: '2px',
      },
    },
    '& .country-list': {
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      maxHeight: '300px',
      position: 'absolute',
      zIndex: 99999,
      '& .country': {
        padding: '8px 16px',
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
      },
    },
    '& .selected-flag': {
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
      '&:hover, &:focus': {
        backgroundColor: 'transparent',
      },
    },
  },
}));

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

export const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneSubmit = async () => {
    if (!phone || phone.length < 10) {
      setError('Моля, въведете валиден телефонен номер');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5003/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: '+' + phone }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('code');
        setError(null);
      } else {
        setError(data.message || 'Възникна грешка при изпращане на кода');
      }
    } catch (err) {
      console.error('Error sending code:', err);
      setError('Не може да се свърже със сървъра. Моля, проверете дали API сървърът работи.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!code.match(/^[0-9]{6}$/)) {
      setError('Кодът трябва да съдържа 6 цифри');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5003/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: '+' + phone, code }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        onClose();
        window.location.reload();
      } else {
        setError(data.message || 'Невалиден код');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Не може да се свърже със сървъра. Моля, проверете дали API сървърът работи.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <IconButton
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 2 }}
      >
        <Close />
      </IconButton>

      <DialogContent sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Typography variant="h5" gutterBottom align="center" sx={{ mb: 2, fontWeight: 600 }}>
              {step === 'phone' ? 'Влезте с телефон' : 'Въведете код'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {step === 'phone' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, position: 'relative', zIndex: 9999 }}>
                <StyledPhoneInput>
                  <PhoneInput
                    country={'bg'}
                    value={phone}
                    onChange={setPhone}
                    inputProps={{
                      required: true,
                      autoFocus: true,
                    }}
                    specialLabel=""
                    countryCodeEditable={false}
                    enableSearch
                    searchPlaceholder="Търсене на държава..."
                    searchNotFound="Не е намерена държава"
                    dropdownStyle={{ zIndex: 99999 }}
                  />
                </StyledPhoneInput>
                <AnimatedButton
                  variant="contained"
                  size="large"
                  onClick={handlePhoneSubmit}
                  disabled={isLoading}
                  endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                >
                  {isLoading ? 'Изпращане...' : 'Продължи'}
                </AnimatedButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <TextField
                  fullWidth
                  label="Код за потвърждение"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="XXXXXX"
                  autoFocus
                  disabled={isLoading}
                  size="medium"
                />
                <AnimatedButton
                  variant="contained"
                  size="large"
                  onClick={handleCodeSubmit}
                  disabled={isLoading}
                  endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
                >
                  {isLoading ? 'Проверка...' : 'Потвърди'}
                </AnimatedButton>
                <Button
                  variant="text"
                  onClick={() => {
                    setStep('phone');
                    setCode('');
                    setError(null);
                  }}
                  disabled={isLoading}
                  size="small"
                >
                  Назад
                </Button>
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </StyledDialog>
  );
}; 