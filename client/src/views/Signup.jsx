import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextField, Button, Paper, Typography, Box, IconButton, InputAdornment ,CircularProgress} from '@mui/material';
import { Link } from 'react-router-dom';
import { signup } from '../redux/features/auth/authSlice';
import { motion } from 'framer-motion';
import { Visibility, VisibilityOff, Email, Lock, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Signup = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const loading = useSelector((state) => state.auth.loading);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      dispatch(signup(formData));
    } catch (error) {
      console.error('Signup failed:', error);
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
              <div className="w-20 h-20 bg-gradient-to-tr from-green-500 to-green-400 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg">
                <Person className="text-white text-3xl" />
              </div>
            </motion.div>
            <Typography variant="h4" className="text-amber-900 font-bold tracking-wide">
              Create Account
            </Typography>
            <Typography variant="body2" className="text-amber-700">
              Join us today and start your journey
            </Typography>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              fullWidth
              required
              label="Full Name"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              helperText="Please enter your full name as per documents"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: 'rgb(245, 124, 0)' }} />
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
              label="Email Address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              helperText="We'll use this email for account verification"
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
              label="Create Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              helperText="Use 8+ characters with mix of letters, numbers & symbols"
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

            <TextField
              fullWidth
              required
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              helperText="Both passwords must match"
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                  py-3.5 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 
                  hover:shadow-green-500/20 hover:shadow-xl"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {loading ? <CircularProgress size={20} sx={{ color: '#138808' }} /> : "Sign Up"}
              </Button>
            </motion.div>
          </form>

          <Box className="text-center space-y-4 mt-8 pt-6 border-t border-amber-100">
            <Typography variant="body2" className="text-amber-800">
              Already have an account?{' '}
              <Link 
                to="/auth/login" 
                className="text-orange-600 hover:text-orange-700 font-semibold transition-all duration-200 
                  hover:underline decoration-2 underline-offset-4"
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </div>
  );
};

export default Signup;
