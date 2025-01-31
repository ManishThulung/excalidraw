export async function getShapes(roomId: string) {
  const res = await fetch(`http://localhost:4000/api/shapes/${roomId}`, {
    method: "GET",
    headers: {
      Authorization:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoxLCJ1c2VybmFtZSI6InJhbUBnbWFpbC5jb20iLCJuYW1lIjoicmFtIiwicGhvdG8iOm51bGx9LCJpYXQiOjE3MzgzNDQ4MDR9.5OFre7DsdWq68iesr0ZSwrycqodBV1l_P2GxjxwKVMc",
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data;
}
