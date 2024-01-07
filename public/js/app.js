// Mengambil referensi ke elemen-elemen HTML
const tradingForm = document.querySelector("form"); // Formulir pencarian trading
const tradingSearch = document.querySelector("input"); // Input tempat pencarian trading
const pesanSatu = document.querySelector("#pesan-1"); // Elemen pesan 1
const pesanDua = document.querySelector("#pesan-2"); // Elemen pesan 2

// Menambahkan event listener untuk menanggapi pengajuan formulir
tradingForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Mencegah pengajuan formulir yang menyebabkan pengambilan halaman baru

  // Mengambil nilai dari input tempat pencarian
  const symbols = tradingSearch.value;

  // Mengubah pesan-pesan untuk memberi umpan balik kepada pengguna
  pesanSatu.textContent = "Sedang mencari informasi trading ..";
  pesanDua.textContent = "";

  // Menggunakan fetch API untuk mengambil data trading dari server
  fetch("/infotrading").then((response) => {
    // Mengonversi respons ke format JSON
    response.json().then((data) => {
      // Menangani data yang diterima dari server
      if (data.error) {
        pesanSatu.textContent = data.error; // Menampilkan pesan error jika terjadi kesalahan
      } else {
        pesanSatu.textContent = "Informasi Trading"; // Menampilkan label informasi trading
        pesanDua.textContent = JSON.stringify(data.tradingInfo, null, 2); // Menampilkan informasi trading dengan format JSON
      }
    });
  });
});
