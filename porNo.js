

let links = [];
let size = -1;
let counter = 0;
let safeSearch = '&safe=active';
let defaultLink = 'https://ukrtelecom.ua/';


main();


function main() {
  let location = window.location;

  if (isUnsafeGoogleSearch(location)) {
    window.location.href = location + safeSearch;
    return;
  }

    
    chrome.storage.local.get("realtimeBannedLinks", function(returnValue) {
      let firebaseLinks = returnValue.realtimeBannedLinks;
      let hostname = location.hostname;


      
      if (isBannedFirebase(firebaseLinks) && location.hostname !== 'console.firebase.google.com' && location.hostname !== 'www.google.com') {
        if (  hostname.includes('google') ||
              hostname.includes('gmail')  ||
              hostname.includes('youtube') ||
              hostname.includes('amazon') ||
              hostname.includes('instagram') ||
              hostname.includes('is.muni.cs') ||
			  hostname.includes('ukrtelecom') ||
              hostname.includes('virtual-addiction')
            ) {
                return;
              }
        else {
          PorNo();
        }
      }
      
      else {
        checkURL();
      }
    });

    
    if (isBannedURL() && window.location.hostname !== 'console.firebase.google.com' && window.location.hostname !== 'www.google.com') {
      let hostname = window.location.hostname;

      if (  hostname.includes('google') ||
            hostname.includes('gmail')  ||
            hostname.includes('youtube') ||
            hostname.includes('amazon') ||
            hostname.includes('instagram') ||
            hostname.includes('is.muni.cs') ||
			hostname.includes('ukrtelecom') ||
            hostname.includes('virtual-addiction')
          ) {
              return;
            }
      else {
        PorNo();
      }
    }

}


function checkURL() {
  
}


function PorNo() {
  window.stop()

  let allKeys;

  chrome.storage.sync.get(null, function(items) {
    urls = Object.keys(items);
    size = urls.length;

    if (urls[0] !== undefined) {
        // Iterate through the urls array
        //  and add the urls to our links list to select from
        for (let i = 0; urls[i] !== undefined; i++) {
          links.push(urls[i]);
        }
        openLink();
    }
    else {
      // When your wholesome list is empty, redirect to quality education
      window.location.href = defaultLink;
    }
  });
}

function openLink() {
  let linkIndex = Math.floor(Math.random() * links.length);
  let linkToOpen = links[linkIndex];
  window.location.href = linkToOpen;
}

function evaluateWords() {
  let counter = 0;

  let url = window.location.href.toLowerCase();

  while (url.indexOf('-') != -1) {
    url = url.replace('-', ' ');
  }
  while (url.indexOf('+') != -1) {
    url = url.replace('+', ' ');
  }

  for (let i = 0; i < bannedWordsList.length; i++) {
    if (url.includes(bannedWordsList[i].toLowerCase())) {
      counter++;
    }
    if (counter >= 4) {
      return true;
    }
  }

  
  return false;
}

function checkTitle() {
  $(document).ready(function () {
    let title = document.title.toLowerCase();
    let ctr = 0;

    for (let i = 0; i < bannedWordsList.length; i++) {
      if (title.includes(bannedWordsList[i])) {
        ctr++;
      }
    }
    if (ctr >= 3) {
      store(window.location.hostname);
    }
  });
}

function store(url) {
  if (url.includes('www.')) {
    let idxOfPeriod = url.indexOf('.');
    url = url.substring(idxOfPeriod + 1, url.length);
  }

  chrome.storage.local.set({[url]: url}, function() {});

  chrome.storage.local.get("realtimeBannedLinks", function(returnValue) {
    let urls = returnValue.realtimeBannedLinks;
    urls.push(url);

    chrome.storage.local.set({realtimeBannedLinks:urls}, function() {});
  });
}
function isBannedFirebase(linksFromFirebase) {
  let url = window.location.href.toLowerCase();

  if (linksFromFirebase && !url.includes('fightthenewdrug') && !url.includes('github') ) {
    for (let i = 0; linksFromFirebase[i]; i++) {
      if (url.includes(linksFromFirebase[i].toLowerCase())) {
        return true;
      }
    }
  }

  
  return false;
}

function isBannedURL() {

  let url = window.location.hostname.toLowerCase();
  let idx = url.indexOf('.');

  if (idx < 8) {
    url = url.substring(idx + 1);
  }

  if (!url.includes('fightthenewdrug') && !url.includes('github') ) {
    if (pornMap[url]) {
      window.stop();
      return true;
    }
  }

  // Inconclusive
  return false;
}

function checkWithIBM() {
  let url = window.location.hostname;
  let api = 'https://api.xforce.ibmcloud.com/url/' + url;

  if (!url.includes('fightthenewdrug')) {
    let request = new XMLHttpRequest();
    request.open('GET', api, false);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        let data = JSON.parse(request.responseText);
        if(data.result.cats.Pornography) {
          window.stop();
          PorNo();
          store(url);
        }
      }
      else {
      }
    };

    request.onerror = function() {
    };
    request.send();
  }
}

function isUnsafeGoogleSearch() {
  return location.href.includes('google.com/search?') && !location.href.includes(safeSearch)
}
