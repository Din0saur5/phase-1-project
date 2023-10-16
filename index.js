//DOMContentLoaded event
addEventListener("DOMContentLoaded",()=>{

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
          const subject = bookInfo.subjects[0].name
          const worksID = bookInfo.key
          
        console.log('Title:', title);
        console.log('Authors:', authors);
        console.log('Page Count:', pageCount);
        console.log('URL ID:', urlID);
        console.log('Cover Image:', coverImg);
        console.log('Subject:', subject);
        console.log('Works ID:', worksID);
            
        




        const coverOD = document.getElementById('cover')
        const urlOD = document.getElementById('url')
        const moreInfo = document.getElementById('more-info')
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
         }else{
            const calc = document.getElementById("calculator")
            calc.querySelector("input").disabled = true
            document.getElementById('page-count').textContent = `Page Count: Not Available -- Calculator disabled`
         }
          
         //subject
         if(subject)
         {document.getElementById('subject').textContent = `Subject: ${subject}`}
          
         //worksID for description fn
         getBookdesc(worksID)

        }//add catch for failed search
    
    })
}
   

function getBookdesc(worksID){
    fetch(`https://openlibrary.org${worksID}.json`)
    .then(resp=>resp.json())
    .then(data=>{
        console.log(data)
        const desc = data.description.value
        if(desc){
        document.getElementById("desc").textContent = `Descritpion: ${desc}`
        }
    })
}

//submit event
  const search = document.getElementById("search-form")
    search.addEventListener("submit",(e)=>{
        e.preventDefault()
        const searchValue = search.searchInput.value
        console.log(searchValue);
        const searchType = document.getElementById("search-type")
        
       if(searchType.value ==="ISBN"){
        getBookInfo(searchValue);
     }else{
        searchBook(searchValue)
     }
 })

    // hover event info
        const tooltipIcon = document.querySelector(".tooltip");
        const toolText = document.querySelector(".tooltiptext");

        tooltipIcon.addEventListener("mouseenter", () =>{
            toolText.style.visibility = "visible";
            toolText.style.opacity = 1;
        })

        // Add a mouseout event listener to hide the tooltip
        tooltipIcon.addEventListener("mouseleave", () =>{
            toolText.style.visibility = "hidden";
            toolText.style.opacity = 0;
        })
    
    


  
  
 
  


})