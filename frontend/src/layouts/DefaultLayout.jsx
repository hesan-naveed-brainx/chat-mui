import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import AppTheme from '../theme/AppTheme'
const DefaultLayout = () => {
    return (
        <AppTheme>
            <Box className="app">
                <div className="content-container">
                    <Outlet />
                </div>
            </Box>
        </AppTheme>
    );
};

export default DefaultLayout;