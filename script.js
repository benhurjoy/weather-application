let key="293e9bf1b62a4cd5a9055120250708"
async function getData() {
      let requestedCity=document.getElementById("city")
      let city=requestedCity.value
      let API=`http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`
      let res=await axios.get(API)  
      displaydata(res)
      todayForecast(res)
      console.log(res)
}
function displaydata(d){
      let a=document.getElementById("temp")
      let temperature=d.data.current.temp_c
      let location=d.data.location.name
      let condition=d.data.current.condition.text
      let icon=d.data.current.condition.icon
      let windSpeed=d.data.current.wind_kph
      let humidity=d.data.current.humidity
      let b=`
           <div id="location">
           <h3>${location}</h3>
           <h1>${temperature}<sup>o</sup>C<h1>
           <h1><img style="width:120px;"src="${icon}"</img></h1>
           <h5>${condition}</h5>
           </div>
         `
      a.innerHTML=b
}
