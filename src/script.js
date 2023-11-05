function writeHeaderAndFooter() {
    var header = "\n __          __                          _           _ _\n" +
        " \\ \\        / /                         (_)         (_) |\n" +
        "  \\ \\  /\\  / /__  __ _ _ __   ___  _ __  _ _______   _| |_\n" +
        "   \\ \\/  \\/ / _ \\/ _` | '_ \\ / _ \\| '_ \\| |_  / _ \\ | | __|\n" +
        "    \\  /\\  /  __/ (_| | |_) | (_) | | | | |/ /  __/_| | |_\n" +
        "     \\/  \\/ \\___|\\__,_| .__/ \\___/|_| |_|_/___\\___(_)_|\\__|\n" +
        "                      | |\n" +
        "                      |_|";

    var footer = "Nicholas Ferreira - 2023\n" +
        "Inspired by <a href='https://ippsec.rocks/' target='_blank'>IppSec</a>";
    document.getElementsByClassName("header")[0].innerHTML = header;
    document.getElementsByClassName("footer")[0].innerHTML = footer;
}

var jsonData;
async function fetchJsonData() {
    try {
        var response = await fetch('https://weaponize.s3.us-east-2.amazonaws.com/output.json');
        //        var response = await fetch('output.json');
        jsonData = await response.json();
        displayJSON(jsonData);
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

function safeUrl(str) {
    str = str.toLowerCase().replace(/\s+/g, '-');
    str = str.toLowerCase().replace('?', '');
    str = str.toLowerCase().replace('/', '-');
    return safeString(str);
}

function safeString(inputString) {
    var encodedString = inputString.replace(/[\u00A0-\u9999<>&]/gim, function (i) {
        return '&#' + i.charCodeAt(0) + ';';
    });
    return encodedString;
}

function displayJSON(jsonData) {
    var jsonListDiv = document.getElementById('jsonList');
    isAbout = false;
    jsonData.reverse().forEach((data, index) => {
        if (data.tags[0] == "about" && window.location.hash == "#about") {
            var jsonContainer = document.createElement('div');
            jsonContainer.innerHTML = `<a href="#${safeUrl(data.title)}"><h1 id="${safeUrl(data.title)}">${safeString(data.title)}</h1></a>
	                                   <h2>${safeString(data.description)}</h2>`;

            var dataDiv = document.createElement('div');

            for (i = 0; i < data.data.length; i++) {
                if (data.data[i].language == "Why?") {
                    dataDiv.innerHTML += `<h1>${safeString(data.data[i].language)}</h1>`;
                }
                dataDiv.innerHTML += `<p class='about'>${(data.data[i].description)}</p>`;
            }

            jsonContainer.appendChild(dataDiv);
            jsonListDiv.appendChild(jsonContainer);
            isAbout = true;
        }

        if (isAbout || data.tags[0] == "about") return;
        var jsonContainer = document.createElement('div');
        jsonContainer.innerHTML = `<a href="#${safeUrl(data.title)}"><h1 id="${safeUrl(data.title)}">${safeString(data.title)}</h1></a>
                                   <h2>${safeString(data.description)}</h2>`;

        var dataDiv = document.createElement('div');
        Object.entries(data.data).forEach(([description, data, language]) => {
            var lang = data.language;
            lang = lang ? lang : "text";
            data.command = data.command.replace(/^![^\s]+ */i, "");

            dataDiv.innerHTML += `<span class="description">${safeString(data.description)}</span><div class='code-wrapper'><pre><code class="language-${lang}">${safeString(data.command)}</code></pre><svg class='copy-icon' xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" fill="#060"/></svg><div class='copied'>Copied</div></div>`;
        });
        jsonContainer.appendChild(dataDiv);

        if (data.source.length && data.source[0] !== "") {
            var source = document.createElement('p');
            source.className = "source";
            if (data.source.length == 1) {
                source.innerHTML = `<a class='source' href='${safeString(data.source[0])}' target='_blank'>Source</a>`;
            } else {
                source.innerHTML = `Sources: `
                for (i = 0; i < data.source.length; i++) {
                    source.innerHTML += `<a class='source' href='${safeString(data.source[i])}' target='_blank'>${i + 1}</a>`;
                    if (i != data.source.length - 1)
                        source.innerHTML += `, `;
                }
                source.innerHTML += `<br>`
            }
            jsonContainer.appendChild(source);
        }

        var tagsSmall = document.createElement('small');
        tagsSmall.innerHTML = 'Tags: ';
        data.tags.sort().forEach((tag, index) => {
            var tagLink = document.createElement('a');
            tagLink.href = `#tag:${safeUrl(tag)}`;
            tagLink.innerText = tag;

            tagLink.addEventListener('click', function () {
                filterItemsByTag(tag);
            });

            tagsSmall.appendChild(tagLink);
            if (index < data.tags.length - 1) {
                tagsSmall.appendChild(document.createTextNode(', '));
            }
        });

        jsonContainer.appendChild(tagsSmall);

        if (index < jsonData.length - 1) {
            var separator = document.createElement('div');
            separator.className = 'separator';
            jsonContainer.appendChild(separator);
        }

        jsonListDiv.appendChild(jsonContainer);
    });

    hljs.highlightAll();

    document.querySelectorAll('.copy-icon').forEach((codeElement) => {
        codeElement.addEventListener('click', function () {
            var codeText = codeElement.parentElement;

            navigator.clipboard.writeText(codeText.querySelector('code').innerText).then(function () {
                var copied = codeText.querySelector('.copied');
                copied.classList.add('visible');
                setTimeout(() => {
                    copied.classList.remove('visible');
                }, 500);
            }).catch(function (err) {
                console.error('Unable to copy code to clipboard', err);
            });
        });
    });

}

function filterItemsByTag(clickedTag) {
    var containers = document.querySelectorAll('#jsonList > div');
    containers.forEach(container => {
        var tagsSmall = container.querySelector('small');
        var tagsText = tagsSmall.innerText.toLowerCase();
        var lowerClickedTag = clickedTag.toLowerCase().replace('-',' ');
       
        container.style.display = tagsText.includes(lowerClickedTag) ? 'block' : 'none';
    });
}


const placeholderTexts = ['pentest', 'malware analysis', 'network scan', 'subdomain', 'enumeration', 'information gathering', 'osint', 'wireshark', 'buffer overflow', 'binary exploitation', 'cryptography', 'obfuscation', 'privilege escalation', 'mobile pentest', 'android', 'malware', 'red team', 'steganography', 'phishing', 'post exploitation', 'social engineering', 'firewall evasion', 'metasploit', 'password cracking', 'reverse engineering', 'spyware', 'anti virus evasion', 'anti virus bypass', 'wi-fi cracking', 'wireless hacking', 'password spraying', 'container escaping', 'kerberoasting', 'pass the hash', 'pass the ticket', 'process injection', 'domain takeover', 'c2', 'shellcode', 'active directory', 'lateral movement', 'persistence', 'fuzzing', 'rainbow table', 'data exfiltration', 'honeypot', 'sql injection', 'cross-site scripting', 'xss', 'cross-site request forgery', 'server-side request forgery', 'command injection', 'owasp', 'xml external entities', 'path traversal', 'session hijacking', 'http smuggling', 'cache poisoning', 'arbitrary upload', 'reverse shell', 'webshell', 'rootkit'];

var textbox = document.querySelector('.custom-textbox');

function updatePlaceholder() {
    textbox.placeholder = "";
    var currentText = placeholderTexts[Math.floor(Math.random() * placeholderTexts.length)];

    var typingDelay = 50;
    var eraseDelay = 30;
    var stringChangeDelay = 1500;
    var totalTypingTime = typingDelay * currentText.length;
    var totalEraseTime = eraseDelay * currentText.length;
    var totalDelay = totalTypingTime + totalEraseTime + stringChangeDelay;

    for (let i = 0; i < currentText.length; i++) {
        setTimeout(() => {
            textbox.placeholder = currentText.substring(0, i + 1);
        }, i * typingDelay);
    }

    setTimeout(() => {
        for (let i = currentText.length - 1; i >= 0; i--) {
            setTimeout(() => {
                textbox.placeholder = currentText.substring(0, i);
            }, (currentText.length - i) * eraseDelay);
        }

        setTimeout(updatePlaceholder, eraseDelay * currentText.length);
    }, totalTypingTime + (stringChangeDelay + Math.floor(Math.random() * 21)));
}

function handleTextbox() {
    updatePlaceholder();

    function filterJsonData(searchText) {
        var filteredData = jsonData.filter((data) => {
            var lowerSearchText = searchText.toLowerCase();
            return (
                data.title.toLowerCase().includes(lowerSearchText) ||
                data.description.toLowerCase().includes(lowerSearchText) ||
                data.tags.some((tag) => tag.toLowerCase().includes(lowerSearchText))
            );
        });

        var jsonListDiv = document.getElementById('jsonList');
        jsonListDiv.innerHTML = '';

        if (filteredData.length !== 0) {
            displayJSON(filteredData.reverse());
        } else {
            document.getElementById('jsonList').innerHTML = "<span class='not-found'>No results found.</span>";
        }
    }

    // Event listener for handling input changes
    textbox.addEventListener('input', function () {
        filterJsonData(textbox.value);
    });

}


function about() {
    window.location.hash = "#about"
    filterItemsByTag("about");
    displayJSON(jsonData);
};


function scrollToHash() {
    var hash = window.location.hash;
    //console.log(hash);
    if (hash) {
      // Remove the '#tag:' part for querying in the DOM
      var tag = hash.replace("#tag:", "").toLowerCase();
  
      // Escape colon and other CSS-special characters if needed
      var safeTag = CSS.escape(tag);
  
      // Use a data attribute or class to query the element
      var targetSelector = "[data-tag='" + safeTag + "']"; // Example for data attribute
      // var targetSelector = ".tag-" + safeTag; // Example for class
  
      setTimeout(function () {
        var targetElement = document.querySelector(targetSelector);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        if (hash.includes("#tag:")) {
          filterItemsByTag(tag);
        }
      }, 500);
    }
  }
  

function showTagsPopup(jsonData) {
    let overlay = document.getElementById('overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'overlay';
      overlay.onclick = function() {
        document.getElementById('tags-popup').style.display = 'none';
        overlay.style.display = 'none';
      };
      document.body.appendChild(overlay);
    }
  
    let tagsContainer = document.getElementById('tags-popup');
    if (!tagsContainer) {
      tagsContainer = document.createElement('div');
      tagsContainer.id = 'tags-popup';
      document.body.appendChild(tagsContainer);
    }

    tagsContainer.innerHTML = '';
    overlay.style.display = 'block';

    const closeButton = document.createElement('div');
    closeButton.textContent = 'X';
    closeButton.className = 'close-button';
    closeButton.onclick = function() {
        tagsContainer.style.display = 'none';
        overlay.style.display = 'none';
    };
    tagsContainer.appendChild(closeButton);

    const tagsFlexContainer = document.createElement('div');
    tagsFlexContainer.className = 'tags-container';

    const sortedTagsWithCounts = countTags(jsonData); // Now returns a sorted array

    sortedTagsWithCounts.forEach(([tag, count]) => {
        const tagLink = document.createElement('a');
        tagLink.textContent = `${tag} (${count})`;
        tagLink.className = 'tag';
        tagLink.href = `#tag:${safeUrl(tag)}`;

        tagLink.onclick = function() {
          hidePopupAndOverlay();
        };
      
        tagsFlexContainer.appendChild(tagLink);
    });

    tagsContainer.appendChild(tagsFlexContainer);

    tagsContainer.style.display = 'block';


    // Sorting tags
    const sortOptionsContainer = document.createElement('div');
    sortOptionsContainer.className = 'sort-options';

    const sortByText = document.createElement('span');
    sortByText.textContent = 'Sort: ';
    sortOptionsContainer.appendChild(sortByText);

    const sortByAlphabetical = document.createElement('a');
    sortByAlphabetical.textContent = 'Alphabetically';
    sortByAlphabetical.style.textDecoration = "underline";


    const sortByCount = document.createElement('a');
    sortByCount.textContent = 'Most occurrencies';
    
    sortByAlphabetical.onclick = function() {
        displayTags('alphabetical');
        sortByAlphabetical.style.textDecoration = "underline";
        sortByCount.style.textDecoration = "none";
    };

    sortByCount.onclick = function() {
        displayTags('count');
        sortByCount.style.textDecoration = "underline";
        sortByAlphabetical.style.textDecoration = "none";
    };

    sortOptionsContainer.appendChild(sortByAlphabetical);
    sortOptionsContainer.appendChild(sortByCount);

    // Add the sort options container to the tagsContainer before the tagsFlexContainer
    tagsContainer.insertBefore(sortOptionsContainer, tagsContainer.firstChild);

    // Function to display tags according to the selected sort method
    function displayTags(sortMethod) {
        const sortedTagsWithCounts = countTags(jsonData);
        if (sortMethod === 'count') {
            sortedTagsWithCounts.sort((a, b) => b[1] - a[1]); // Sort by count descending
        } else {
            sortedTagsWithCounts.sort((a, b) => a[0].localeCompare(b[0])); // Sort alphabetically
        }

        // Clear existing tags
        tagsFlexContainer.innerHTML = '';

        // Add tags to the flex container according to sort
        sortedTagsWithCounts.forEach(([tag, count]) => {
            if(tag == "about") return;
            const tagLink = document.createElement('a');
            tagLink.textContent = `${tag} (${count})`;
            tagLink.className = 'tag';
            tagLink.href = `#tag:${safeUrl(tag)}`;

            tagLink.onclick = function() {
              hidePopupAndOverlay();
              // Add any additional logic here if needed
            };

            tagsFlexContainer.appendChild(tagLink);
        });
    }

    displayTags('alphabetical');
}
  
  // Function to hide the tags popup and the overlay
function hidePopupAndOverlay() {
    const tagsPopup = document.getElementById('tags-popup');
    if (tagsPopup) {
      tagsPopup.style.display = 'none';
    }
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }
  
function countTags(jsonData) {
    const tagCounts = {};

    jsonData.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => {
                const lowerTag = tag.toLowerCase();
                if (tagCounts.hasOwnProperty(lowerTag)) {
                    tagCounts[lowerTag] += 1;
                } else {
                    tagCounts[lowerTag] = 1;
                }
            });
        }
    });

    return Object.entries(tagCounts).sort((a, b) => a[0].localeCompare(b[0]));

}

document.addEventListener('DOMContentLoaded', function () {
    var errorMessage = document.getElementById('error-message');
    errorMessage.style.display = 'none';
    scrollToHash();
});

window.addEventListener('hashchange', function() {
    scrollToHash();
});


writeHeaderAndFooter();
fetchJsonData();
handleTextbox();