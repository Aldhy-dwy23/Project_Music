// Mendapatkan referensi elemen-elemen dari HTML
const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".btnlogin-popup");

// Menambahkan event listener pada link register untuk menampilkan form register
registerLink.addEventListener("click", () => {
  wrapper.classList.add("active");
});

// Menambahkan event listener pada link login untuk menampilkan form login
loginLink.addEventListener("click", () => {
  wrapper.classList.remove("active");
});

// Menambahkan event listener pada tombol login dan register
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  const loginButton = document.querySelector(".form-box.login .btn");
  const registerButton = document.querySelector(".form-box.register .btn");

  // Event listener saat tombol login diklik
  loginButton.addEventListener("click", function (event) {
    event.preventDefault();
    // Melakukan sesuatu setelah tombol login diklik, seperti validasi form
    // Setelah berhasil, arahkan pengguna ke dashboard dan tampilkan pesan sukses
    goToDashboard();
    showSuccessMessage("Login berhasil!");
  });

  // Event listener saat tombol register diklik
  registerButton.addEventListener("click", async function (event) {
    event.preventDefault();
    // Melakukan sesuatu setelah tombol register diklik, seperti validasi form
    // Setelah berhasil, tampilkan pesan sukses di halaman akun
    await registerUser(); // Mengasumsikan registerUser adalah fungsi asynchronous
  });
});

// Fungsi asynchronous untuk melakukan registrasi pengguna
async function registerUser() {
  // Implementasi logika registrasi di sini
  // Misalnya, kirim data registrasi ke server menggunakan fetch atau XMLHttpRequest
  // Setelah berhasil, tampilkan pesan sukses di halaman akun
  try {
    const response = await fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Sertakan data registrasi di sini
      }),
    });

    if (response.ok) {
      // Registrasi berhasil, tampilkan pesan sukses di halaman akun
      showSuccessMessage("Registrasi berhasil!");
    } else {
      // Registrasi gagal, tampilkan pesan error di halaman akun
      showErrorMessage("Registrasi gagal. Silakan coba lagi.");
    }
  } catch (error) {
    console.error("Error during registration:", error);
    showErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
  }
}

// Fungsi untuk navigasi ke dashboard
function goToDashboard() {
  // Implementasikan logika navigasi ke dashboard di sini
  // Sebagai contoh, kita akan mengarahkan pengguna ke halaman "/"
  window.location.href = "/";
}

// Fungsi untuk menampilkan pesan sukses
function showSuccessMessage(message) {
  // Implementasikan logika untuk menampilkan pesan sukses di sini
  // Sebagai contoh, kita akan menampilkan pesan dalam elemen dengan id "successMessage"
  const successMessageElement = document.getElementById("successMessage");

  if (successMessageElement) {
    successMessageElement.innerText = message;
  } else {
    // Jika elemen tidak ditemukan, tampilkan alert
    alert("Success: " + message);
  }
}

// Fungsi untuk menampilkan pesan error
function showErrorMessage(message) {
  // Implementasikan logika untuk menampilkan pesan gagal di sini
  // Sebagai contoh, kita akan menampilkan pesan dalam elemen dengan id "errorMessage"
  const errorMessageElement = document.getElementById("errorMessage");

  if (errorMessageElement) {
    errorMessageElement.innerText = message;
  } else {
    // Jika elemen tidak ditemukan, tampilkan alert
    alert("Error: " + message);
  }
}
