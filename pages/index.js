import NavBar from "@/components/NavBar";
import { Button, Link, Stack } from "@mui/material";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <NavBar />
      <Stack direction="column" justifyContent="center" alignItems="center" gap={10} sx={{ mt: 10 }}>
        <Image
          src="/logo.png"
          alt="Logo"
          width={600}
          height={300}
        />
        <Stack direction="row" justifyContent="center" alignItems="center" gap={10}>
          <Link href={"/currentGuildRoster"}>
            <Button variant="contained">Manage Guild Raid Roster</Button>
          </Link>
        </Stack>
      </Stack>
    </main>
  );
}
