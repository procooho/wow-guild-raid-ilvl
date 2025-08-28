export const getRoster = async () => {
  const response = await fetch(`${BASE_URL}/api/roster`);
  const data = await response.json();
  return data;
}

export const postRoster = async ({ name, server, role }) => {
  return fetch(`/api/roster`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name,
      server,
      role
    })
  }).then((response) => {
    return response.json()
  }).then((data) => {
    return Promise.resolve(data)
  })
}