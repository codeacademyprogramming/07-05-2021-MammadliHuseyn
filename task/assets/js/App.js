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
      const tbody = document.getElementById("user-table");
      const row = `<tr>
                     <th scope="row">${idx + 1}</th> 
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
      let perMonth = "no info";
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

main();