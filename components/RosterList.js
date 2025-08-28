import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from 'react';
import Image from 'next/image';

//Show simple information of the raider

export default function RosterList({ raider, onDelete }) {
  const [deleting, setDeleting] = useState(false);

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

  const getClassIcon = (className) => classIconMap[className] || "/unknown.png";

  const handleDelete = async (event) => {
    event.stopPropagation();
    if (!confirm(`Are you sure you want to delete ${raider.name}?`)) return;

    // Clear right panel immediately when delete
    if (typeof onDelete === "function") onDelete(raider.id, true);

    setDeleting(true);

    try {
      const res = await fetch(`/api/roster?id=${raider.id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => ({ message: 'Raider deleted successfully' }));

      if (!res.ok) {
        alert(data.error || 'Failed to delete raider');
      } else {
        alert(data.message || 'Raider deleted successfully');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete raider');
    } finally {
      setDeleting(false);
    }
  };

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
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={4}>
          {/* disabled={deleting} */}
          <IconButton onClick={handleDelete} disabled color="error">
            <ClearIcon />
          </IconButton>
          <Stack direction="row" alignItems={'center'}>
            <Image
              src={getClassIcon(raider.characterClass)}
              alt={raider.characterClass}
              width={25}
              height={25}
            />
            <Typography variant="h6" sx={{ml:2}}>{raider.name}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={1}>
            <Stack direction="column" alignItems="center">
              <Typography variant="body2">Item Level</Typography>
              <Typography variant="h6" color="text.secondary">
                {raider.currentIlvl ?? 0}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
