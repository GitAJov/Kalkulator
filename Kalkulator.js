let status = { //syarat-syarat yang harus dipenuhi agar tombol berfungsi.
  allowKoma : false, //perhitungan tidak boleh dimulai dengan koma, koma tidak boleh ada sebelum dan setelah operan.
  adaKoma : false, //tidak boleh ada dua koma dalam satu angka
  allowOperan : false, //perhitungan tidak boleh dimulai dengan operan
  min : [""], //menandakan ada tidaknya simbol minus (banyak edge case untuk minus)
  nums : [""], //daftar angka dalam perhitungan
  opers : [], //daftar operan dalam perhitungan
}

function c(){ //C adalah tombol reset, agar  status direset ke awal.
  document.getElementById("span").innerText = "⠀" //menunjukkan whitespace
  status.allowKoma = false;
  status.adaKoma = false;
  status.allowOperan = false;
  status.min = [""];
  status.nums = [""];
  status.opers = [];
}

function number(digit){
  //peraturan untuk tanda koma
  if(digit=="." && status.allowKoma==true && status.adaKoma==false){
    document.getElementById("span").innerText += String(digit);
    status.adaKoma = true;
    status.allowOperan = false;
    status.nums[status.nums.length-1] += String(digit);
    return;
  }
  else if(digit=="."){
    if(status.allowKoma==false || status.adaKoma==true){
      return;
    }
  }
  if(status.min[0]=="-"){ //untuk membuat angka -5, -3 dll.
    document.getElementById("span").innerText += String(digit);
    status.allowKoma = true;
    status.nums[status.nums.length-1] += "-" + String(digit);
    status.allowOperan = true;
    status.min[0]="";
    return;
  }
  document.getElementById("span").innerText += String(digit);
  status.allowKoma = true;
  status.nums[status.nums.length-1] += String(digit);
  status.allowOperan = true;
}

function operand(operand){
  if(operand=="-"){
    if(status.min[0]==""){
      document.getElementById("span").innerText += String(operand); //men-display minus
      status.allowKoma = false;
      status.adaKoma = false;
      status.allowOperan = false;
      status.min[0]+="-"
      let splitted = document.getElementById("span").textContent.split(""); //split display menjadi array
      if(splitted[splitted.length-2]=="*" || splitted[splitted.length-2]=="/" || splitted.length==2) {
        return;//jika operan yang digunakan sebelum minus adalah *, /, atau tidak ada, jangan eksekusi kode dibawah
      }
      status.opers.push("+"); //angka sudah dalam bentuk minus, jadi operan yang digunakan adalah + (-5 - 5 sama dengan -5 + -5)
      status.nums.push(""); //untuk list angka berikutnya
      return;
    }
    else{
      return; //tombol minus tidak berfungsi jika sudah ada minus. (--5 tidak diperbolehkan)
    }
  }
  if(status.allowOperan == true){
    document.getElementById("span").innerText += String(operand);
    status.allowKoma = false;
    status.adaKoma = false;
    status.nums.push("");
    status.opers.push(operand);
    status.allowOperan = false;
    status.min[0]="";
  }
}

function count(one, two, symbol){ //fungsi untuk menghitung
    switch(symbol){
      case "+":
        return one + two;
        break;
      case "-":
        return one - two;
      case "*":
        return one * two;
        break;
      case "/":
        return one / two;
        break;
    }
}

function equal(){ //fungsi untuk mendapat jumlah total

  for(i=0; i<status.opers.length; i++){ //prioritas adalah * dan / (aturan PEMDAS)
    if(status.opers[i]=="/" || status.opers[i]=="*"){
        let one = parseFloat(status.nums[i]); //jika operan berada di indeks 3,
        let two = parseFloat(status.nums[i+1]); //maka angka yang digunakan adalah indeks 3 dan 4
        let ans = count(one, two, status.opers[i]);
        status.nums.splice(i, 2, ans); //pada list angka, hilangkan 2 elemen di index i, dan ganti dengan variable ans
        status.opers.splice(i, 1); //pada list operan, hilangkan 1 elemen di index i.
    } //ulangi hingga tidak ada * atau /
  }
  while(status.opers.length!=0){ //jumlahkan semua angka
    for(j=0; j<status.opers.length; j++){
      let one = parseFloat(status.nums[j]);
      let two = parseFloat(status.nums[j+1]);
      let ans = count(one, two, status.opers[j]);
      status.nums.splice(j, 2, ans);
      status.opers.splice(j, 1);
    }
  }//hasil akhir adalah 1 elemen (jumlah total) pada list angka, dan 0 elemen di list operan
  document.getElementById("span").innerText = status.nums[0]; //menunjukkan hasil akhir
  status.allowKoma = true; //semua status direset ke awal agar kalkulator bisa digunakan dengan hasil akhir.
  status.adaKoma = false;
  status.allowOperan = true;
  status.opers = [];
}
