function writeHeaderAndFooter(){
	var header = "\n __          __                          _           _ _\n"+
" \\ \\        / /                         (_)         (_) |\n"+
"  \\ \\  /\\  / /__  __ _ _ __   ___  _ __  _ _______   _| |_\n"+
"   \\ \\/  \\/ / _ \\/ _` | '_ \\ / _ \\| '_ \\| |_  / _ \\ | | __|\n"+
"    \\  /\\  /  __/ (_| | |_) | (_) | | | | |/ /  __/_| | |_\n"+
"     \\/  \\/ \\___|\\__,_| .__/ \\___/|_| |_|_/___\\___(_)_|\\__|\n"+
"                      | |\n"+
"                      |_|";

	var footer = "Nicholas Ferreira - 2023\n"+
	"Inspiration: <a href='https://ippsec.rocks/' target='_blank'>IppSec</a>";
	document.getElementsByClassName("header")[0].innerHTML = header;
	document.getElementsByClassName("footer")[0].innerHTML = footer;
}

var jsonData;
async function fetchJsonData() {
    try {
        var response = await fetch('data.json');
        jsonData = await response.json();
        displayJSON(jsonData);
    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
}

function safeUrl(str) {
    str = str.toLowerCase().replace(/\s+/g, '-');
    str = str.toLowerCase().replace('?', '');      
    return str
}

function displayJSON(jsonData) {
    var jsonListDiv = document.getElementById('jsonList');

    jsonData.forEach((data, index) => {
        var jsonContainer = document.createElement('div');
        jsonContainer.innerHTML = `<a href="#${safeUrl(data.title)}"><h1 id="${safeUrl(data.title)}">${data.title}</h1></a>
                                   <h2>${data.description}</h2>`;

        var dataDiv = document.createElement('div');
        Object.entries(data.data).forEach(([desc, data]) => {
            var isCodeCommand = data.startsWith('!code');
			data = data.replace(/^!code */i, "");
            dataDiv.innerHTML += `<span class="description">${desc}</span><pre class="${isCodeCommand ? 'code' : 'command'}">${data}</pre>`;
        });
        jsonContainer.appendChild(dataDiv);

        var tagsSmall = document.createElement('small');
        tagsSmall.innerText = 'Tags: ' + data.tags.join(', ');
        jsonContainer.appendChild(tagsSmall);

        if (index < jsonData.length - 1) {
            var separator = document.createElement('div');
            separator.className = 'separator';
            jsonContainer.appendChild(separator);
        }

        jsonListDiv.appendChild(jsonContainer);
    });
}

const placeholderTexts = ['pentest', 'malware analysis', 'network scan', 'subdomain', 'enumeration', 'information gathering', 'osint', 'wireshark', 'buffer overflow', 'binary exploitation', 'cryptography', 'obfuscation', 'privilege escalation', 'mobile pentest', 'android', 'malware', 'red team', 'steganography', 'phishing', 'post exploitation', 'social engineering', 'firewall evasion', 'metasploit', 'password cracking', 'reverse engineering', 'spyware', 'anti virus evasion', 'anti virus bypass', 'wi-fi cracking', 'wireless hacking', 'password spraying', 'container escaping', 'kerberoasting', 'pass the hash', 'pass the ticket', 'process injection', 'domain takeover', 'c2', 'shellcode', 'active directory', 'lateral movement', 'persistence', 'fuzzing', 'rainbow table', 'data exfiltration', 'honeypot', 'sql injection', 'cross-site scripting', 'xss', 'cross-site request forgery', 'server-side request forgery', 'command injection', 'owasp', 'xml external entities', 'path traversal', 'session hijacking', 'http smuggling', 'cache poisoning', 'arbitrary upload', 'reverse shell', 'webshell', 'rootkit'];

var textbox = document.querySelector('.custom-textbox');

function updatePlaceholder() {
	textbox.placeholder = "";
    var currentText = placeholderTexts[Math.floor(Math.random() * placeholderTexts.length )];

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
    }, totalTypingTime + ( stringChangeDelay + Math.floor(Math.random() * 21)));
}

function handleTextbox() {
    updatePlaceholder();

    function filterJsonData(searchText) {
        var filteredData = jsonData.filter((data) => {
            var lowerSearchText = searchText.toLowerCase();
            return (
                data.title.toLowerCase().includes(lowerSearchText) ||
                data.description.toLowerCase().includes(lowerSearchText) ||
                data.tags.some((tag) => tag.toLowerCase().includes(lowerSearchText)) ||
                data.keywords.some((keyword) => keyword.toLowerCase().includes(lowerSearchText))
            );
        });

        var jsonListDiv = document.getElementById('jsonList');
        jsonListDiv.innerHTML = '';
//		console.log(filteredData.length == 0);

        if(filteredData.length !== 0){
	        displayJSON(filteredData);
        }else{
        	document.getElementById('jsonList').innerHTML = "<span class='not-found'>No results found.</span>";
        }
    }

    // Event listener for handling input changes
    textbox.addEventListener('input', function () {
        filterJsonData(textbox.value);
    });

}

document.addEventListener('DOMContentLoaded', function () {
    scrollToHash();
});

function scrollToHash() {
    var hash = window.location.hash;
    if(hash){
        var decodedHash = decodeURIComponent(hash);
        setTimeout(function () {
            var targetElement = document.querySelector(decodedHash);
            if(targetElement){
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 500);
    }
}


writeHeaderAndFooter();
fetchJsonData();
handleTextbox();
