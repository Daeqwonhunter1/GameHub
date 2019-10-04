const openWeatherApiKey = "27e463638bbb0944607b2515c9421322"
const button = document.querySelector("#search-button")
const cityInput = document.querySelector('#city-data')
const weatherMessageArea = document.querySelector("#weather p")
const startDateInput = document.querySelector('#start-date-data')
const endDateInput = document.querySelector('#end-date-data')
const TMasterApiKey = "akion17PwVgaKiA8J7Cock26wsaxM9oa"
const pageSize = 100;
const zomatoCount = 20;
const ZomatoApiKey = "3c598f982993090807e390277ff00634"
const eventListPointer = document.querySelector('#list-items')
let bodyPointer = document.querySelector('#listbody')
let displayMessage = ''
const modal = document.querySelector("#modal")
const modalList = document.querySelector("#modal-list")
const exit = document.querySelector("#exit")
let eventButtons = '';
let buttonText = ''
let buttonImg = ''



button.addEventListener("click", async function () {
  let city = cityInput.value;
  city = city.replace(/ /g, "+");
  let startDate = startDateInput.value;
  // remmoveModal just in case one is up and search button is hit
  modal.style.display = "none";

  displayMessage = ''
  if (city == '') {
    displayMessage += ' Please enter a city'
    //clear lists if city is empty
    eventButtons = document.querySelectorAll(".event-buttons");
    if (eventButtons != null) {
      document.querySelector("#list-body").innerHTML = ''
    }

    modalListli = document.querySelectorAll("#modal-list-li");
    if (modalListli != null) {
      document.querySelector("#modal-list").innerHTML = ''
    }
  }

  if (startDate == '') {
    displayMessage += ' Please enter dates for your outting'
  }

  if (startDate < (new Date().toISOString().slice(0, 10))) {
    displayMessage += ' start date less then current date'
  }

  endDate = startDate

  // if there is an error display merssage else do searches

  if (displayMessage != '') {
    alert(displayMessage)
  }
  else {
    getWeather()
    getTickets()
  }





  async function getWeather() {
    let call = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&APPID=${openWeatherApiKey}`
    let response = await axios.get(call, { "x-api-key": openWeatherApiKey })
    weatherMessageArea.innerHTML = `<p>The weather for ${response.data.name} is ${response.data.weather[0].description} and temp is ${response.data.main.temp}.    </p>`
  }

  async function getTickets() {
    let TMasterCall = ''
    let TMasterResponse = ''
    /*
    check for existing buttons and remove 
    */
    eventButtons = document.querySelectorAll(".event-buttons");
    document.querySelector("#list-body").innerHTML = ''

    TMasterCall = `https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=${city}&size=${pageSize}&localStartEndDateTime=${startDate}T00:00:00,${endDate}T23:59:59&sort=date,desc&apikey=${TMasterApiKey}`
    TMasterResponse = await axios.get(TMasterCall)
    console.log(TMasterResponse)
    counter = TMasterResponse.data.page.totalElements
    if (counter === 0) {
      alert(`No events availabe for the date ${startDate} in ${city}`)
    }
    for (let i = 0; i < counter; i++) {
      newButton = document.createElement(`BUTTON`);
      newButton.classList.add("event-buttons")
      newButton.setAttribute("id", `event${i}`)
      buttonText = `<p class=show-titles> ${TMasterResponse.data._embedded.events[i].name}</p>`
      buttonText = buttonText + ` <p class = show-infos>Ticket are ${TMasterResponse.data._embedded.events[i].dates.status.code}`
      buttonText = buttonText + `       date of show ${TMasterResponse.data._embedded.events[i].dates.start.localDate}`
      buttonText = buttonText + `       start time ${TMasterResponse.data._embedded.events[i].dates.start.localTime}</p>`
      buttonText = buttonText + `<p class=venu-names> ${TMasterResponse.data._embedded.events[i]._embedded.venues[0].name}`
      buttonText = buttonText + `<p class=venu-addresses> ${TMasterResponse.data._embedded.events[i]._embedded.venues[0].address.line1}`

      let use16x9Img = ''
      let use4x3Img = ''
      let use3x2Img = ''
      let use16x9Height = 0
      let use4x3Height = 0
      let use3x2Height = 99999
      buttonImg = ' '
      buttonImg = `<img src="${TMasterResponse.data._embedded.events[i].images[0].url}"alt="Poster">`
      let imageArray = TMasterResponse.data._embedded.events[i].images
      // find the largest image for each ratio
      for (let p = 0; p < imageArray.length; p++) {
        if (imageArray[p].ratio === "16_9") {
          if (imageArray[p].height > use16x9Height) {
            use16x9Img = imageArray[p].url
            use16x9Height = imageArray[p].height
          }
        }
        if (imageArray[p].ratio === "4_3") {
          if (imageArray[p].height > use4x3Height) {
            use4x3Img = imageArray[p].url
            use4x3Height = imageArray[p].height
          }
        }
        if (imageArray[p].ratio === "3_2") {
          if (imageArray[p].height < use3x2Height) {
            use3x2Img = imageArray[p].url
            use3x2Height = imageArray[p].height
          }
        }

      }
      // find which image to use
      buttonImg = `<img class='tmimages' src="${use3x2Img}"alt="Poster">`
      //find screen sizes pic right image 
      let browserWidth = window.innerWidth
      console.log(browserWidth)
      if (browserWidth < 500 & browserWidth > 400) {
        console.log('in4x3')
        buttonImg = `<img class='tmimages' src="${use4x3Img}"alt="Poster">`
      }
      if (browserWidth > 500) {
        console.log('bigger')
        buttonImg = `<img class='tmimages' src="${use16x9Img}"alt="Poster">`
      }
      buttonText = buttonImg + buttonText

      newButton.innerHTML = buttonText
      document.querySelector("#list-body").appendChild(newButton);



      newButton.addEventListener("click", async function () {
        let latitude = TMasterResponse.data._embedded.events[i]._embedded.venues[0].location.latitude
        let longitude = TMasterResponse.data._embedded.events[i]._embedded.venues[0].location.longitude
        let zomartCall = `https://developers.zomato.com/api/v2.1/search?entity_type=zone&lat=${latitude}&lon=${longitude}&radius=2000&count=${zomatoCount}&sort=real_distance&order=desc`
        let zomatoResponse = await axios.get(zomartCall, {
          headers: { "user-key": ZomatoApiKey }
        }
        )
        console.log(zomatoResponse)
        modal.style.display = "block";
        modalListli = document.querySelectorAll("#modal-list-li");
        if (modalListli != null) {
          document.querySelector("#modal-list").innerHTML = ''
        }
        //parse and populate return set if any

        let zomatoReturnsCounter = 0
        if (zomatoResponse.data.results_shown == 0) {
          zomatoReturnsCounter = zomatoResponse.data.restaurants.length
          zomatoReturnsCounter = 0
        }
        else {
          zomatoReturnsCounter = 0
          zomatoReturnsCounter = zomatoResponse.data.restaurants.length
        }
        let liText = ''
        let liEntry = ''
        for (z = 0; z < zomatoReturnsCounter; z++) {
          liEntry = document.createElement(`li`)
          liEntry.classList.add("list-items")
          liEntry.setAttribute("id", `list-item${z}`)
          liText = `<p class=rest-names>${zomatoResponse.data.restaurants[z].restaurant.name}</p>`
          liText = liText + `<p class=rest-phones>Phone:  ${zomatoResponse.data.restaurants[z].restaurant.phone_numbers} </p>`
          liText = liText + `<p class=rest-addresses>${zomatoResponse.data.restaurants[z].restaurant.location.address}</p>`
          liText = liText + `<p class=rest-cuisines>Cuisines: ${zomatoResponse.data.restaurants[z].restaurant.cuisines}</p>`
          liText = liText + `<p class=rest-times>${zomatoResponse.data.restaurants[z].restaurant.timings}</p>`
          if (zomatoResponse.data.restaurants[z].restaurant.menu_url != '') {
            liText = liText + `<a class=rest-url href=${zomatoResponse.data.restaurants[z].restaurant.menu_url} target="_blank">MENU</a>`
          }
          console.log(liText)
          liEntry.innerHTML = liText
          document.querySelector("#modal-list").appendChild(liEntry);
        }

        liEntry = document.createElement(`li`)
        liEntry.classList.add("list-items")
        liEntry.setAttribute("id", `list-item-last`)
        liText = ' '
        liEntry.innerHTML = liText
        document.querySelector("#modal-list").appendChild(liEntry);

        exit.addEventListener("click", function () {
          modal.style.display = "none"
        })

      })

    }

  }
}

)