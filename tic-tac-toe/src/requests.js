export const serv_host = "192.168.0.101" // "192.168.0.101"
export const serv_port = 5000

export const get_all_battles = async () =>
{
  try {
    const result = await fetch(`http://${serv_host}:${serv_port}/battles`)
    return result.json()
  }
  catch (err) { console.log("GET BATTLES ERR:", err.message) }
}
