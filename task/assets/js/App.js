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
                     <td><button class="btn btn-info w-100 text-white" data-id="${idx + 1}">Details</button></td>
                  </tr>`
      tbody.innerHTML += row;
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

main();