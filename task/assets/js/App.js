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
      let loanStatus = isActiveLoan(user.loans);
      let loanApplyStatus = canApplyLoan(user.loans, user.salary);
      const tbody = document.getElementById("user-table-body");
      const row = `<tr class="${loanStatus.isActive}-loan">
                     <td scope="row">${idx + 1}</td> 
                     <td><img src="${user.img}" class="w-25"/></td>
                     <td>${user.name} ${user.surname}</td>
                     <td>${user.salary.value} ${user.salary.currency}</td>
                     <td>${calculateUserLoan(user.loans)} ${user.loans[0].amount.currency}</td>
                     <td><span class="badge ${loanStatus.badgeBg} w-50">${loanStatus.isActive}</span></td>
                     <td><span class="badge ${loanApplyStatus.badgeBg} w-50">${loanApplyStatus.isActive}</span></td>
                     <td><button class="btn btn-info w-100 text-white btn-details" data-id="${idx}">Details</button></td>
                  </tr>`
      tbody.innerHTML += row;
      showDetailsEventHandler(data);
   });
}

let calculateUserLoan = (loans) => {
   return loans.reduce((total, loan) => {
      if (!loan.closed)
         return total + loan.perMonth.value;

      return total;
   }, 0)
}

let isActiveLoan = (loans) => {
   let isLoanActive = true;
   let loanStatus = {
      "badgeBg": "bg-success",
      "isActive": "Active"
   };

   loans.forEach(status => {
      if (!status.closed)
         isLoanActive = false;
   });

   if (isLoanActive)
      loanStatus = {
         "badgeBg": "bg-danger",
         "isActive": "Deactive"
      }

   return loanStatus;
}

let canApplyLoan = (loans, salary) => {
   let totalLoans = calculateUserLoan(loans);
   let isApply = salary * 45 / 100 > totalLoans;

   let loanStatus;

   if (!isApply)
      loanStatus = {
         "badgeBg": "bg-success",
         "isActive": "Active"
      };

   else
      loanStatus = {
         "badgeBg": "bg-danger",
         "isActive": "Deactive"
      };

   return loanStatus;
}

let showDetailsEventHandler = (data) => {
   document.querySelectorAll(".btn-details").forEach((btn) => {
      btn.addEventListener("click", () => {
         const index = btn.getAttribute("data-id");
         setDataToModal(data[index]);
         $("#details-modal").modal("toggle");
         $(".close-modal").click(() => { $("#details-modal").modal("toggle") });
      })
   })
}

let setDataToModal = (user) => {
   console.log(user);
   const tbody = document.getElementById("details-table");
   tbody.innerHTML = "";
   let header = document.getElementById("modal-header");
   header.innerHTML = `<h5 class="modal-title">${user.name} ${user.surname}</h5>`
   user.loans.forEach(loan => {
      let perMonth = "N/A";
      let badge = "<span class='badge bg-danger w-100'>Closed</span>"

      if (loan.perMonth != undefined)
         perMonth = `${loan.perMonth.value} ${loan.perMonth.currency}`;

      if (!loan.closed)
         badge = "<span class='badge bg-success w-100'>Active</span>";


      const row = `<tr>
                     <td>${loan.loaner}</td>
                     <td>${loan.amount.value} ${loan.amount.currency}</td>
                     <td>${badge}</td>
                     <td>${perMonth}</td>
                     <td>${loan.dueAmount.value} ${loan.dueAmount.currency}</td>
                     <td>${loan.loanPeriod.start}</td>
                     <td>${loan.loanPeriod.end}</td>
                  </tr>`
      tbody.innerHTML += row;
   })
}

let searchForName = () => {

   let input = document.getElementById("search-input");
   let filter = input.value.toUpperCase();
   let table = document.getElementById("user-table");
   let tr = table.getElementsByTagName("tr");
   for (i = 0; i < tr.length; i++) {
      let td = tr[i].getElementsByTagName("td")[2];
      if (td) {
         let txtValue = td.textContent || td.innerText;
         if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
         } else {
            tr[i].style.display = "none";
         }
      }
   }
}

let filterForIsActiveLoan = () => {
   let table = document.getElementById("user-table-body");
   let rows = table.getElementsByClassName("Deactive-loan");
   for (const tr of rows) {
      tr.classList.toggle("d-none");
   }
}

document.getElementById('check-active-loan').addEventListener('change', filterForIsActiveLoan);
document.getElementById("search-input").addEventListener('keyup', searchForName);

main();