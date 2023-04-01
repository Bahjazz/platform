	    /*** TODO: Writing all code in a single file like this is not good. ***/
    // Especially, writing a library/SDK to only handle the communication with
    // the backend is a very good idea.
    
    const BACKEND_URI = "http://localhost:8080/api"
    
    // TODO: Want to remember the access token across page reloads?
    // You could for example store it in local storage, although that
    // would be really bad if your website contains a XSS vulnerability.
    let accessToken = ""
    
    document.addEventListener("DOMContentLoaded", function(){
        
        showPage(location.pathname)
        
        // TODO: Write comment explaining why we listen for click on links
        // this very strange way.
        document.body.addEventListener("click", function(event){
            
            const clickedElement = event.target
            
            if(clickedElement.tagName == "A"){
                
                if(clickedElement.hostname == location.hostname){
                    
                    event.preventDefault()
                    
                    const uri = clickedElement.getAttribute("href")
                    
                    if(location.pathname != uri){
                        
                        hideCurrentPage()
                        showPage(uri)
                        
                        history.pushState({}, "", uri)
                        
                    }
                    
                }
                
            }
            
        })
        
        document.getElementById("login-form").addEventListener("submit", async function(event){
            
            event.preventDefault()
            
            const username = document.getElementById("username").value
            const password = document.getElementById("password").value
            
            // TODO: Can add client-side validation here.
            
            const data = {
                username,
                password,
                //grant_type: "password"
            }
              

       validatation = function(data){
                    
            const errors = []
                if(!account.hasOwnProperty("username")){
                    errors.push("usernameMissing")
                }if(account.username.length < MIN_USERNAME_LENGTH){
                    errors.push("usernameTooShort")
                }if(MAX_USERNAME_LENGTH< account.username.length){
                    errors.push("usernameTooLong")
                } if (MIN_PASSWORD_LENGHTH == account.password.length){
                    errors.push("passwordTooShort")
                }

                return errors
                }
            
            
                  for (const error of errorArray) {
                const liElement = document.createElement("li")
                liElement.innerText = error
                listOfErrors.appendChild(liElement)
            }

            if (errorArray.length > 0) {
                e.preventDefault()
            }   
            
            const response = await fetch(BACKEND_URI+"tokens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(data)
            })
            
            switch(response.status){
                
                case 200:
                    
                    const body = await response.json()
                    
                    accessToken = body.access_token
                    
                    document.body.classList.remove("is-logged-out")
                    document.body.classList.add("is-logged-in")
                    
                    // TODO: Show feedback to the user (did the login succeed?).
                    
                break
                case 400:
                    
                    // TODO.
                    
                break
                case 500:
                default:
                    
                    // TODO.
                
            }
            
        })
        
        document.getElementById("create-human-form").addEventListener("submit", async function(event){
            
            event.preventDefault()
            
            const name = document.getElementById("name").value
            const age = document.getElementById("age").value
            
            // TODO: Can add client-side validation here.
            
            const human = {
                name,
                age
            }
            
            // TODO: Here we can start showing a loading indicator.
            const response = await fetch(BACKEND_URI+"humans", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer "+accessToken
                },
                body: JSON.stringify(human)
            })
            // TODO: And here we can stop showing a loading indicator.
            
            switch(response.status){
                
                case 201:
                    
                    const createdHuman = await response.json()
                    
                    const uri = "/humans/"+createdHuman.id
                    
                    // TODO: This is the same code that runs when clicking on a link. Function instead of code duplication?
                    history.pushState({}, "", uri)
                    hideCurrentPage()
                    showPage(uri)
                    
                break
                case 400:
                    // TODO.
                break
                case 500:
                default:
                    // TODDO.
            }
            
        })
        
    })
    
    window.addEventListener("popstate", function(event){
        
        const uri = location.pathname
        hideCurrentPage()
        showPage(uri)
        
    })
    
    function showPage(uri){
        
        let newPageId = ""
        
        switch(uri){
            
            case "/":
                newPageId = "home-page"
            break
            case "/about":
                newPageId = "about-page"
            break
            case "/login":
                newPageId = "login-page"
            break
            case "/all-humans":
                newPageId = "all-humans-page"
                loadAllHumans()
            break
            case "/create-human":
                newPageId = "create-human-page"
            break
            default:
                
                if(uri.startsWith("/humans/")){
                    newPageId = "human-page"
                    const humanId = uri.split("/")[2]
                    loadHumanPage(humanId)
                }else{
                    newPageId = "not-found-page"
                }
            
        }
        
        document.getElementById(newPageId).classList.add("current-page")
        
    }
    
    function hideCurrentPage(){
        document.querySelector(".current-page").classList.remove("current-page")
    }
    
    async function loadAllHumans(){
        
        const page = document.getElementById("all-humans-page")
        page.innerText = ""
        
        const h1 = document.createElement("h1")
        h1.innerText = "All humans"
        page.appendChild(h1)
        
        // TODO: Investigate how the code works when the backend is down.
        const response = await fetch(BACKEND_URI+"humans")
        
        switch(response.status){
            
            case 200:
                
                const humans = await response.json()
                
                const ul = document.createElement("ul")
                
                for(const human of humans){
                    const li = document.createElement("li")
                    const a = document.createElement("a")
                    a.innerText = human.name
                    a.setAttribute("href", "/humans/"+human.id)
                    li.appendChild(a)
                    ul.appendChild(li)
                }
                
                page.appendChild(ul)
                
            break
            
            case 500:
            default:
                // TODO
            
        }
        
    }
    
    async function loadHumanPage(humanId){
        
        const page = document.getElementById("human-page")
        page.innerText = ""
        
        const h1 = document.createElement("h1")
        h1.innerText = "Human"
        page.appendChild(h1)
        
        const response = await fetch(BACKEND_URI+"humans/"+humanId)
        
        switch(response.status){
            
            case 200:
                
                const human = await response.json()
                
                const p = document.createElement("p")
                p.innerText = human.name+" is "+human.age+" years old."
                
                page.appendChild(p)
                
            break
            
            case 404:
                // TODO
            break
            
            case 500:
            default:
                // TODO
            
        }
        
    }
    
