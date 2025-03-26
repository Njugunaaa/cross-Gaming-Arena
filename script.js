document.addEventListener("DOMContentLoaded",() =>{




  
  console.log("Fetching games...");




  fetch('http://localhost:3000/games')
    .then(res=>res.json())
    .then(data=>
      displayImages(data)
    ).catch(error=>console.error('Error fetching data:', error))

  function displayImages(data){
    const gridContainer=document.querySelector('.image-grid')
    data.forEach(game => {
      const imageItem=document.createElement('div');
      imageItem.classList.add('image-item')
      const img=document.createElement('img')
      img.src=game.poster;
      img.alt=game.title
      img.addEventListener("click",()=>{
        showDetails(game)
      })
      imageItem.appendChild(img)
      gridContainer.appendChild(imageItem)
    });
  }

  function showDetails(game){
    const details=document.querySelector(".details")
    const detailsTitle=document.querySelector(".title")
    const detailsGenre=document.querySelector(".genre")
    const detailsPrice=document.querySelector(".price")
    const detailsPlatform=document.querySelector(".platform")
    const detailsMax_players=document.querySelector(".max_players")
    const detailsStatus=document.querySelector(".status")
    const detailsImage=document.querySelector(".image")
 
    detailsImage.src=game.poster
    detailsTitle.textContent=`Title: ${game.title}      `
    detailsGenre.textContent=`Genre: ${game.genre}      `
    detailsPrice.textContent=`Price: Kshs.${game.price_per_hour}     `
    detailsPlatform.textContent=`Platform: ${game.platforms}     `
    detailsMax_players.textContent=`Max_players: ${game.max_players}     `
    detailsStatus.textContent=`Status: ${game.status}     `
 
    details.style.display = "flex"



  }
const details=document.querySelector(".details")
details.addEventListener("click", () => {
  details.style.display="none"
})
})