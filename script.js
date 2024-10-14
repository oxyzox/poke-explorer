let favoritePokemon = JSON.parse(localStorage.getItem('favoritePokemon')) || [];

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    themeToggle.addEventListener('click', toggleDarkMode);
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
    }

   
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            fetchPokemon();
        }
    });
});

async function fetchPokemon() {
    const searchInput = document.getElementById("search").value.toLowerCase().trim();
    if (!searchInput) {
        alert("Please enter a Pokémon name or ID.");
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${searchInput}`;
    const pokemonInfo = document.getElementById("pokemon-info");
    pokemonInfo.innerHTML = `<div class="loading">Loading...</div>`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        const pokemon = await response.json();
        displayPokemon(pokemon);
    } catch (error) {
        pokemonInfo.innerHTML = `<p>Pokémon not found. Please try again.</p>`;
    }
}

async function fetchRandomPokemon() {
    const randomId = Math.floor(Math.random() * 898) + 1;
    const url = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
    const pokemonInfo = document.getElementById("pokemon-info");
    pokemonInfo.innerHTML = `<div class="loading">Loading...</div>`;
    try {
        const response = await fetch(url);
        const pokemon = await response.json();
        displayPokemon(pokemon);
    } catch (error) {
        pokemonInfo.innerHTML = `<p>An error occurred. Please try again.</p>`;
    }
}

function displayPokemon(pokemon) {
    const pokemonInfo = document.getElementById("pokemon-info");
    const types = pokemon.types.map(type => `<span class="type-badge">${type.type.name}</span>`).join('');

    const pokemonCard = `
        <div class="pokemon-card">
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
            <div class="pokemon-name">${pokemon.name.toUpperCase()}</div>
            <div class="pokemon-stats">
                <div><strong>Height:</strong> ${pokemon.height / 10}m</div>
                <div><strong>Weight:</strong> ${pokemon.weight / 10}kg</div>
                <div><strong>Type:</strong> ${types}</div>
            </div>
            <button onclick="addToFavorites('${pokemon.name}', '${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}')">
                <i class="fas fa-heart"></i> Add to Favorites
            </button>
        </div>
    `;

    pokemonInfo.innerHTML = pokemonCard;
}

function addToFavorites(name, sprite) {
    const favPokemon = { name, sprite };
    
    if (favoritePokemon.find(pokemon => pokemon.name === name)) {
        alert(`${name} is already in your favorites!`);
        return;
    }

    favoritePokemon.push(favPokemon);
    localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemon));
    alert(`${name} added to your favorites!`);
}

function showHome() {
    document.getElementById("main-section").style.display = "block";
    document.getElementById("favorites-page").style.display = "none";
}

function showFavorites() {
    const favoritesPage = document.getElementById("favorites-page");
    const mainSection = document.getElementById("main-section");
    const favoritesList = document.getElementById("favorites-list");

    mainSection.style.display = "none";
    favoritesPage.style.display = "block";

    favoritesList.innerHTML = "";
    
    if (favoritePokemon.length === 0) {
        favoritesList.innerHTML = "<p>You haven't added any favorite Pokémon yet!</p>";
    } else {
        favoritePokemon.forEach(pokemon => {
            const pokemonCard = `
                <div class="pokemon-card">
                    <img src="${pokemon.sprite}" alt="${pokemon.name}">
                    <div class="pokemon-name">${pokemon.name.toUpperCase()}</div>
                    <button onclick="removeFromFavorites('${pokemon.name}')">
                        <i class="fas fa-trash"></i> Remove from Favorites
                    </button>
                </div>
            `;
            favoritesList.innerHTML += pokemonCard;
        });
    }
}
function removeFromFavorites(name) {
    favoritePokemon = favoritePokemon.filter(pokemon => pokemon.name !== name);
    localStorage.setItem('favoritePokemon', JSON.stringify(favoritePokemon));
    showFavorites();
}


function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
}