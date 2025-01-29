import SignInContainer from '../components/SignInContainer/SignInContainer'
import Card from '../components/Card/Card'
import { Typography, Divider, TextField, Button } from '@mui/material'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = () => {
        console.log('Register')
    }

    return (
        <SignInContainer direction="column" justifyContent="space-between">
            <Card sx={{ backgroundColor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" align="center">Chat MUI</Typography>
                <Divider sx={{ width: '100%' }} />  
                <Typography variant="h5" align="center">Register</Typography>
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    error={emailError}
                    helperText={emailErrorMessage}
                />
                <TextField
                    id="username"
                    label="Username"
                    type="text"
                    error={usernameError}
                    helperText={usernameErrorMessage}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    error={passwordError}
                    helperText={passwordErrorMessage}
                />
                <TextField
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    error={confirmPasswordError}
                    helperText={confirmPasswordErrorMessage}
                />
                <Button variant="contained" onClick={handleSubmit}>Register</Button>
                <Divider sx={{ width: '100%' }} />
                <Typography variant="p" align="center" fontSize={14}>Already have an account? <Link to="/">Login</Link></Typography>
            </Card>
        </SignInContainer>
    );
};

export default Register;