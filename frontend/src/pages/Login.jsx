import { Box, Typography, TextField, Button, Divider } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import SignInContainer from '../components/SignInContainer/SignInContainer'
import Card from '../components/Card/Card'
import { Link } from 'react-router-dom'
const Login = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [open, setOpen] = useState(false);


    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = (event) => {
        if (emailError || passwordError) {
          event.preventDefault();
          return;
        }
        const data = new FormData(event.currentTarget);
        console.log({
          email: data.get('email'),
          password: data.get('password'),
        });
    };

    const validateInputs = () => {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
    
        let isValid = true;
    
        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    
        return isValid;
    };

    return (
        <SignInContainer direction="column" justifyContent="space-between">
            <Card sx={{ backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" align="center">Chat MUI</Typography>
                <Divider sx={{ width: '100%' }} />  
                <Typography variant="h5" align="center">Login</Typography>
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    error={emailError}
                    helperText={emailErrorMessage}
                    onChange={(event) => setEmail(event.target.value)}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button variant="contained" onClick={handleSubmit}>Login</Button>

                <Divider sx={{ width: '100%' }} />
                <Typography variant="p" align="center" fontSize={14}>Don't have an account? <Link to="/register">Register</Link></Typography>
                <Typography variant="p" align="center" fontSize={14}>Forgot your password? <Link to="/reset-password">Reset Password</Link></Typography>
            </Card>
        </SignInContainer>
    );
};

export default Login;