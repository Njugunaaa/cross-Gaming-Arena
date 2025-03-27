document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching games...");

    fetchGames(); // Fetch games when the page loads

    function fetchGames() {
        fetch("http://localhost:3000/games")
            .then((res) => res.json())
            .then((data) => displayImages(data))
            .catch((error) => console.error("Error fetching data:", error));
    }
    function getGames() {
      return fetch("http://localhost:3000/games").then(res => res.json());
  }

    function displayImages(data) {
        const gridContainer = document.querySelector(".image-grid");
        gridContainer.innerHTML = ""

        data.forEach((game) => {
            const imageItem = document.createElement("div");
            imageItem.classList.add("image-item");
            const img = document.createElement("img")
            img.src = game.poster
            img.alt = game.title

            //The below takes care of the overlay that is shown when one hovers over a poster.
            const overlay = document.createElement("div");
            overlay.classList.add("hover-overlay");
            overlay.innerHTML = `
                <p><strong>${game.title}</strong></p>
                <p class="game-status">
                    ${game.status === "Available" ? "✅ Available" : `❌ Booked By: ${game.booked_by} for:: ${game.booked_hours} hours`}
                </p>
            `
          //addEventlisteners
            imageItem.addEventListener("mouseover", () => {
                overlay.style.opacity = "1"
            });
            imageItem.addEventListener("mouseout", () => {
                overlay.style.opacity = "0"
            });

            img.addEventListener("click", () => {
                showDetails(game)
            });

            imageItem.appendChild(overlay)
            imageItem.appendChild(img)
            gridContainer.appendChild(imageItem)
        });
    }

    function showDetails(game) {
        const details = document.querySelector(".details");
        details.innerHTML = `
            <img src="${game.poster}" alt="${game.title}">
            <p><strong>Name: </strong>${game.title}</p>
            <p><strong>Genre: </strong>${game.genre}</p>
            <p><strong>Price: </strong>${game.price}</p>
            <p><strong>Platform: </strong>${game.platforms}</p>
            <p><strong>Max Players: </strong>${game.max_players}</p>
            <p><strong>Status: </strong>${game.status}</p>
            <button onclick="document.querySelector('.details').style.display='none'">Close</button>
        `;
        details.style.display = "block"
    }
    //bookgame functionality
    document.querySelector("#bookGameForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const bookedBy = document.querySelector("#username").value;
      const gameSelection = document.querySelector("#gameSelect").value.trim();
      const platform = document.querySelector("input[name='platform']:checked").value;
      const bookedHours = parseInt(document.querySelector("#duration").value, 10);//it may refuse to like add the value o duration if it is not an int

      getGames().then(games => {
        const game = games.find(g => g.title.trim() === gameSelection.trim());
              if (!game) {
                  alert("Game not found!");
                  return;
              }

              if (game.status === "Booked") {
                  alert("Game is already booked!");
                  return;
              }

              fetch(`http://localhost:3000/games/${game.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    booked_by: bookedBy,
                    platforms: [platform],
                    booked_hours: bookedHours,
                    status: "Booked"
                })
              })
              .then(res => {
                  if (res.ok) {
                      alert("Game booked successfully!");
                      fetchGames();
                  } else {
                      alert("Failed to book game.");
                  }
              });
          });
  }); 
  
  
  
  

    //my POST FUNCTIONALITY
    const addGameForm = document.querySelector("#addGameForm");

  
      addGameForm.addEventListener("submit", function (e) {
          e.preventDefault();

          const gameTitle = e.target.title.value;
          const gameGenre = e.target.genre.value;
          const gamePrice = e.target.price.value;
          const gamePlatform = e.target.platforms.value;
          const maxPlayers = e.target.max_players.value;
          const poster = e.target.poster.value;

          fetch("http://localhost:3000/games", {
              method: "POST",
              headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({
                  title: gameTitle,
                  genre: gameGenre,
                  price: gamePrice,
                  platforms: gamePlatform,
                  max_players: maxPlayers,
                  poster: poster,
                  status: "Available",
              }),
          })
              .then((res) => res.json())
              .then((data) => {
                  console.log("Game added:", data);
                  alert(`Game "${data.title}" added successfully!`);
                  fetchGames(); //calling this refreshes the game after it performs its function.
              })
              .catch((err) => console.error("Error:", err));
      });
    } 
);
