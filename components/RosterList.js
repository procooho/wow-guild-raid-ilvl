import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function RosterList({ raider }) {
  return (
    <Card
      variant="outlined"
      sx={{
        marginBottom: 2,
        minWidth: 260,
        width: '100%',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={2}>
          <Typography variant="h6">{raider.name}</Typography>
          <Stack direction="column" alignItems="center">
            <Typography variant="body2">Item Level</Typography>
            <Typography variant="h6" color="text.secondary">
              {raider.currentIlvl ?? 0}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
