import { postRoster } from '@/utils/api/roster';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import { useState } from 'react';

//TODO
//Make Server Entry Select
//make wrong blizzare api request doesn't cause error, just skip
//Delete
//...
//...

export default function AddRaider() {

    const [name, setName] = useState("")
    const [server, setServer] = useState("")
    const [role, setRole] = useState("")

    const handleSubmit = (event) => {
        event.preventDefault()
        postRoster({
            name,
            server,
            role
        }).then((data) => {

        })
    }

    return (
        <Stack direction="column" justifyContent="space-between" alignItems="flex-start" sx={{ mt: 2 }}>
        <form
            onSubmit={handleSubmit}
        >
            
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            id="name"
                            name="name"
                            label="Character Name"
                            fullWidth
                            variant="standard"
                            value={name}
                            onChange={(event) => { setName(event.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <TextField
                            id="server"
                            name="server"
                            label="Server Name"
                            fullWidth
                            variant="standard"
                            value={server}
                            onChange={(event) => { setServer(event.target.value) }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <FormControl fullWidth>
                            <InputLabel id="role">Role</InputLabel>
                            <Select
                                labelId="role"
                                id="role"
                                value={role}
                                label="Role"
                                onChange={(event) => { setRole(event.target.value) }}
                            >
                                <MenuItem value="TANK">Tank</MenuItem>
                                <MenuItem value="DPS">DPS</MenuItem>
                                <MenuItem value="HEALER">HEALER</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Add New Raider
                        </Button>
                    </Grid>
                </Grid>
            
        </form>
        </Stack>
    );
}