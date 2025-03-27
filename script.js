document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching games...");

    fetchGames(); // Fetch games when the page loads

    function fetchGames() {
        fetch("https://api.jsonbin.io/v3/b/67e5d2bf8960c979a579c977", {
            headers: { "X-Master-Key": "$2a$10$xSp4u1Y3iLb5bmRCQyG4WOtKRJELsKS3BAzd7O72PJcpOhtlNVrji" }
        })
            .then((res) => res.json())
            .then((data) => displayImages(data.record.games))
            .catch((error) => console.error("Error fetching data:", error));
    }
    function getGames() {
        return fetch("https://api.jsonbin.io/v3/b/67e5d2bf8960c979a579c977", {
            headers: { "X-Master-Key": "$2a$10$xSp4u1Y3iLb5bmRCQyG4WOtKRJELsKS3BAzd7O72PJcpOhtlNVrji" }
        }).then(res => res.json()).then(data => data.record.games);
    }

    function displayImages(data) {
        const gridContainer = document.querySelector(".image-grid");
        gridContainer.innerHTML = "";

        data.forEach((game) => {
            const imageItem = document.createElement("div");
            imageItem.classList.add("image-item");
            const img = document.createElement("img");
            img.src = game.poster;
            img.alt = game.title;

            const overlay = document.createElement("div");
            overlay.classList.add("hover-overlay");
            overlay.innerHTML = `
                <p><strong>${game.title}</strong></p>
                <p class="game-status">
                    ${game.status === "Available" ? "✅ Available" : `❌ Booked By: ${game.booked_by} for:: ${game.booked_hours} hours`}
                </p>
            `;
            //addEventlisteners
            imageItem.addEventListener("mouseover", () => {
                overlay.style.opacity = "1";
            });
            imageItem.addEventListener("mouseout", () => {
                overlay.style.opacity = "0";
            });

            img.addEventListener("click", () => {
                showDetails(game);
            });

            imageItem.appendChild(overlay);
            imageItem.appendChild(img);
            gridContainer.appendChild(imageItem);
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
        details.style.display = "block";
    }

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

                fetch("https://api.jsonbin.io/v3/b/67e5d2bf8960c979a579c977", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Master-Key": "$2a$10$xSp4u1Y3iLb5bmRCQyG4WOtKRJELsKS3BAzd7O72PJcpOhtlNVrji"
                    },
                    body: JSON.stringify({
                        games: games.map(g => {
                            if (g.id === game.id) {
                                return {
                                    ...g,
                                    booked_by: bookedBy,
                                    platforms: [platform],
                                    booked_hours: bookedHours,
                                    status: "Booked"
                                };
                            }
                            return g;
                        })
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

        getGames().then(games => {
            const newGame = {
                id: games.length + 1,
                title: gameTitle,
                genre: gameGenre,
                price: gamePrice,
                platforms: gamePlatform,
                max_players: maxPlayers,
                poster: poster,
                status: "Available"
            };

            fetch("https://api.jsonbin.io/v3/b/67e5d2bf8960c979a579c977", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": "$2a$10$xSp4u1Y3iLb5bmRCQyG4WOtKRJELsKS3BAzd7O72PJcpOhtlNVrji"
                },
                body: JSON.stringify({ games: [...games, newGame] })
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log("Game added:", data);
                    alert(`Game "${newGame.title}" added successfully!`);
                    fetchGames(); //calling this refreshes the game after it performs its function.
                })
                .catch((err) => console.error("Error:", err));
        });
    });
});
