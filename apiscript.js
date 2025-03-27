document.addEventListener("DOMContentLoaded", () => {
    console.log("Fetching games from JSONBin...");

    const jsonBinUrl = "https://api.jsonbin.io/v3/b/67e5d2bf8960c979a579c977";
    const jsonBinMasterKey = "$2a$10$xSp4u1Y3iLb5bmRCQyG4WOtKRJELsKS3BAzd7O72PJcpOhtlNVrji";

    fetchGames(); // Fetch games when the page loads

    function fetchGames() {
        getGames().then(displayImages).catch((error) => console.error("Error fetching data:", error));
    }

    function getGames() {
        return fetch(jsonBinUrl, {
            headers: { "X-Master-Key": jsonBinMasterKey }
        })
            .then(res => res.json())
            .then(data => data.record.games);
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
                    ${game.status === "Available" ? "✅ Available" : `❌ Booked By: ${game.booked_by} for ${game.booked_hours} hours`}
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

            // Simple update
            game.booked_by = bookedBy;
            game.platforms = [platform];
            game.booked_hours = bookedHours;
            game.status = "Booked";

            fetch(jsonBinUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": jsonBinMasterKey
                },
                body: JSON.stringify({ games: games })
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

    // Simple add
    document.querySelector("#addGameForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const newGame = {
            id: Date.now(),
            title: e.target.title.value,
            genre: e.target.genre.value,
            price: e.target.price.value,
            platforms: e.target.platforms.value,
            max_players: e.target.max_players.value,
            poster: e.target.poster.value,
            status: "Available"
        };

        getGames().then(games => {
            fetch(jsonBinUrl, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Master-Key": jsonBinMasterKey
                },
                body: JSON.stringify({ games: [...games, newGame] })
            })
                .then(res => {
                    if (res.ok) {
                        alert(`Game "${newGame.title}" added successfully!`);
                        fetchGames();
                    } else {
                        alert("Failed to add game.");
                    }
                });
        });
    });
});
