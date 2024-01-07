const axios = require("axios");

// Fungsi untuk mendapatkan informasi lagu dari Spotify
async function getInfoSong(query, callback) {
  try {
    // Ganti dengan client ID dan client secret Spotify Anda
    const clientId = "a41d1f3274744fc5bb490e0d6f481a22";
    const clientSecret = "0c79a6b0438b4c22a6c6916580a8245c";

    // Mendapatkan access token dari Spotify
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // Mencari lagu berdasarkan query
    const searchResponse = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Mendapatkan informasi pertama dari hasil pencarian
    const firstResult = searchResponse.data.tracks.items[0];

    if (!firstResult) {
      return callback("Song not found", null);
    }

    // Mengambil informasi lagu
    const songInfo = {
      title: firstResult.name,
      artist: firstResult.artists[0].name,
      album: firstResult.album.name,
      image: firstResult.album.images[0].url,
      previewUrl: firstResult.preview_url,
    };

    callback(null, songInfo);
  } catch (error) {
    callback("Error fetching song information", null);
  }
}

module.exports = getInfoSong;
