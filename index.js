//DOMContentLoaded event
document.addEventListener("DOMContentLoaded",()=>{
 
  //list of variables "On-Document"
   let countNum;
   const coverOD = document.getElementById('cover')
   const urlOD = document.getElementById('url')
   const moreInfo = document.getElementById('more-info')
   const calc = document.getElementById("calculator")
   const titleOD = document.getElementById('title')
   const authorsOD = document.getElementById('authors')
   const pageCountOD = document.getElementById('page-count')
   const subjectOD = document.getElementById('subject')
   const descOD = document.getElementById("desc")
   const timeDisp = document.getElementById("reading-value")
   const favorites = document.getElementById("favorites")

 //buggy title search fetch  
 function searchBook(search){
     const searchFormat = search.split(' ').join('+')
     console.log(searchFormat)
    
     fetch(`https://openlibrary.org/search.json?title=${searchFormat}&language:eng&fields=*,availability&limit=1`)
     .then(resp=>resp.json())
     .then(data=>{
         console.log(data)
     const isbnP = data.docs[0].isbn[0]
     console.log(isbnP)
     getBookInfo(isbnP)
     })
     .catch((error)=>{
       console.error('Fetch error:',error)
       console.log('An error occurred while searching for the book.')
     })
 }
 //isbn fetch on request
 function getBookInfo(isbn) {
      clearInfo()
      document.body.classList.add('wait-cursor')
    
     fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`)
       .then(resp => resp.json())
       .then(data=> {
         document.body.classList.remove('wait-cursor');
         // Check ISBN key exists in the resp
         if(`ISBN:${isbn}` in data){
             const bookInfo = data[`ISBN:${isbn}`]
             console.log(bookInfo)

           //info
           const title = bookInfo.title;
           const authors = bookInfo.authors.map(author => author.name).join(', ');
           const pageCount = bookInfo.number_of_pages;
           const urlID = bookInfo.url;
           const coverImg = bookInfo.cover
           const worksID = bookInfo.key
          
        
         console.log('Title:', title);
         console.log('Authors:', authors);
         console.log('Page Count:', pageCount);
         console.log('URL ID:', urlID);
         
         console.log('Works ID:', worksID);
            
         //cover img
         if(coverImg)
          {coverOD.src = coverImg.medium;
          coverOD.alt = `Picture of ${title} cover`}
 
 
         //title and author  
           titleOD.textContent = title
           authorsOD.textContent = authors
         //more info url
           if (urlID){
           moreInfo.textContent = "More Info: "
           urlOD.textContent = `${urlID}`
             urlOD.setAttribute('href',`${urlID}`)
           }
         //page count
          if(pageCount){
           pageCountOD.textContent = `Page Count: ${pageCount}`
           calc.querySelector("button").disabled = false
           calc.querySelector("button").style = "background-color: #e3faed;"
          countNum = parseInt(pageCount)
          
 
          }else{
            
             calc.querySelector("button").disabled = true
             calc.querySelector("button").style = "background-color: #D1C1A0;"
             document.getElementById('page-count').textContent = `Page Count: Not Available -- Calculator disabled`
          }
 
 

   // add favorites btn
          const userData = document.getElementById("user-data")
          if(userData.querySelector("button"))
          {userData.querySelector("button").remove()}
 
 
           const favBtn = document.createElement("button")
           
           favBtn.innerText ="Add Favorite!"
           userData.appendChild(favBtn)
  
           favBtn.addEventListener("click",()=>{


    //favorites authors overflow catch 
            const authLen = authors.split(",")
            console.log(authLen)
            let authorsM
            if(authLen.length > 1){
             authorsM = "Various Authors"
             } else{
                authorsM = authors
             }
             let favCov
             if(coverImg){ favCov = coverImg.small}
             else{favCov = "no cover"}
             let newFav ={
              "title": title,
              "isbn": isbn,
              "author": authorsM,
              "cover": favCov
            }
            
             fetch('http://localhost:3000/favorite-books',{
               method:'POST',
               headers:{
                 "Content-Type":"application/json",
                 "accepts":"application/json"
               },
               body: JSON.stringify(newFav)
 
 
             })
             .then(resp=>resp.json())
             .then(data=>{console.log(data);
               clearFavs()
               getFavs()
             })
            
          
           .catch((error) => {
             console.log(error)
             console.log('An error occurred while adding the book to favorites.');
           })
         })
 
 
          
          
          //worksID for description fn
          getBookdesc(worksID)
         }
          
     })
     .catch((error) => {
       document.body.classList.remove('wait-cursor');
       console.error('Fetch error:', error);
       console.log('An error occurred while fetching book information.');
     })
     .then(()=>search.reset())
    
 }

 //clear favorites
 function clearFavs(){
  const favH = document.createElement("h1")
  favH.textContent = "Favorites:"
  const bookStyle = document.createElement("img")
  bookStyle.src = "./bookborderS.png"
  bookStyle.style= "margin-block-start: -20px;"
    favorites.replaceChildren(bookStyle, favH,)
}
 
 
 // clear info function
 function clearInfo(){
     timeDisp.innerText=''
     subjectOD.textContent = ''
     descOD.textContent =  ''
     titleOD.textContent = ''
     authorsOD.textContent = ''
     coverOD.src = ''
     coverOD.alt=''
     moreInfo.textContent = ''
     urlOD.innerText = ''
     urlOD.href = ''
     pageCountOD.textContent=''
     calc.speed.selectedIndex = 0
     calc.litCon.selectedIndex = 0
 }  
 
 
 
 
 
 
 
 //works id fetch to get description
 function getBookdesc(worksID){
     fetch(`https://openlibrary.org${worksID}.json`)
     .then(resp=>resp.json())
     .then(data=>{
         console.log(data)
         let desc = data.description
         if (typeof desc === 'object') {
           desc = data.description.value
         }
         if(desc){
         document.getElementById("desc").textContent = `Descritpion: ${desc}`
         }
         let subject = data.subjects[1]
        
          //subject
          if(subject)
          {document.getElementById('subject').textContent = `Subject: ${subject}`}
        
     })
     .catch((error) => {
       console.error('Fetch error:', error);
       console.log('An error occurred while fetching book description.');
     });
 }
 
 
 //submit event for search
   const search = document.getElementById("search-form")
     search.addEventListener("submit",(e)=>{
         e.preventDefault()
         const searchValue = search.searchInput.value
         console.log(searchValue)
         const searchType = document.getElementById("search-type")
        
        if(searchType.value ==="ISBN"){
         getBookInfo(searchValue)
         
      }else{
         searchBook(searchValue)
         
      }
      
  })
 
 
     // hover event info (tool tip)
         const tooltipIcon = document.querySelector(".tooltip");
         const toolText = document.querySelector(".tooltiptext");
 
 
         tooltipIcon.addEventListener("mouseenter", () =>{
             toolText.style.visibility = "visible";
             toolText.style.opacity = 1;
         })
         tooltipIcon.addEventListener("mouseleave", () =>{
             toolText.style.visibility = "hidden";
             toolText.style.opacity = 0;
         })
    
 // randomish book generator click event
 const random = document.getElementById("generateRandomButton")
 const getRandomNumber = (min, max)=>
     {
       return Math.floor(Math.random()*(max-min)+ min);
     }
 random.addEventListener("click", ()=>{
     const randomId = getRandomNumber(1,200)  
       fetch(`http://localhost:3000/top-200/${randomId}`)
       .then(resp=>resp.json())
       .then(data=>{
         console.log(data)
         getBookInfo(data.isbn)
       })
       .catch((error) => {
         console.error('Fetch error:', error);
         console.log('An error occurred while fetching a random book.');
       });
 
 
 })
 
 
 //pull favs from json server
 function getFavs(){
   fetch(' http://localhost:3000/favorite-books')
   .then(resp=>resp.json())
   .then(data=>{
     data.forEach(book=>renderFavs(book))
   })
   .catch((error) => {
     console.error('Fetch error:', error);
     console.log('An error occurred while fetching your favorite books.');
   });
 
 
 }
 clearFavs()
 getFavs()

 //render favs
 const renderFavs = (bookObj)=>{
    console.log(bookObj)
    //clear
    
    //create
    const favWrap = document.createElement("div")
    const favDiv = document.createElement("div")
    const favTitle = document.createElement("p")
    const favAuthor = document.createElement('p')
    const favImg = document.createElement('img')
    const dltFav = document.createElement('button')
    //define
    favWrap.setAttribute("class","favWrap")
    favDiv.setAttribute("class","fav")
    favTitle.setAttribute("class","favDet")
    favTitle.textContent= bookObj.title
    favAuthor.setAttribute("class","favDet")
    favAuthor.textContent= `By: ${bookObj.author}`
    favImg.setAttribute("class","favDet")
    if(bookObj.cover == "no\ncover"){
       favImg.alt = bookObj.cover
       
    }else{favImg.src = bookObj.cover}
    favorites.appendChild(favWrap)
    favWrap.appendChild(favDiv)
    dltFav.textContent="x"
    dltFav.setAttribute("class","fav")
    //append
    favDiv.appendChild(favImg)
    favDiv.appendChild(favTitle)
    favDiv.appendChild(favAuthor)
    favWrap.appendChild(dltFav)
    

    //reference favorite
    favDiv.addEventListener("click",()=>{
      getBookInfo(bookObj.isbn)
    })
    
    
    
    
    //delete from favs
    dltFav.addEventListener("click",()=>{
      //because the id's refactor after deletion
      //have to update the booksobj before deletion 
      //get server data, check data against the object isbn
      //return id based on isbn and delete that way
      //there is definitely an easier way and could potentially change server settings
      //but I dont want to screw it up for future use.
      let bookid
        fetch('http://localhost:3000/favorite-books')
        .then(resp=>resp.json())
        .then(data=>{
          console.log(data)
          data.forEach((el)=>{
            if(el.isbn === bookObj.isbn){
              bookid = el.id
              console.log(bookid)
              
            }
          })
        })
        .then(()=>{
          
      fetch(`http://localhost:3000/favorite-books/${bookid}`,{
        method:'DELETE'
      })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP Error: ${resp.status}`)
        }
        return resp.json();
      })
      .then(() => {
        favWrap.remove();
      })
      .catch((error) => {
        console.error('Delete error:', error);
        console.log('An error occurred while deleting the favorite book.')
      })
    })
    })
      
 }
  
 



// chris there are some notes in the html also do your work under this note for now practice making the calculation using countNum ("200 pages")
//we can put it all together after it works


calc.addEventListener("submit",(e)=>{
  e.preventDefault()
  console.log(countNum)
  calculateTime(countNum)

  
})
function calculateTime(pages){
  const speed = parseFloat(`${calc.speed.value}`)
  
  const conf = parseFloat(`${calc.litCon.value}`)
 
  const totalMins = Math.floor ((pages / speed) * conf)
  const hours = Math.floor (totalMins / 60)
  const minutes = Math.floor (totalMins % 60)
  if(hours || minutes){
  
    timeDisp.innerText = `${hours} hours and ${minutes} minutes `

  }else{
    alert("Please select your reading speed and literacy confidence level")
  } 
  
 
 
}
  
  
 



 
 
 
 
 })
 