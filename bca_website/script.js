/* =====================================================
   BCA DEPARTMENT WEBSITE
   script.js
   PART 1
===================================================== */



/* =====================================================
   LOADER
===================================================== */


window.addEventListener("load",()=>{

    const loader=document.getElementById("loader");

    if(loader){

        setTimeout(()=>{

            loader.style.opacity="0";

            loader.style.visibility="hidden";

        },800);

    }

});







/* =====================================================
   SCROLL PROGRESS BAR
===================================================== */


window.addEventListener("scroll",()=>{


    const scrollTop =
    document.documentElement.scrollTop;


    const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;


    const progress =
    (scrollTop / height) * 100;


    const bar =
    document.getElementById("progressBar");


    if(bar){

        bar.style.width =
        progress + "%";

    }


});








/* =====================================================
   NAVBAR SCROLL EFFECT
===================================================== */


const navbar =
document.querySelector(".glass-navbar");



window.addEventListener("scroll",()=>{


    if(window.scrollY > 50){


        navbar?.classList.add("navbar-scrolled");


    }

    else{


        navbar?.classList.remove("navbar-scrolled");


    }


});








/* =====================================================
   AOS ANIMATION
===================================================== */


AOS.init({

    duration:900,

    once:true,

    offset:100

});







/* =====================================================
   HERO SWIPER
===================================================== */


const heroSwiper =
new Swiper(".heroSwiper",{


    loop:true,


    autoplay:{

        delay:5000,

        disableOnInteraction:false

    },


    effect:"fade",


    fadeEffect:{

        crossFade:true

    },


    pagination:{

        el:".swiper-pagination",

        clickable:true

    },


    navigation:{

        nextEl:".swiper-button-next",

        prevEl:".swiper-button-prev"

    }


});







/* =====================================================
   RECRUITER SLIDER
===================================================== */


const recruiterSwiper =
new Swiper(".recruiterSwiper",{


    slidesPerView:5,


    spaceBetween:30,


    loop:true,


    autoplay:{

        delay:2000,

        disableOnInteraction:false

    },


    breakpoints:{


        320:{

            slidesPerView:2

        },


        576:{

            slidesPerView:3

        },


        992:{

            slidesPerView:5

        }


    }


});








/* =====================================================
   TESTIMONIAL SLIDER
===================================================== */


const testimonialSwiper =
new Swiper(".testimonialSwiper",{


    slidesPerView:1,


    spaceBetween:30,


    loop:true,


    autoplay:{

        delay:4000

    },


    breakpoints:{


        768:{

            slidesPerView:2

        },


        1200:{

            slidesPerView:3

        }


    }


});


/* =====================================================
   SCRIPT.JS PART 2
===================================================== */



/* =====================================================
   ANIMATED COUNTERS
===================================================== */


const counters =
document.querySelectorAll(".counter");



const counterObserver =
new IntersectionObserver((entries)=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){


            const counter =
            entry.target;


            const target =
            Number(counter.dataset.target);



            let count = 0;



            const speed =
            target / 100;



            const updateCounter = ()=>{


                count += speed;



                if(count < target){


                    counter.innerText =
                    Math.ceil(count);



                    requestAnimationFrame(updateCounter);


                }

                else{


                    counter.innerText =
                    target + "+";


                }


            };



            updateCounter();



            counterObserver.unobserve(counter);


        }


    });


},{


    threshold:.5


});





counters.forEach(counter=>{

    counterObserver.observe(counter);

});









/* =====================================================
   FACULTY DATABASE
===================================================== */


const facultyData=[


{

name:"Dr. Thenmozhi",

designation:"Assistent Professor",

qualification:"Ph.D Computer Science",

email:"kt@rvu.edu.in",

cabin:"B-301",

research:"Artificial Intelligence, Machine Learning",

image:"assets/faculty/Dr.-Thenmozhi-1.png"

},



{

name:"Dr. Mahadev Kalyanrao Patil",

designation:"Associate Professor",

qualification:"Ph.D Data Science",

email:"mb@rvu.edu.in",

cabin:"A-205",

research:"Data Analytics, Big Data",

image:"assets/faculty/Dr.-Mahadev-Kalyanrao-Patil-1.png"

},



{

name:"Prof. Mohammed Danish",

designation:"Assistant Professor",

qualification:"MCA",

email:"@rvu.edu.in",

cabin:"B-102",

research:"ML",

image:"assets/faculty/Prof.-Mohammed-Danish-1.png"

},
{

name:"Prof. Sharath Shetty B R",

designation:"Assistant Professor",

qualification:"MCA",

email:"ss@rvu.edu.in",

cabin:"B-102",

research:"ML",

image:"assets/faculty/Prof.-Sharath-Shetty-B-R.png"

},{

name:"Prof. Sasikala J",

designation:"Assistant Professor",

qualification:"MSc",

email:"sj@rvu.edu.in",

cabin:"B-102",

research:"Maths",

image:"assets/faculty/Prof.-Sasikala-Jeganathan1.png"
}


];








