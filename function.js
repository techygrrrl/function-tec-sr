addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const profileUrl = "https://quarter.zone/users/nintendo/7ae9ea40449147a3/"
  const response = await fetch(profileUrl)
  const htmlString = await gatherResponse(response)

  const startPoint = 'Last ingested'
  const endPoint = '</table>'

  let leaderBoard = htmlString.split(startPoint)[1]
  leaderBoard = leaderBoard.split(endPoint)[0]

  const scores = leaderBoard.match(/(<td>\d*<\/td>)/g).map((s) => s.replace(/\D/g, ''))
  const [overall, connectedVs, zone, scoreAttack, classic] = scores

  const message = `techygrrrl's TE:C Skill Ranking (SR): Overall = ${overall}, Zone = ${zone}, Score = ${scoreAttack}, Classic = ${classic}, Connected VS = ${connectedVs}`
  
  return new Response(message)
}

/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return response.text()
  }
  else if (contentType.includes("text/html")) {
    return response.text()
  }
  else {
    return response.text()
  }
}