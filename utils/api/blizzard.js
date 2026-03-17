require('dotenv').config();

// Get Blizzard OAuth Token

let cachedToken = null;
let tokenExpiry = null;

export async function getBlizzardToken() {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  //if there's saved token, token is not expired when its exist, use saved token, or get new one
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    console.log('🔑 Using cached Blizzard token');
    return cachedToken;
  }

  //throw error when any credential is missing
  if (!clientId || !clientSecret) {
    console.error('❌ Blizzard credentials missing! CLIENT_ID:', !!clientId, 'CLIENT_SECRET:', !!clientSecret);
    throw new Error("Blizzard credentials missing!");
  }

  console.log('🔑 Fetching new Blizzard token...');

  //get new token
  const res = await fetch("https://oauth.battle.net/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await res.json();

  if (!res.ok || !data.access_token) {
    console.error('❌ Failed to get Blizzard token:', data);
    throw new Error("Failed to get Blizzard token");
  }

  //save token for future use
  cachedToken = data.access_token;
  //get expiry and change to seconds by *1000, -30000 to get new token before expire
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 30000;

  console.log('✅ Blizzard token obtained successfully');
  return cachedToken;
}


//Get character profile

export async function getCharacterProfile(realm, name) {
  const token = await getBlizzardToken();

  // Get api using token
  const res = await fetch(
    `https://us.api.blizzard.com/profile/wow/character/${realm.toLowerCase()}/${name.toLowerCase()}?namespace=profile-us&locale=en_US`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  // Show error
  if (!res.ok) {
    console.error("Blizzard API response:", res.status, await res.text());
    return null;
  }

  const data = await res.json();

  return {
    name: data.name,
    faction: data.faction?.name ?? "Unknown",
    characterClass: data.character_class?.name ?? "Unknown",
    race: data.race?.name ?? "Unknown",
    averageItemLevel: data.average_item_level ?? 0
  };
}

// Get guild roster
export async function getGuildRoster(realm, guildName) {
  const token = await getBlizzardToken();

  const realmSlug = realm.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
  const guildSlug = guildName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');

  const res = await fetch(
    `https://us.api.blizzard.com/data/wow/guild/${realmSlug}/${guildSlug}/roster?namespace=profile-us&locale=en_US`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    console.error("Blizzard API Guild response:", res.status, await res.text());
    return null;
  }

  const data = await res.json();
  
  if (!data.members) return [];

  return data.members.map(m => m.character.name);
}