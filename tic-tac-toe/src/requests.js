export const get_all_battles = async () =>
{
  try {
    const result = await fetch("http://localhost:5000/battles")
    return result.json()
  }
  catch (err) { console.log("GET BATTLES ERR:", err.message) }
}
