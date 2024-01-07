const mongoose = require('mongoose');

// Mendefinisikan model playlist
const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  songs: [
    {
      type: String,
      required: true,
    },
  ],
});

// Membuat model Playlist dari skema
const Playlist = mongoose.model('Playlist', playlistSchema);

// Fungsi untuk menambahkan playlist
async function addPlaylist(name, songs) {
  try {
    const newPlaylist = await Playlist.create({
      name,
      songs: songs.split(",").map(song => song.trim()),
    });
    return newPlaylist;
  } catch (error) {
    throw new Error('Error adding playlist to MongoDB: ' + error.message);
  }
}

// Fungsi untuk mendapatkan semua playlist
async function getAllPlaylists() {
  try {
    const allPlaylists = await Playlist.find();
    return allPlaylists;
  } catch (error) {
    throw new Error('Error fetching playlists from MongoDB: ' + error.message);
  }
}

module.exports = {
  addPlaylist,
  getAllPlaylists,
};
