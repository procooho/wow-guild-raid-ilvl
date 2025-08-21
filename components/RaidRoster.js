import { useState } from 'react';

import Typography from '@mui/material/Typography';
import Individual from './Individual';
import { TextField } from '@mui/material';

export default function RaidRoster({ roster }) {
  const [search, setSearch] = useState('')

  return <>
    <Typography
      variant="h4"
      sx={{ paddingTop: 2, paddingBottom: 2 }}
    >
      Current Guild Roster
    </Typography>
    <TextField
      label="Search"
      fullWidth
      sx={{width: '40%', marginBottom: 2}}
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
    {roster.filter((raider) => {
      if (search == '') {
        return true
      }
      return raider.name.toLowerCase().includes(search.toLowerCase())
    }).map((raider) => {
      return <Individual
        key={raider.id}
        raider={raider}
      />
    })}
  </>

}