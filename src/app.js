// Mengimpor modul yang diperlukan dari Express, HBS, dan Mongoose
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const session = require("express-session");
const mongoose = require('mongoose');

// Mengimpor model LogInCollection serta modul untuk prediksi cuaca
const LogInCollection = require("./utils/mongo");
const forecast = require("./utils/song");
const playlistUtils = require("./utils/playlist"); // Mengimpor playlist.js

// Membuat instance Express
const app = express();

// Menentukan port server
const port = process.env.PORT || 3030;

// Menggunakan middleware untuk parsing JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

// Menambahkan variabel lokal untuk status otentikasi pada setiap respons
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  next();
});

// Menentukan path untuk views, partials, dan public
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");
const publicPath = path.join(__dirname, "../public");

// Mengatur view engine, path views, dan partials
app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicPath));

// Menghubungkan ke database MongoDB
mongoose.connect('mongodb://localhost:27017/Song', { useNewUrlParser: true, useUnifiedTopology: true });

// Endpoint untuk render halaman signup
app.get("/signup", (req, res) => {
  res.render("signup", {
    title: "Halaman Akun Saya",
    name: "Kelompok A",
  });
});

// Endpoint untuk render halaman login
app.get("/login", (req, res) => {
  res.render("login", {
    title: "Halaman Akun Saya",
    name: "Kelompok A",
  });
});

// Endpoint untuk menerima data signup dari form
app.post("/signup", async (req, res) => {
  try {
    // Validasi data yang diterima dari form
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).render("signup", { error: "Please fill in all fields." });
    }

    // Mencari atau membuat pengguna baru dalam database
    const result = await LogInCollection.findOneAndUpdate(
      { name: req.body.name },
      { $setOnInsert: { name: req.body.name, email: req.body.email, password: req.body.password } },
      { upsert: true, new: true }
    );

    // Mengirim respons sesuai hasil operasi database
    if (result) {
      res.status(201).render("login", { naming: req.body.name, success: "Account successfully created!" });
    } else {
      res.status(500).render("signup", { error: "Error creating or retrieving user." });
    }
  } catch (error) {
    res.status(500).render("signup", { error: "Error in signup: " + error.message });
  }
});

// Endpoint untuk menerima data login dari form
app.post("/login", async (req, res) => {
  try {
    // Validasi data yang diterima dari form
    if (!req.body.nameOrEmail || !req.body.password) {
      return res.status(400).render("login", { error: "Username or email and password are required." });
    }

    // Memeriksa keberadaan pengguna dalam database
    const check = await LogInCollection.findOne({
      $or: [{ name: req.body.nameOrEmail }, { email: req.body.nameOrEmail }]
    });

    // Mengirim respons sesuai hasil pemeriksaan
    if (check && check.password === req.body.password) {
      req.session.isAuthenticated = true; // Menetapkan status otentikasi dalam sesi
      res.status(201).render("index", { naming: check.name });
    } else {
      res.status(401).render("login", { error: "Incorrect username or password." });
    }
  } catch (error) {
    res.status(500).render("login", { error: "Error in login: " + error.message });
  }
});

// Endpoint untuk logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render("error", { error: "Error logging out." });
    }
    res.redirect("/");
  });
});

// Endpoint untuk halaman utama
app.get("/", (req, res) => {
  res.render("index", {
    title: "Aplikasi Pencarian Music",
    name: "Kelompok A",
    isAuthenticated: req.session.isAuthenticated || false, // Melewatkan status otentikasi ke template
  });
});

// Endpoint untuk mendapatkan informasi lagu (memerlukan otentikasi)
app.get("/infosong", authenticateMiddleware, async (req, res) => {
  try {
    // Ganti query dengan judul lagu yang ingin dicari
    const query = "Despacito"; // Contoh judul lagu

    // Memanggil fungsi getinfosong untuk mendapatkan informasi lagu
    getinfosong(query, (error, songInfo) => {
      if (error) {
        return res.render("error", { error: "Error fetching song information: " + error });
      }

      res.render("infosong", {
        title: "Informasi Lagu",
        name: req.session.naming,
        isAuthenticated: req.session.isAuthenticated || false,
        songInfo,
      });
    });
  } catch (error) {
    res.status(500).render("error", { error: "Error fetching song information: " + error.message });
  }
});

// Endpoint untuk halaman project (memerlukan otentikasi)
app.get("/project", authenticateMiddleware, (req, res) => {
  res.render("project", {
    title: "Proyek Aplikasi Pencarian Music",
    name: "Kelompok A",
    isAuthenticated: req.session.isAuthenticated || false, // Melewatkan status otentikasi ke template
  });
});

// Endpoint untuk halaman playlist lagu (memerlukan otentikasi)
app.get("/playlist", authenticateMiddleware, async (req, res) => {
  try {
    // Panggil fungsi dari playlistUtils untuk mendapatkan semua playlist dari MongoDB
    const playlists = await playlistUtils.getAllPlaylists();

    // Render halaman playlist dengan data playlist
    res.render("playlist", {
      title: "Playlist Lagu",
      name: req.session.naming,
      isAuthenticated: req.session.isAuthenticated || false,
      playlists,
    });
  } catch (error) {
    // Tampilkan pesan error jika terjadi masalah
    res.status(500).render("playlist", { error: "Error fetching playlists: " + error.message });
  }
});

// Endpoint untuk halaman penambahan playlist (memerlukan otentikasi)
app.get("/playlist", authenticateMiddleware, (req, res) => {
  res.render("playlist", {
    title: "Tambah Playlist",
    name: req.session.naming,
    isAuthenticated: req.session.isAuthenticated || false,
  });
});

// Endpoint untuk menangani penambahan playlist
app.post("/playlist", authenticateMiddleware, async (req, res) => {
  const { playlistName, songs } = req.body;

  try {
    // Lakukan validasi data
    if (!playlistName || !songs || !Array.isArray(songs)) {
      return res.status(400).render("playlist", { error: "Invalid data provided." });
    }

    // Panggil fungsi dari playlistUtils untuk menambahkan playlist ke MongoDB
    const newPlaylist = await playlistUtils.addPlaylist(playlistName, songs);

    // Redirect ke halaman playlist setelah penambahan playlist berhasil
    res.redirect("/playlist");
  } catch (error) {
    // Tampilkan pesan error jika terjadi masalah
    res.status(500).render("playlist", { error: "Error adding playlist: " + error.message });
  }
});

// Middleware untuk otentikasi
function authenticateMiddleware(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect("/login");
  }
  next();
}

// Menjalankan server pada port yang ditentukan
app.listen(port, () => {
  console.log("Server is running on port", port);
});
