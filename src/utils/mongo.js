// Mengimpor modul mongoose untuk berinteraksi dengan MongoDB
const mongoose = require("mongoose");

// Menghubungkan ke database MongoDB lokal dengan nama "Cuaca"
mongoose
  .connect("mongodb://localhost:27017/Song", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Terhubung ke Database");
  })
  .catch((e) => {
    console.error("Kesalahan koneksi MongoDB: " + e.message);
  });

// Membuat skema (schema) untuk data pengguna yang akan disimpan di MongoDB
const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Email harus unik
    lowercase: true, // Mengubah email menjadi huruf kecil
  },
  password: {
    type: String,
    required: true,
  },
}, {
  versionKey: false // Menghilangkan field __v dari skema
});

// Membuat model (collection) dengan nama "LogInCollection" berdasarkan skema yang telah dibuat
const LogInCollection = new mongoose.model("Users", logInSchema);

// Mengekspor model agar dapat digunakan di file lain
module.exports = LogInCollection;
