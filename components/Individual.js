import { useEffect, useState } from 'react';
import { Box, Card, Stack, Typography } from '@mui/material';

export default function Individual({ raider }) {
//get and show detail information of selected character

  const [charInfo, setCharInfo] = useState(null);
  const [progress, setProgress] = useState(null);

  //do nothing if name or server is not provided
  useEffect(() => {
    if (!raider?.name || !raider?.server) return;

    //get data from blizzard api
    async function fetchCharacterInfo() {
      try {
        const res = await fetch('/api/characterInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: raider.name,
            server: raider.server,
            role: raider.role,
          }),
        });

        //show error if failed
        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error fetching ${raider.name}:`, errorData.error);
          return;
        }

        //put data into state
        const data = await res.json();
        setCharInfo(data.profile);

        //ilvl history
        if (data.raider.history?.length >= 2) {
          const diff = data.raider.history[0].ilvl - data.raider.history[1].ilvl;
          setProgress(diff);
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    }

    fetchCharacterInfo();
  }, [raider]);

  if (!raider) return null;

  return (
    <Card variant="outlined" sx={{ minWidth: 400, width: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{raider.name}</Typography>
          <Typography variant="body2" color="text.secondary">{raider.server}</Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mt: 2 }}>
          {/* Role & Class */}
          <Stack direction="column" alignItems="center">
            <Typography variant="body1">Role</Typography>
            <Typography variant="body2" color="text.secondary">{raider.role}</Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>Class</Typography>
            <Typography variant="body2" color="text.secondary">{charInfo?.characterClass || 'Unknown'}</Typography>
          </Stack>

          {/* Race & Faction */}
          <Stack direction="column" alignItems="center">
            <Typography variant="body1">Race</Typography>
            <Typography variant="body2" color="text.secondary">{charInfo?.race || 'Unknown'}</Typography>

            <Typography variant="body1" sx={{ mt: 1 }}>Faction</Typography>
            <Typography variant="body2" color="text.secondary">{charInfo?.faction || 'Unknown'}</Typography>
          </Stack>

          {/* Item Level */}
          <Stack direction="column" alignItems="center">
            <Typography variant="h5">Item Level</Typography>
            <Typography variant="body2" color="text.secondary">{raider.currentIlvl ?? 0}</Typography>

            {progress !== null && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>Since last check:</Typography>
                <Typography variant="body2" color={progress >= 0 ? 'green' : 'red'}>
                  {progress >= 0 ? `+${progress}` : progress}
                </Typography>
              </>
            )}

            {raider.lastChecked && (
              <Typography variant="caption" sx={{ mt: 1 }}>
                Last checked: {new Date(raider.lastChecked).toLocaleString()}
              </Typography>
            )}
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
