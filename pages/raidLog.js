import LeftNav from '@/components/LeftNav'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Box, Stack, Typography } from '@mui/material'
import React from 'react'

export default function raidLog() {
    return (
        <ProtectedRoute>
            <Box sx={{ display: 'flex' }}>
                <LeftNav />
                <Stack>
                    <Typography variant='h2' sx={{ textAlign: 'center', color: 'black' }}>
                        Page for Raid Log Link / Raid Recodeings
                    </Typography>
                    <Typography variant='h3' sx={{ textAlign: 'center', mt: 10, color: 'black' }}>
                        ====================
                    </Typography>
                    <Typography variant='h3' sx={{ textAlign: 'center', color: 'black' }}>
                        Under Construction!!
                    </Typography>
                    <Typography variant='h3' sx={{ textAlign: 'center', color: 'black' }}>
                        ====================
                    </Typography>
                </Stack>
            </Box>
        </ProtectedRoute>
    );
}