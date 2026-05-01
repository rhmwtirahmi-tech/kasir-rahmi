let total = 0;

// LOGIN
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "123") {
        document.getElementById("loginBox").style.display = "none";
        document.getElementById("kasirBox").style.display = "block";
    } else {
        alert("Username atau password salah!");
    
    }
    
}

// FORMAT RUPIAH INPUT
let inputHarga = document.getElementById("harga");

inputHarga.addEventListener("input", function(e) {
    let angka = this.value.replace(/[^0-9]/g, "");
    this.value = formatRupiah(angka);
}); 

function formatRupiah(angka) {
    return "Rp " + angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// TAMBAH BARANG
window.tambahBarang = function() {
    let nama = document.getElementById("nama").value;
    let hargaText = document.getElementById("harga").value;
    let jumlah = parseInt(document.getElementById("jumlah").value);

    let harga = parseInt(hargaText.replace(/[^0-9]/g, ""));

    if (!nama || !harga || !jumlah) {
        alert("Isi semua data!");
        return;
}

let subtotal = harga * jumlah;
total += subtotal;

let row= `
    <tr>
        <td>${nama}</td>
        <td>${formatRupiah(harga.toString())}</td>
        <td>${jumlah}</td>
        <td>${formatRupiah(subtotal.toString())}</td>
        <td><button onclick="hapusBaris(this)">Hapus</button></td>
    </tr>
`;

document.getElementById("list").innerHTML+= row;
document.getElementById("total").innerText = total.toLocaleString('id-ID');

document.getElementById("nama").value = "";
document.getElementById("harga").value = "";
document.getElementById("jumlah").value = "";

localStorage.setItem("dataKasir", document.getElementById("list").innerHTML);
localStorage.setItem("totalKasir", total);

}

// HAPUS BARIS
function hapusBaris(btn, subtotal) {
    btn.parentElement.parentElement.remove();
    total -= subtotal;
    document.getElementById("total").innerText = total.toLocaleString('id-ID');
}

// RESET KASIR
function resetKasir() {
    document.getElementById("list").innerHTML = "";
    total = 0;
    document.getElementById("total").innerText = "0";

    localStorage.removeItem("dataKasir");
    localStorage.removeItem("totalKasir");
}

// CETAK STRUK
function cetakStruk(){
   let rows = document.querySelectorAll("#list tr");
   let isiStruk = "";
   let totalStruk = 0;

   if (rows.length === 0) {
       alert("Belum ada data!.");
       return;
   }

   rows.forEach(row => {
       let cells = row.querySelectorAll("td");
       let nama = cells[0].innerText;
       let harga = parseInt(cells[1].innerText.replace(/[^0-9]/g, ""));
       let jumlah = parseInt(cells[2].innerText);

       let subtotal = harga * jumlah;
       totalStruk += subtotal;

       isiStruk += `<p>${nama} x${jumlah} = Rp ${subtotal.toLocaleString('id-ID')}</p>`;
   });

   document.getElementById("isiStruk").innerHTML = isiStruk;
   document.getElementById("totalStruk").innerText = "Total: Rp " + totalStruk.toLocaleString('id-ID');
   document.getElementById("tanggal").innerText = new Date().toLocaleString("id-ID");

   let struk = document.getElementById("strukBox");
   struk.style.display = "block";

   let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
   riwayat.push({
        tanggal: new Date().toLocaleString("id-ID"),
        total : totalStruk,
        items : isiStruk
    });

    localStorage.setItem("riwayat", JSON.stringify(riwayat));   

   setTimeout(() => {
       window.print();
       struk.style.display = "none";
   }, 300);

   tampilkanRiwayat();
}

 window.onload = function() {
    let data =localStorage.getItem("dataKasir");
    let totalSimpan = localStorage.getItem("totalKasir");

    if (data) {
        document.getElementById("list").innerHTML = data;

    }

    if (totalSimpan) {
        total = parseInt(totalSimpan);
        document.getElementById("total").innerText = total.toLocaleString('id-ID');
        
    }
 };

 // TAMPILKAN RIWAYAT
 function tampilkanRiwayat() {
    let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];
    let container = document.getElementById("riwayatList");

    container.innerHTML = "";

    riwayat.reverse().forEach(data => {
        let item = `
        <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
            <b>${data.tanggal}</b>
            <div>${data.items}</div>
            <B>Total: RP ${data.total.toLocaleString('id-ID')}</b>
        </div>
        `;
        container.innerHTML+= item;
    });
 }

 // HAPUS RIWAYAT
 function hapusRiwayat() {
    localStorage.removeItem("riwayat");
    tampilkanRiwayat();
 }



