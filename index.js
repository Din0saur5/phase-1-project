//DOMContentLoaded event
addEventListener("DOMContentLoaded",()=>{
  let countNum;
  const coverOD = document.getElementById('cover')
  const urlOD = document.getElementById('url')
  const moreInfo = document.getElementById('more-info')
  const calc = document.getElementById("calculator")
//buggy title search fetch  
function searchBook(search){
    const searchFormat = search.split(' ').join('+')
    console.log(searchFormat)
    
    fetch(`https://openlibrary.org/search.json?title=${searchFormat}&lang=eng&fields=*,availability&limit=1`)
    .then(resp=>resp.json())
    .then(data=>{
        console.log(data)
    const isbnP = data.docs[0].isbn[0]
    console.log(isbnP)
    getBookInfo(isbnP)
    })
}
//isbn fetch on request
function getBookInfo(isbn) {
    // Construct the API URL to get book information and ratings
    const apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`;
    // Make a GET request to the API
    fetch(apiUrl)
      .then(resp => resp.json())
      .then(data=> {
        // Check if the ISBN key exists in the response
        if(`ISBN:${isbn}` in data){
            const bookInfo = data[`ISBN:${isbn}`]
        
            console.log(bookInfo)
          // Extract the desired information
          const title = bookInfo.title;
          const authors = bookInfo.authors.map(author => author.name).join(', ');
          const pageCount = bookInfo.number_of_pages;
          const urlID = bookInfo.url;
          const coverImg = bookInfo.cover.medium
          const worksID = bookInfo.key
          
          
        console.log('Title:', title);
        console.log('Authors:', authors);
        console.log('Page Count:', pageCount);
        console.log('URL ID:', urlID);
        console.log('Cover Image:', coverImg);
        
        console.log('Works ID:', worksID);
           
        //cover img 
        if(coverImg)
        {coverOD.src = coverImg;
        coverOD.alt = `Picture of ${title} cover`}

        //title and author  
          document.getElementById('title').textContent = title
          document.getElementById('authors').textContent = authors
        //more info url
          if (urlID){
          moreInfo.textContent = "More Info: "
          urlOD.textContent = `${urlID}`
            urlOD.setAttribute('href',`${urlID}`)
          }
        //page count
         if(pageCount){
          document.getElementById('page-count').textContent = `Page Count: ${pageCount}`
          calc.querySelector("input").disabled = false
         // countNum = pageCount

         }else{
            
            calc.querySelector("input").disabled = true
            document.getElementById('page-count').textContent = `Page Count: Not Available -- Calculator disabled`
         }
         const userData = document.getElementById("user-data")
         if(userData.querySelector("button"))
         {userData.querySelector("button").remove()}
          const favBtn = document.createElement("button")
          favBtn.innerText ="❤️Add Favorite!"
          userData.appendChild(favBtn)
          favBtn.addEventListener("click",()=>{
            const newFav ={
              "title": title,
              "isbn": isbn,
              "author": authors,
              "cover": coverImg
            }
            //add post req
            renderFavs()
          })
          document.getElementById('subject').textContent = ' '
          document.getElementById("desc").textContent =  ' '
         //worksID for description fn
         getBookdesc(worksID)

        }
    
    })//add catch for failed search
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
        .then(search.reset())
     }else{
        searchBook(searchValue)
        .then(search.reset())
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
    const randomId = getRandomNumber(1,111)   
      fetch(`http://localhost:3000/top-200/${randomId}`)
      .then(resp=>resp.json())
      .then(data=>{
        console.log(data)
        getBookInfo(data.isbn)
      })

})

//pull favs from json server
function getFavs(){
  fetch(' http://localhost:3000/favorite-books')
  .then(resp=>resp.json())
  .then(data=>{
    data.foreach(book=>renderFavs(book))
  })

}
getFavs()
//render favs
const renderFavs = (bookObj)=>{
console.log(bookObj)

}
    
 


// chris there are some notes in the html also do your work under this note for now practice making the calculation using countNum ("200 pages")
//we can put it all together after it works
countNum = 200



  
  
 
  


})