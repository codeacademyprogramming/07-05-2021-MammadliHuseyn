let data = [];
let apiUrl = "data/data.json";

async function getJson(url) {
   let response = await fetch(url);
   let data = await response.json()
   return data;
}

async function main() {
   data = await getJson(apiUrl)
   console.log(data);
   setDataToTable(data);
}


let setDataToTable = (data) => {
   data.forEach((user, idx) => {
      const tbody = document.getElementById("user-table");
      const row = `<tr>
                     <th scope="row">${idx + 1}</th> 
                     <td><img src="" class="w-25"/></td>
                     <td></td>
                     <td></td>
                     <td></td>
                     <td><span class="badge w-50"></span></td>
                     <td>ss</td>
                     <td><button class="btn btn-info w-100 text-white" data-id="${idx + 1}">Details</button></td>
                  </tr>`
      tbody.innerHTML += row;
   });
}



main();