/* =====================================================
   FACULTY SEARCH & FILTER
===================================================== */


const facultyContainer =
document.getElementById("facultyContainer");



const searchInput =
document.getElementById("facultySearch");



const designationFilter =
document.getElementById("designationFilter");






function displayFaculty(list){



    if(!facultyContainer)
        return;



    facultyContainer.innerHTML="";



    list.forEach((faculty,index)=>{



        facultyContainer.innerHTML += `


<div class="col-lg-4 col-md-6">


<div class="faculty-card">


<img src="${faculty.image}"

class="faculty-image"

alt="${faculty.name}"

loading="lazy">



<div class="faculty-body">


<h4>

${faculty.name}

</h4>



<span class="designation">

${faculty.designation}

</span>



<p>

<i class="fa-solid fa-graduation-cap"></i>

${faculty.qualification}

</p>




<p>

<i class="fa-solid fa-flask"></i>

${faculty.research}

</p>



<button

class="btn btn-warning"

onclick="openFacultyModal('${faculty.email}')">

View Profile

</button>



</div>


</div>


</div>



`;



    });


}





displayFaculty(facultyData);









function filterFaculty(){



let keyword =
searchInput.value.toLowerCase();



let designation =
designationFilter.value;



let filtered =
facultyData.filter(faculty=>{


let matchName =
faculty.name
.toLowerCase()
.includes(keyword);



let matchDesignation =
designation==="all" ||
faculty.designation===designation;



return matchName && matchDesignation;



});



displayFaculty(filtered);



}







searchInput?.addEventListener(
"keyup",
filterFaculty
);



designationFilter?.addEventListener(
"change",
filterFaculty
);









/* =====================================================
   FACULTY MODAL
===================================================== */

function openFacultyModal(email) {

    const faculty = facultyData.find(f => f.email === email);

    if (!faculty) return;

    document.getElementById("facultyModalBody").innerHTML = `

    <div class="row align-items-center">

        <div class="col-md-4 text-center">

            <img src="${faculty.image}"
                 class="rounded-circle border border-3 border-warning"
                 style="width:180px;height:180px;object-fit:cover;">

        </div>

        <div class="col-md-8">

            <h3>${faculty.name}</h3>

            <h5 class="text-warning">${faculty.designation}</h5>

            <hr>

            <p><strong>Qualification:</strong> ${faculty.qualification}</p>

            <p><strong>Email:</strong> ${faculty.email}</p>

            <p><strong>Cabin:</strong> ${faculty.cabin}</p>

            <p><strong>Research Area:</strong> ${faculty.research}</p>

        </div>

    </div>

    `;

    const modal = new bootstrap.Modal(
        document.getElementById("facultyModal")
    );

    modal.show();
}

window.openFacultyModal = openFacultyModal;





window.openFacultyModal =
openFacultyModal;









/* =====================================================
   GALLERY LIGHTBOX
===================================================== */


const galleryImages =
document.querySelectorAll(
".gallery-item img"
);



const lightbox =
document.getElementById(
"lightbox"
);



const lightboxImage =
document.getElementById(
"lightboxImage"
);



galleryImages.forEach(image=>{


image.addEventListener(
"click",
()=>{


lightbox.style.display="flex";


lightboxImage.src =
image.src;


});


});






document
.querySelector(".close-lightbox")
?.addEventListener(
"click",
()=>{


lightbox.style.display="none";


});






lightbox?.addEventListener(
"click",
(e)=>{


if(e.target===lightbox){


lightbox.style.display="none";


}


});



/* =====================================================
   SCRIPT.JS PART 3
===================================================== */



/* =====================================================
   BACK TO TOP BUTTON
===================================================== */


const backToTop =
document.getElementById("backToTop");



