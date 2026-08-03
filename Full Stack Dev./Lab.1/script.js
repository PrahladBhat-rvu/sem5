const mails = document.querySelectorAll(".mail");

mails.forEach(mail=>{

    mail.addEventListener("click",()=>{

        alert("Opening email...");

    });

});

const compose=document.querySelector(".compose");

compose.addEventListener("click",()=>{

    alert("Compose New Email");

});
