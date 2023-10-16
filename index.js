addEventListener("DOMContentLoaded",()=>{


function getBookInfo(isbn) {
    // Construct the API URL to get book information and ratings
    const apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json&additional=bib_key,rating`;
  
    // Make a GET request to the API
    fetch(apiUrl)
      .then(resp => resp.json())
      .then(data => {
        // Check if the ISBN key exists in the response
        if (`ISBN:${isbn}` in data) {
          const bookInfo = data[`ISBN:${isbn}`];
            console.log(bookInfo)
          // Extract the desired information
          const title = bookInfo.title;
          const authors = bookInfo.authors.map(author => author.name).join(', ');
          const pageCount = bookInfo.number_of_pages;
          const urlID = bookInfo.url || 'No ratings available';
          const coverImg = bookInfo.cover.medium
          const subject = bookInfo.subjects[0].name
            
          // You can now use this information in your application
          console.log('Title:', title);
          console.log('Authors:', authors);
          console.log('Page Count:', pageCount);
          console.log(urlID)
          console.log(coverImg)
          console.log(subject)
        const coverOD = document.getElementById('cover')
          coverOD.src = coverImg;
          coverOD.alt = `Picture of ${title} cover`
          document.getElementById('title').textContent = title
          document.getElementById('authors').textContent = authors
          document.getElementById('url').textContent = urlID
          document.getElementById('page-count').textContent = pageCount
          document.getElementById('subject').textContent = subject
        }//add catch for failed search
    
    })

   }

function getBookWorks(worksID){
    fetch(`https://openlibrary.org/books/${worksID}.json`)
    .then(resp=>resp.json())
    .then(data=>{
        const isbn = data.isbn_13
        const desc = data.description
        getBookInfo(isbn)
        document.getElementById("desc").textContent = desc

    })
}


  const search = document.getElementById("search-form")
    search.addEventListener("submit",(e)=>{
        e.preventDefault()
        const searchValue = search.searchInput.value
        console.log(searchValue);
        getBookWorks(searchValue);
    })  
  
 
  
// i need a data base to pull info from api/server
// i need a a search bar found in html
//i need a button to send the input when Im typing it in html
// need a place to put the info after it is returned console log

})