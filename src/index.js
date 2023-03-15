const publicKey = "b8fc653e4c665c298f39e09a5910fdb2";
const url = "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=b8fc653e4c665c298f39e09a5910fdb2&hash=c49a3333f681576f5c83cc8a4c56d97d&limit=100";
const searchText = document.getElementById("searchText");
const searchCard = document.getElementById("searchCard");

// We will create two websites to render
const pages = {
  home: `<div class="mx-auto mt-5" ><div class="spinner-border text-white"style="width: 7rem; height: 7rem;" role="status">
    <span class="visually-hidden">Page Is Loading...</span>
  </div></div>`,
  favourite: `<p class="text-white">Your favourites section is empty</p>`,
};

let applicationData = [];
let favouriteHeroList = [];
let favouriteHeroData = "";

// This is for loading content of different pages 
function loadContent() {
  var root = document.getElementById("root"),
    fragmentId = location.hash.slice(1);

    //We will be checking which page is currently shown.
  if (fragmentId === "favourite") {
    root.innerHTML = pages[fragmentId];

    let removeFavButton = document.querySelectorAll(".unfavButton");
    //For deleting hero from fav list
    if (removeFavButton) {
      for (let button of removeFavButton) {
        button.addEventListener(
          "click",
          (e) => {
            let index = favouriteHeroList.indexOf(
              e.target.parentElement.firstElementChild.innerText
            );

            favouriteHeroList.splice(index, 1);
            window.localStorage.setItem(
              "favData",
              JSON.stringify(favouriteHeroList)
            );
            window.location.reload();
          },
          false
        );
      }
    }
  } else {
    root.innerHTML = pages[fragmentId];
  }
}

if (!location.hash) {
  location.hash = "#home";
}

loadContent();

window.onload = async () => {
  //For getting all the data of superheroes using fetch api
  let response = await fetch(url);
  let responsedPromise = response.json();
  let result = await responsedPromise;
  let data = result.data.results;
  applicationData = [...data];
  let homeData = "";
  data.forEach((element) => {
//For setting home page content after the page loads
  homeData += `<div class="card border border-5 border-dark bg-info text-white flex-grow-1" style="width: 18rem;">
      <img src=${element.thumbnail.path}.jpg class="card-img-top" alt="Hero Image" style="height:15rem">
      <div class="card-body d-flex flex-column align-items-center gap-2">
        <h5 class="card-title "style="color: black;" >${element.name}</h5>
         
        <span class="text-dark">Number of Series: <span class="text-white">${element.series.available
        }</span></span>
          <span class="text-dark">Total Stories: <span class="text-white">${element.stories.available
        }</span></span>
          <a href=${element.urls[2] ? element.urls[2].url : "..."
        } class="btn btn-dark bg-opacity-25" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
        }</span></span></a>
          <a href=${element.description.path
        } class="btn btn-dark bg-opacity-25" style="width:90%;" target="_blank">More Detail</a>
      </div>
    </div>`;
  });
  //To set favourite page content 
  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));
  if (savedLocalFavData !== null && savedLocalFavData.length > 0) {
    favouriteHeroList = savedLocalFavData;
    data.forEach((element) => {
      for (let item of savedLocalFavData) {
        if (element.name === item) {
          favouriteHeroData += `<div class="card border border-5 border-dark bg-info text-white " style="width: 18rem;">
      <img src=${element.thumbnail.path
            }.jpg class="card-img-top" alt="..." style="height:15rem">
      <div class="card-body d-flex flex-column align-items-center gap-2">
        <h5 class="card-title ">${element.name}</h5>
       
        <span class="text-light">Series: <span class="text-white">${element.series.available
            }</span></span>
        <span class="text-light">Stories: <span class="text-white">${element.stories.available
            }</span></span>
        <a href=${element.urls[2] ? element.urls[2].url : "..."
            } class="btn btn-dark" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
            }</span></span></a>
        <a href=${element.urls[0].url
            } class="btn btn-dark" style="width:90%" target="_blank">More Detail</a>
        <a
            
           class="btn btn-dark unfavButton" style="width:90%" >Unfavourite</a>
          </div>
    </div >; `;
        }
      }
    });
    pages["favourite"] = favouriteHeroData;
  }

  pages["home"] = homeData;
  loadContent();
};

