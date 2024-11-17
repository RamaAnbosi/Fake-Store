const getCategories = async() => {
const {data} = await axios.get('https://dummyjson.com/products/category-list');
return data;
}

const DisplayCategories = async() =>{
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active"); 

try {
    

    const categories = await getCategories();

    const result = categories.map((category)=>{
        return `<div class="category">
        <h2>${category}</h2>
        <a href='CategoryDetails.html?category=${category}'>Details</a>
        </div>`
    }).join('');

    document.querySelector(".categories .row").innerHTML=result;

    } catch (error) {
     document.querySelector(".categories .row").innerHTML="<p>error loading categories</p>";
}
finally{
     loader.classList.remove("active");
}
   



}


const getProducts = async(page) => {

    const skip = (page - 1 ) * 30;
    const {data} = await axios.get(`https://dummyjson.com/products?limit=30&skip=${skip}`);
    return data;
    }
    
    const DisplayProducts = async(page = 1) =>{
        const loader = document.querySelector(".loader-container");
        loader.classList.add("active"); 
        try{
        const data = await getProducts(page);
        const numberOfPages = Math.ceil(data.total / 30);

        const result = data.products.map((product)=>{
            return `
            <div class="product">
            <img src="${product.thumbnail}" alt="${product.description}"class='images'/>
            <h3>${product.title}</h3>
            <span>${product.price}</span>
            </div>
            `
        }).join('');
        document.querySelector(".products .row").innerHTML=result;

        let paginationLinks =``;
        if(page == 1){
            paginationLinks += `<li class="page-item"><button  class="page-link" disabled>&laquo;</button></li>`;
        }else{
    paginationLinks += `<li class="page-item"><button onclick=DisplayProducts('${page-1}') class="page-link" 
    >&laquo;</button></li>`;
        }


        for(let i=1;i<=numberOfPages;i++){
    paginationLinks+=`<li class="page-item '${i== page? 'active':''}'"><button onclick=DisplayProducts('${i}')
    class="page-link" >${i}</button></li>`;  
        }

        if(page == numberOfPages){
            paginationLinks+=`<li class="page-item"><button disabled class="page-link" >&raquo;</button></li>`;

        }else{
            paginationLinks+=`<li class="page-item"><button onclick=DisplayProducts('${parseInt(page)+1}')
             class="page-link" >&raquo;</button></li>`;

        }
 

    document.querySelector(".pagination").innerHTML = paginationLinks;

    modal();
   
          } catch (error) {
     document.querySelector(".products .row").innerHTML="<p>error loading products</p>";
}
finally{
     loader.classList.remove("active");
}
    
    }


DisplayCategories();
DisplayProducts();

window.onscroll= function(){
    const nav = document.querySelector(".header");
    const countdown = document.querySelector(".countdown");

    if(window.scrollY > countdown.offsetTop){
        nav.classList.add("scrollNavbar");
    }else{
        nav.classList.remove("scrollNavbar");
    }
}

const countdown=()=>{
    const countDownDate = new Date("2025-03-01T00:00:00").getTime();
    const now = new Date().getTime();
    const distance = countDownDate - now;
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor( (distance % 86400000) / 3600000);
    const minutes = Math.floor((distance%(1000*60*60)) / (60000) );
    const seconds = Math.floor((distance%(1000*60)) / 1000 );

    document.querySelector("#days").textContent=days;
    document.querySelector("#hours").textContent=hours;
    document.querySelector("#minutes").textContent=minutes;
    document.querySelector("#seconds").textContent=seconds;

}
setInterval( ()=>{
    countdown();
},1000)

function modal(){
    const modal =document.querySelector(".my-modal");
    const closeBtn =document.querySelector(".close-btn");
    const leftBtn =document.querySelector(".left-btn");
    const rightBtn =document.querySelector(".right-btn");
    const images =Array.from(document.querySelectorAll(".images"));
   let currentIndex=0;
    images.forEach(function (img){
        img.addEventListener("click",function(e){
            modal.classList.remove('d-none');
            modal.querySelector("img").setAttribute("src",e.target.src);

            const currentImage=e.target;
             currentIndex=images.indexOf(currentImage);

        })
    })



    leftBtn.addEventListener("click",function(){
        currentIndex--;
        if(currentIndex < 0){
        currentIndex =images.length-1;
        }
        const src =images[currentIndex].src;
        modal.querySelector("img").setAttribute("src",src);
         });



    rightBtn.addEventListener("click",function(){
       currentIndex++;
       if(currentIndex >= images.length){
       currentIndex=0;
       }
       const src =images[currentIndex].src;
       modal.querySelector("img").setAttribute("src",src);
        });


        closeBtn.addEventListener("click",function(){
            modal.classList.add('d-none');
        });


        document.addEventListener("keydown",function(e){
            if(e.code == 'ArrowRight'){
                currentIndex++;
                if(currentIndex >= images.length){
                    currentIndex =0;
                }
                const src =images[currentIndex].src;
                modal.querySelector("img").setAttribute("src",src);
            }else if(e.code == 'ArrowLeft'){
                currentIndex--;
                if(currentIndex < 0){
                currentIndex =images.length-1
                }
                const src =images[currentIndex].src;
                modal.querySelector("img").setAttribute("src",src);
            }else if(e.code == 'Escape'){
                modal.classList.add('d-none');
            }
            
            
        })
}