export const BASE_URL = "http://localhost:3000"

export const getRoster  = async () => {
  const response = await fetch(`${BASE_URL}/api/roster`);
  const data = await response.json();
  return data;
}