//To set handling in the search bar in nav 

searchText.addEventListener("input", function handleSearch(e) {
  searchCard.innerHTML = "";
  searchCard.style.height = "0";

  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));
  let value = e.target.value;
  let emptyData = [];
  if (value) {
    searchCard.style.height = "200px";
    let SuggestedData = applicationData.map((item) => {
      return { name: item.name, url: item.urls[0].url };
    });
    emptyData = SuggestedData.filter((item) => {
      return item.name.toLowerCase().startsWith(value.toLowerCase());
    });
    if (emptyData[0]) {
      emptyData.forEach((item) => {
        let flag = false;
        if (savedLocalFavData) {
          for (let data of savedLocalFavData) {
            flag = item.name === data;
            if (flag) {
              break;
            }
          }
        }

        searchCard.innerHTML += `<li class="d-flex justify-content-between align-items-center border-bottom"> <a href=${item.url
          } class="text-decoration-none text-light" style="font-size:15px" target="_blank">${item.name
          }</a>
                      <button type="button" class="btn btn-link text-white fav-button"  
            >${flag ? "Unfavourite" : "Add to Favourite"} </button></li>`;
      });
      let buttons = document.querySelectorAll(".fav-button");

      for (let button of buttons) {
        button.addEventListener("click", (e, item) => {
          handleFavourites(e, item);
        });
      }
    } else {
      searchCard.innerHTML = `<p style="text-align:center;margin-top:25%" class="text-white">No Result </p>`;
    }
  }
});

// handling favourite and unfavourite from search bar
function handleFavourites(e, item) {
  favouriteHeroData = "";
  let savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));

  let count = favouriteHeroList.indexOf(
    e.target.previousElementSibling.innerText
  );
  if (count === -1) {
    favouriteHeroList.push(e.target.previousElementSibling.innerText);
    window.localStorage.setItem("favData", JSON.stringify(favouriteHeroList));
    savedLocalFavData = JSON.parse(window.localStorage.getItem("favData"));

    e.target.innerText = "Unfavourite";
    applicationData.forEach((element) => {
      for (let item of savedLocalFavData) {
        if (element.name === item) {
          favouriteHeroData += `<div class="card bg-info text-white " style="width: 18rem;">
        <img src=${element.thumbnail.path
            }.jpg class="card-img-top" alt="..." style="height:15rem">
        <div class="card-body d-flex flex-column align-items-center gap-2">
          <h5 class="card-title">${element.name}</h5>
         
          <span class="text-light">Series: <span class="text-white">${element.series.available
            }</span></span>
          <span class="text-ligh">Stories: <span class="text-white">${element.stories.available
            }</span></span>
          <a href=${element.urls[2] ? element.urls[2].url : "..."
            } class="btn btn-dark" style="width:90%" target="_blank" > <span class="text-white">Comics: <span class="text-white">${element.comics.available
            }</span></span></a>
          <a href=${element.urls[0].url
            } class="btn btn-dark" style="width:90%" target="_blank">More Detail</a>
          <a 
           class="btn btn-dark unfavButton" style="width:90%" >Unfavourite</a>
            </div>
      </div >; `;
        }
      }
    });

    pages["favourite"] = favouriteHeroData;
    if (window.location.hash.slice(1) === "favourite") {
      loadContent();
    }
  } else if (count !== -1) {
    savedLocalFavData.splice(count, 1);
    window.localStorage.setItem("favData", JSON.stringify(savedLocalFavData));
    e.target.innerText = "Favourite";
    window.location.reload();
  }
}

// added hash eventlistener to know when page is changed to between pages
window.addEventListener("hashchange", loadContent);
// end 