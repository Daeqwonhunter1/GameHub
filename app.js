const button = document.querySelector('button')
const input = document.getElementById('inp')
const display = document.querySelector('#api-div')

const pageOne = document.querySelector("#page-one")
const pageTwo = document.querySelector("#page-two")




// async function randomGames() {
//   const response = await axios.get(`https://flynn-cors.herokuapp.com/https://api-v3.igdb.com/games?search=0&fields=cover`, {
//     headers: {
//       "user-key": '08c38743d7290d45bc9d8775857416a7'
//     }
//   })
//   const randomCover = Math.floor(Math.random() * response.data.length)
//   console.log(response)
//   return randomCover
// }

// console.log(randomGames())




const displayGames = (array) => {
  display.innerHTML = ''
  array.forEach(async (game) => {
    let coverResponse = await axios.get(`https://flynn-cors.herokuapp.com/https://api-v3.igdb.com/covers/${game.cover}?fields=url`, {
      headers: {
        "user-key": '08c38743d7290d45bc9d8775857416a7'
      }
    })
    let platformResponse = await axios.get(`https://flynn-cors.herokuapp.com/https://api-v3.igdb.com/platforms/${game.platforms}?fields=abbreviation`, {
      headers: {
        "user-key": '08c38743d7290d45bc9d8775857416a7'
      }
    })

    let coverArt = coverResponse.data[0].url

    console.log(coverResponse)
    const gameDiv = document.createElement("div");
    gameDiv.innerHTML = `
    <p class = "gameP">${game.name}</p> 
    <img class = "game-img" src = "http:${coverArt}">
    <p class = "summaryP">${game.summary}</p>
    `
    display.append(gameDiv);

    for (i = 0; i < game.data; i++) {
      let platformPrint = platformResponse.data[i].abbreviation
      gameDiv.innerHTML = ` <p class = "platformP>${platformPrint}</p>`
      display.append(gameDiv)
      console.log(platformPrint)
    }
  })

}




button.addEventListener("click", async () => {
  const response = await axios.get(`https://flynn-cors.herokuapp.com/https://api-v3.igdb.com/games?search=${input.value}&fields=name,cover,summary,platforms`, {

    headers: {
      "user-key": '08c38743d7290d45bc9d8775857416a7'
    }
  })

  pageOne.style.display = "none"
  pageTwo.style.display = "block"

  displayGames(response.data)
  console.log(response.data)
})


input.addEventListener("keyup", async function (event) {
  if (event.key === "Enter") {
    const response = await axios.get(`https://flynn-cors.herokuapp.com/https://api-v3.igdb.com/games?search=${input.value}&fields=id,name,cover,summary,platforms`, {


      headers: {
        "user-key": '08c38743d7290d45bc9d8775857416a7'
      }
    })

    pageOne.style.display = "none"
    pageTwo.style.display = "block"

    displayGames(response.data)
    console.log(response.data)
  }
})