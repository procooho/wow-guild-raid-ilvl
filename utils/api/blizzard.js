require('dotenv').config();

// Get Blizzard OAuth Token

let cachedToken = null;
let tokenExpiry = null;

export async function getBlizzardToken() {
  const clientId = process.env.BLIZZARD_CLIENT_ID;
  const clientSecret = process.env.BLIZZARD_CLIENT_SECRET;

  //if there's saved token, token is not expired when its exist, use saved token, or get new one
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  //throw error when any credential is missing
  if (!clientId || !clientSecret) {
    throw new Error("Blizzard credentials missing!");
  }

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

  //save token for future use
  cachedToken = data.access_token;
  //get expiry and change to seconds by *1000, -30000 to get new token before expire
  tokenExpiry = Date.now() + (data.expires_in * 1000) - 30000;

  return cachedToken;
}


//Get character profile

export async function getCharacterProfile(realm, name) {

  //get token
  const token = await getBlizzardToken();

  //get character data
  const res = await fetch(
    `https://us.api.blizzard.com/profile/wow/character/${realm.toLowerCase()}/${name.toLowerCase()}?namespace=profile-us&locale=en_US`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  //show error if data cannot be retrieved
  if (!res.ok) {
    const text = await res.text();
    console.error("Blizzard API response:", res.status, text);
    throw new Error(`Failed to fetch character profile for ${name} on ${realm}`);
  }

  const data = await res.json();

  return {
    name: data.name,
    faction: data.faction.name,
    characterClass: data.character_class.name,
    race: data.race?.name,
    averageItemLevel: data.average_item_level
  };
}