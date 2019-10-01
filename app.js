const button = document.querySelector('button')
const input = document.getElementById('inp')
const display = document.querySelector('api-div')


const displayGames = (array) => {
  displayGames.innerHTML = ''
  array.forEach((game) => {
    const gameDiv = document.createElement("div");
    gameDiv.innerHTML = `<h1>${game.name}</h1> `
  })
  display.append(gameDiv);
}




button.addEventListener("click", async () => {
  const response = await axios.get(`https://cors-anywhere.herokuapp.com/https://api-v3.igdb.com/games?search=${input.value}&fields=id,name,cover`, {

    headers: {
      "user-key": '08c38743d7290d45bc9d8775857416a7'
    }
  })


  displayGames(response.data)
  console.log(response.data)
})