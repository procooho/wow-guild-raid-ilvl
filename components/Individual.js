import { useEffect, useState } from 'react';
import { Box, Card, Stack, Typography, Button, Select, MenuItem, Divider } from '@mui/material';
import Image from 'next/image';

//Show Individual Radier's Details

export default function Individual({ raider }) {
  const [raiderState, setRaider] = useState(raider);
  const [charInfo, setCharInfo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [editingRole, setEditingRole] = useState(false);
  const [newRole, setNewRole] = useState(raider?.role || 'DPS');

  const classIconMap = {
    Warrior: "/warrior.png",
    Paladin: "/paladin.png",
    Hunter: "/hunter.png",
    Rogue: "/rogue.png",
    Priest: "/priest.png",
    "Death Knight": "/deathknight.png",
    Shaman: "/shaman.png",
    Mage: "/mage.png",
    Warlock: "/warlock.png",
    Monk: "/monk.png",
    Druid: "/druid.png",
    "Demon Hunter": "/demonhunter.webp",
    Evoker: "/evoker.webp",
  };

  const roleDisplayMap = {
    TANK: "TANK",
    HEALER: "HEALER",
    MELEEDPS: "MELEE DPS",
    RANGEDPS: "RANGE DPS",
  };

  const getClassIcon = (className) => classIconMap[className] || "/unknown.png";

  useEffect(() => {
    setRaider({
      ...raider,
      role: raider?.role || 'DPS',
    });
    setNewRole(raider?.role || 'DPS');
    setProgress(null);
    setCharInfo(null);
  }, [raider]);

  // Fetch character info from API
  useEffect(() => {
    if (!raider?.name || !raider?.server) return;

    let isActive = true;

    async function fetchCharacterInfo() {
      try {
        const res = await fetch('/api/characterInfo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: raider.name,
            server: raider.server,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error(`Error fetching ${raider.name}:`, errorData.error);
          setCharInfo(null);
          return;
        }

        const data = await res.json();

        if (!isActive) return;

        // Ensure the raider has a role
        setRaider(prev => ({
          ...prev,
          history: data.raider.history,
          role: prev.role || 'DPS',
        }));
        setCharInfo(data.profile);

        // Calculate ilvl progress
        if (data.raider.history?.length >= 2) {
          const diff = data.raider.history[0].ilvl - data.raider.history[1].ilvl;
          setProgress(diff);
        } else {
          setProgress(null);
        }
      } catch (err) {
        if (!isActive) return;
        console.error('Fetch failed:', err);
        setCharInfo(null);
      }
    }

    fetchCharacterInfo();

    return () => { isActive = false };
  }, [raider]);

  //change role and update database
  const handleRoleChange = async () => {
    if (!newRole) return;

    try {
      const res = await fetch(`/api/raider/${raiderState.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Error updating role:', text);
        alert(`Failed to update role: ${text}`);
        return;
      }

      const updatedRaider = await res.json();
      setRaider(prev => ({ ...prev, role: updatedRaider.role }));
      setEditingRole(false);
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Error updating role. See console for details.');
    }
  };

  //failed to get data doesn't cause error, show unknown instead

  if (!raiderState) return null;

  const faction = charInfo?.faction || 'Unknown';
  const characterClass = charInfo?.characterClass || 'Unknown';
  const race = charInfo?.race || 'Unknown';

  //show last check date

  const lastCheckedDate = (() => {
    const recentHistory = raiderState?.history?.[0];
    if (!recentHistory?.recordedAt) return 'Unknown';
    return new Date(recentHistory.recordedAt).toLocaleString();
  })();

  // Link for related sites
  const armoryLink = `https://worldofwarcraft.com/en-us/character/us/${raiderState.server.toLowerCase()}/${raiderState.name.toLowerCase()}`;
  const wclLink = `https://www.warcraftlogs.com/character/us/${raiderState.server.toLowerCase()}/${raiderState.name.toLowerCase()}`;
  const raiderIoLink = `https://raider.io/characters/us/${raiderState.server.toLowerCase()}/${raiderState.name.toLowerCase()}`;

  return (
    <Card variant="outlined" sx={{ minWidth: 400, width: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems={'center'}>
            <Image
              src={getClassIcon(characterClass)}
              alt={characterClass}
              width={30}
              height={30}
            />
            <Typography variant="h6" sx={{ ml: 2 }}>{raiderState.name}</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">{raiderState.server}</Typography>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, mb: 2 }}>
          <Stack direction="column" alignItems="center">
            <Typography variant="body1">Role</Typography>
            <Typography variant="body2" color="text.secondary">{roleDisplayMap[raiderState.role]}</Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>Class</Typography>
            <Typography variant="body2" color="text.secondary">{characterClass}</Typography>
          </Stack>

          <Stack direction="column" alignItems="center">
            <Typography variant="body1">Race</Typography>
            <Typography variant="body2" color="text.secondary">{race}</Typography>

            <Typography variant="body1" sx={{ mt: 2 }}>Faction</Typography>
            <Typography variant="body2" color="text.secondary">{faction}</Typography>
          </Stack>

          <Stack direction="column" alignItems="center">
            <Typography variant="h5">Item Level</Typography>
            <Typography variant="body2" color="text.secondary">{raiderState.currentIlvl ?? 0}</Typography>

            {progress !== null && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Since last check
                </Typography>
                <Typography variant="body2">
                  ({raiderState?.history?.[1]?.recordedAt
                    ? new Date(raiderState.history[1].recordedAt).toLocaleDateString()
                    : "N/A"}):
                </Typography>
                <Typography variant="body2" color={progress >= 0 ? 'green' : 'red'}>
                  {progress >= 0 ? `+${progress}` : progress}
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
        <Divider />
        <Typography variant="body1" sx={{ mt: 2 }}>Links</Typography>
        <Stack direction="row" justifyContent={'space-between'} spacing={1} sx={{ mt: 2, mb: 2 }}>
          <Button variant="outlined" size="small" href={armoryLink} target="_blank" sx={{
            border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff', '&:hover': {
              backgroundColor: '#c9c9c9ff',
              color: '#111'
            },
          }}>WoW Armory</Button>
          <Button variant="outlined" size="small" href={wclLink} target="_blank" sx={{
            border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff', '&:hover': {
              backgroundColor: '#c9c9c9ff',
              color: '#111'
            },
          }}>WCL</Button>
          <Button variant="outlined" size="small" href={raiderIoLink} target="_blank" sx={{
            border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff', '&:hover': {
              backgroundColor: '#c9c9c9ff',
              color: '#111'
            },
          }}>Raider.IO</Button>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>Edit Role</Typography>
        <Stack direction="column" spacing={1} sx={{ mb: 2 }}>
          {editingRole && (
            <Select value={newRole} onChange={(e) => setNewRole(e.target.value)} size="small">
              <MenuItem value="TANK">Tank</MenuItem>
              <MenuItem value="MELEEDPS">MELEE DPS</MenuItem>
              <MenuItem value="RANGEDPS">RANGE DPS</MenuItem>
              <MenuItem value="HEALER">Healer</MenuItem>
            </Select>
          )}
          {editingRole && <Button size="small" variant="contained" onClick={handleRoleChange} sx={{
            border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff', '&:hover': {
              backgroundColor: '#c9c9c9ff',
              color: '#111'
            },
          }}>Save</Button>}
          {editingRole && <Button size="small" variant="outlined" onClick={() => setEditingRole(false)} sx={{
            border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff', '&:hover': {
              backgroundColor: '#c9c9c9ff',
              color: '#111'
            },
          }}>Cancel</Button>}
          {!editingRole && <Button variant="outlined" size="small" onClick={() => setEditingRole(true)} sx={{
            border: '2px solid', backgroundColor: '#1E1E1E', color: '#fff',
            '&:hover': {
              backgroundColor: '#c9c9c9ff',
              color: '#111'
            }, '&.Mui-disabled': {
              backgroundColor: '#555',
              color: '#fff',
            },
          }}>Edit Role</Button>}
        </Stack>
        <Divider />
        <Typography variant="caption" sx={{ mt: 2, display: 'block', textAlign: 'right' }}>
          Recently checked: {lastCheckedDate}
        </Typography>
      </Box>
    </Card>
  );
}
