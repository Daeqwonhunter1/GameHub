// const button = document.querySelector('button')
const input = document.getElementById('inp')
const display = document.querySelector('#api-div')
const Code = document.querySelector('html')
const pageOne = document.querySelector("#page-one")
const pageTwo = document.querySelector("#page-two")






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
    <div class = "each-game-div">
    <p class = "gameP">${game.name}</p> 
    <img class = "game-img" src = "http:${coverArt}">
    <p class = "summaryP">${game.summary}</p></div>
    `
    display.append(gameDiv);


  })

}




// button.addEventListener("click", async () => {
//   const response = await axios.get(`https://flynn-cors.herokuapp.com/https://api-v3.igdb.com/games?search=${input.value}&fields=name,cover,summary,platforms`, {

//     headers: {
//       "user-key": '08c38743d7290d45bc9d8775857416a7'
//     }
//   })

//   pageOne.style.display = "none"
//   pageTwo.style.display = "block"

//   displayGames(response.data)
//   console.log(response.data)
// })


input.addEventListener("keyup", async (event) => {
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


//Up down left right B A

document.onkeydown = checkKey;

function checkKey(event) {
  event = event || window.event;

  if (event.keyCode == '38') { ///up

  } else if (event.keyCode == '40') { ///down
  } else if (event.keyCode == '37') { ///left
  } else if (event.keyCode == '39') { ///right
  } else if (event.keyCode == '65') { ///a
  } else if (event.keyCode == '66') { // b
    Code.style.display = "none"
  }
}