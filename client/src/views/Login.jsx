import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Paper, Typography, Box, IconButton, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import { login } from '../redux/features/auth/authSlice';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';

const Login = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(login(formData));
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-400 via-amber-300 to-green-400 rounded-2xl blur-xl opacity-20"></div>
        <Paper className="w-full relative backdrop-blur-sm bg-white/95 p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-amber-100">
          <div className="text-center space-y-3 mb-8">
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                <Lock className="text-white text-3xl" />
              </div>
            </motion.div>
            <Typography variant="h4" className="text-amber-900 font-bold tracking-wide">
              Welcome Back
            </Typography>
            <Typography variant="body2" className="text-amber-700">
              Enter your credentials to access your account
            </Typography>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              required
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              helperText="We'll never share your email with anyone else"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'rgb(245, 124, 0)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'rgb(120, 53, 15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease-in-out',
                  '& fieldset': { 
                    borderWidth: '1.5px',
                    borderColor: 'rgba(245, 124, 0, 0.3)',
                  },
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    '& fieldset': { borderColor: 'rgba(245, 124, 0, 0.5)' },
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-1px)',
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: 'rgb(245, 124, 0)',
                      boxShadow: '0 0 20px rgba(245, 124, 0, 0.15)',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgb(180, 83, 9)',
                  fontWeight: '500',
                  '&.Mui-focused': {
                    color: 'rgb(245, 124, 0)',
                    fontWeight: '600',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(120, 53, 15, 0.7)',
                  fontSize: '0.75rem',
                  marginTop: '6px',
                },
              }}
            />
            
            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              helperText="Password must be at least 8 characters long"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'rgb(22, 163, 74)' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      aria-label="toggle password visibility"
                      sx={{
                        color: 'rgb(22, 163, 74)',
                        '&:hover': {
                          color: 'rgb(34, 197, 94)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'rgb(120, 53, 15)',
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease-in-out',
                  '& fieldset': { 
                    borderWidth: '1.5px',
                    borderColor: 'rgba(22, 163, 74, 0.3)',
                  },
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    '& fieldset': { borderColor: 'rgba(22, 163, 74, 0.5)' },
                  },
                  '&.Mui-focused': {
                    transform: 'translateY(-1px)',
                    '& fieldset': {
                      borderWidth: '2px',
                      borderColor: 'rgb(22, 163, 74)',
                      boxShadow: '0 0 20px rgba(22, 163, 74, 0.15)',
                    },
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgb(22, 101, 52)',
                  fontWeight: '500',
                  '&.Mui-focused': {
                    color: 'rgb(22, 163, 74)',
                    fontWeight: '600',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: 'rgba(120, 53, 15, 0.7)',
                  fontSize: '0.75rem',
                  marginTop: '6px',
                },
              }}
            />

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 
                  py-3.5 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 
                  hover:shadow-orange-500/20 hover:shadow-xl"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Sign In
              </Button>
            </motion.div>
          </form>

          <div className="mt-8 pt-6 border-t border-amber-100">
            <div className="flex flex-col space-y-4 text-center">
              <Typography variant="body2" className="text-amber-800">
                Don't have an account?{' '}
                <Link 
                  to="/auth/signup" 
                  className="text-orange-600 hover:text-orange-700 font-semibold transition-all duration-200 
                    hover:underline decoration-2 underline-offset-4"
                >
                  Sign Up
                </Link>
              </Typography>
            </div>
          </div>
        </Paper>
      </motion.div>
    </div>
  );
};

export default Login;