window.addEventListener("scroll",()=>{


    if(window.scrollY > 400){


        backToTop.style.display="flex";


    }

    else{


        backToTop.style.display="none";


    }


});





backToTop?.addEventListener(
"click",
()=>{


window.scrollTo({

    top:0,

    behavior:"smooth"

});


});









/* =====================================================
   DARK / LIGHT MODE
===================================================== */


const themeToggle =
document.getElementById("themeToggle");



themeToggle?.addEventListener(
"click",
()=>{


document.body.classList.toggle(
"dark-mode"
);



const icon =
themeToggle.querySelector("i");



if(
document.body.classList.contains(
"dark-mode"
)

){


icon.classList.remove(
"fa-moon"
);


icon.classList.add(
"fa-sun"
);



}

else{


icon.classList.remove(
"fa-sun"
);


icon.classList.add(
"fa-moon"
);



}



});









/* =====================================================
   TYPING EFFECT
===================================================== */


const typingText =
document.querySelector(".typing");



if(typingText){



const words=[

"Innovation",

"Artificial Intelligence",

"Software Development",

"Future Technology"

];



let wordIndex=0;

let charIndex=0;

let deleting=false;



function typeEffect(){



let current =
words[wordIndex];



if(!deleting){



typingText.innerHTML =
current.substring(
0,
charIndex++
);



if(charIndex >
current.length){


deleting=true;


setTimeout(
typeEffect,
1200
);


return;

}



}

else{



typingText.innerHTML =
current.substring(
0,
charIndex--
);



if(charIndex===0){


deleting=false;


wordIndex++;


if(wordIndex >= words.length){

wordIndex=0;

}


}

}



setTimeout(
typeEffect,
100
);



}



typeEffect();



}









/* =====================================================
   SMOOTH SCROLL
===================================================== */


document
.querySelectorAll(
'a[href^="#"]'
)
.forEach(anchor=>{


anchor.addEventListener(
"click",
function(e){



const target =
document.querySelector(
this.getAttribute("href")
);



if(target){



e.preventDefault();



target.scrollIntoView({

behavior:"smooth"

});



}



});


});









/* =====================================================
   RIPPLE BUTTON EFFECT
===================================================== */


document
.querySelectorAll(
".btn"
)
.forEach(button=>{


button.addEventListener(
"click",
function(e){



let ripple =
document.createElement(
"span"
);



ripple.className="ripple-effect";



this.appendChild(ripple);



let x =
e.clientX -
this.offsetLeft;



let y =
e.clientY -
this.offsetTop;



ripple.style.left =
x+"px";



ripple.style.top =
y+"px";



setTimeout(()=>{


ripple.remove();


},600);



});


});









/* =====================================================
   ACTIVE NAVIGATION ON SCROLL
===================================================== */


const sections =
document.querySelectorAll(
"section"
);



const navLinks =
document.querySelectorAll(
".nav-link"
);



window.addEventListener(
"scroll",
()=>{


let current="";



sections.forEach(section=>{


let sectionTop =
section.offsetTop - 120;



if(
scrollY >= sectionTop
){

current =
section.getAttribute("id");


}


});



navLinks.forEach(link=>{


link.classList.remove(
"active"
);



if(
link.getAttribute("href")
===
"#"+current
){


link.classList.add(
"active"
);


}



});



});









/* =====================================================
   LAZY IMAGE LOADING
===================================================== */


const lazyImages =
document.querySelectorAll(
"img[loading='lazy']"
);



const imageObserver =
new IntersectionObserver(
(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


const image =
entry.target;



image.src =
image.dataset.src ||
image.src;



imageObserver.unobserve(
image
);



}



});



});





lazyImages.forEach(image=>{


imageObserver.observe(image);


});









/* =====================================================
   MOBILE MENU AUTO CLOSE
===================================================== */


const navLinksMobile =
document.querySelectorAll(
".navbar-nav .nav-link"
);



const navbarCollapse =
document.querySelector(
".navbar-collapse"
);



navLinksMobile.forEach(link=>{


link.addEventListener(
"click",
()=>{


if(
window.innerWidth < 1400
){


const bsCollapse =
bootstrap.Collapse
.getInstance(
navbarCollapse
);



bsCollapse?.hide();



}


});


});









/* =====================================================
   FINAL INITIALIZATION
===================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Department of Computer Applications Website Loaded Successfully"
);



});



