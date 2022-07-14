addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

const startPoint = 'Last ingested'
const endPoint = '</table>'

async function handleRequest(request) {
  let output = "techygrrrl's TE:C SR: "

  const profiles = [
    {
      name: 'PC',
      url: 'https://quarter.zone/users/epic/b490c2090eab455c94ca813cf9cb3512/',
    },
    {
      name: 'Switch',
      url: 'https://quarter.zone/users/nintendo/7ae9ea40449147a3/'
    }
  ]

  const resolved = await Promise.all(profiles.map(profile => fetch(profile.url)))
  const responses = await Promise.all(resolved.map(response => gatherResponse(response)))

  responses.forEach((htmlString, idx) => {
    let leaderBoard = htmlString.split(startPoint)[1]
    leaderBoard = leaderBoard.split(endPoint)[0]

    const scores = leaderBoard.match(/(<td>\d*<\/td>)/g).map((s) => s.replace(/\D/g, ''))
    const [overall, connectedVs, zone, scoreAttack, classic] = scores

    const profile = profiles[idx]

    output += `${profile.name}: Overall = ${overall}, Zone = ${zone}, Score = ${scoreAttack}, Classic = ${classic}, Connected VS = ${connectedVs}. `
  })
  
  return new Response(output)
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