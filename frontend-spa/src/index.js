    const BACKEND_URI = "http://localhost:8080/api"
    const MIN_USERNAME_LENGTH = 2
    const MIN_PASSWORD_LENGTH = 4
    let accessToken = ""
    let activeDrama
    let activeUser

    


    function validateUsername(username){
        if(username.length < MIN_USERNAME_LENGTH){
            window.alert("Username must be a atleast " + MIN_USERNAME_LENGTH + " characters! ")
            return
        }
    }

    function validatePassword(password){
        if(password.length < MIN_PASSWORD_LENGTH){
         window.alert("Username must be atleast " + MIN_USERNAME_LENGTH)
         return
        }
    }

    document.addEventListener("DOMContentLoaded", function(){
        showPage(location.pathname)
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
            const username = document.getElementById("username_single").value
            const password = document.getElementById("password_single").value
            validateUsername(username)
            validatePassword(password)
            const data = {
                username,
                password,
                grant_type: "password"
            }   
            const response = await fetch(BACKEND_URI+"accounts/tokens", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer " + accessToken
                },
                body: new URLSearchParams(data)
            })
            switch(response.status){
                case 200:
                    const body = await response.json()
                    accessToken = body.access_token
                    activeUser = body.user
                    const uri = "/"
                    history.pushState({}, "", uri)
                    showPage(uri)
                    document.body.classList.add("is-logged-in")
                    document.body.classList.remove("is-logged-out")
                    window.alert("You successfully signed in signed in with username: " + body.user.username)     
                    break
                case 401:
                    const invalid = document.createElement("h1")
                    invalid.innerText =" you have authorization error"
                    const errorToken = document.createElement("p")
                    errorToken.innerText = "you have unable to access authorization"
                    window.alert("Failed to signed in , Try again") 
                     break
                case 500:
                    const loginError = document.createElement("h1")
                    loginError.innerText = "internal Error"
                    const errorLogin = document.createElement("p")
                    errorLogin.innerText = "Error can not go through"
                    page.appendChild(h1)
                    page.appendChild(p)
                    window.alert("Internal Error, you can not sign in")
                    break
                default:
                    const error = await response.json()
                    window.alert(" Error " + response.status + ": " + error)
            }
            
        })

        document.getElementById("click_logout").addEventListener("click", async function(event){
            event.preventDefault()
            accessToken =""
            document.body.classList.add("is-logged-out")
            document.body.classList.remove("is-logged-in")
            const activePageUri = "/logout"
            history.pushState({}, "", activePageUri)
            hideCurrentPage()
            showPage(activePageUri)

        })
        
        document.getElementById("create-account-form").addEventListener("submit", async function(event){
            event.preventDefault()
            const username = document.getElementById("username").value
            const password = document.getElementById("password").value
            validateUsername(username)
            validatePassword(password)
            const account = {
              username,
              password
            }
            const response = await fetch(BACKEND_URI+"accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(account)
            })            
            switch(response.status){
                case 201:
                    const activePageUri = "/login"
                    history.pushState({}, "", activePageUri)
                    hideCurrentPage()
                    showPage(activePageUri)        
                break
                case 500:
                    const loginError = document.createElement("h1")
                    loginError.innerText = "internal Error"
                    const errorLogin = document.createElement("p")
                    errorLogin.innerText = "Error can not go through"
                    page.appendChild(h1)
                    page.appendChild(p)
                    window.alert("Internal Error, can not create account")
                break
                default:
                    const error = await response.json()
                    window.alert(" Error " + response.status + ": " + error)
            }
        })
        

        document.getElementById("update-account-form").addEventListener("submit", async function(event){
             event.preventDefault()
             const username = document.getElementById("update_username").value
             validateUsername(username)
             const account ={
                accountID: document.getElementById("accountID").value,
                username
             }
             const response = await fetch(BACKEND_URI+"accounts/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                },
                body: JSON.stringify(account)
            })
            switch(response.status){
             case 201:
                const activePageUri = "/"
                history.pushState({}, "", activePageUri)
                hideCurrentPage()
                showPage(activePageUri)  
                const updateAccount =  await response.json()
                window.alert("update account. username = " + updateAccount.username)
                break
            case 500:
                const loginError = document.createElement("h1")
                loginError.innerText = "internal Error"
                const errorLogin = document.createElement("p")
                errorLogin.innerText = "Error can not go through"
                page.appendChild(h1)
                page.appendChild(p)
                window.alert("Internal Error, can not update account")
                break
            case 401:
                accessToken =""
                activeUser =""
                document.body.classList.add("is-logged-out")
                document.body.classList.remove("is-logged-in")
                const loginPageUri = "/login"
                history.pushState({}, "", loginPageUri)
                hideCurrentPage()
                showPage(loginPageUri)
                const updateError = await response.json()
                window.alert("Failed for updating account: " + updateError)
                break
           default:
                const error = await response.json()
                window.alert(" Error " + response.status + ": " + error)
           }
       }) 


       document.getElementById("delete-account").addEventListener("click", async function(event){
        event.preventDefault()
        await loadActiveAccount()
        const accountID = activeUser.accountID
        if(confirm("Are you sure you want to delete")){
            const user = {
                accountID 
            }
            const response = await fetch(BACKEND_URI+"accounts/", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                },
                body: JSON.stringify(user)
            })
            switch(response.status){
                case 200:
                    accessToken =""
                    activeUser = null
                    document.body.classList.add("is-logged-out")
                    document.body.classList.remove("is-logged-in")
                    const activePageUri = "/" 
                    history.pushState({}, "", activePageUri)
                    hideCurrentPage()
                    showPage(activePageUri)
                    const deleteError = await response.json()
                    window.alert("successfully deleted account. Account-username: " + deleteError.username)
                    break
                case 401:
                    accessToken =""
                    activeUser = null
                    document.body.classList.add("is-logged-out")
                    document.body.classList.remove("is-logged-in")
                    const loginPageUri = "/login"
                    history.pushState({}, "", loginPageUri)
                    hideCurrentPage()
                    showPage(loginPageUri)
                    const errLogin = await response.json()
                    window.alert("Failed for deleting account: " + errLogin)
                    break
                
                case 500:
                    const loginError = document.createElement("h1")
                    loginError.innerText = "internal Error"
                    const errorLogin = document.createElement("p")
                    errorLogin.innerText = "Error can not go through"
                    page.appendChild(h1)
                    page.appendChild(p)
                    window.alert("Internal Error, can not delete account")
                    break
                default:
                    const error = await response.json()
                    window.alert(" Error " + response.status + ": " + error)
            }
        }else{
            const activePageUri =
            history.pushState({}, "", activePageUri)
            hideCurrentPage()
            showPage(activePageUri)
            window.alert("You didn't deleted account")
        }

       })

       document.getElementById("create-drama-form").addEventListener("submit", async function(event){
           event.preventDefault(event)
           await loadActiveAccount()
           const dramaAccountID = activeUser.accountID
           const drama = {
            dramaDescription: document.getElementById("Drama-description").value,
            dramaName: document.getElementById("name").value,
            userID:dramaAccountID
           }
           const response = await fetch(BACKEND_URI+"dramas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(drama)

       })
        switch (response.status) {
            case 201:
                activeDrama = drama
                const activePageUri ="/"
                history.pushState({}, "", activePageUri)
                hideCurrentPage()
                showPage(activePageUri)          
                break
            case 401:
                accessToken =""
                activeUser = ""
                document.body.classList.add("is-logged-out")
                document.body.classList.remove("is-logged-in")
                const loginPageUri = "/login"
                history.pushState({}, "", loginPageUri)
                hideCurrentPage()
                showPage(loginPageUri)
                const errLogin = await response.json()
                window.alert("Failed to create drama: " + errLogin)
                break
            case 500:
                const loginError = document.createElement("h1")
                loginError.innerText = "internal Error"
                const errorLogin = document.createElement("p")
                errorLogin.innerText = "Error can not go through"
                page.appendChild(h1)
                page.appendChild(p)
                window.alert("Internal Error, can not create drama")
                break
            default:
                const error = await response.json()
                window.alert(" Error " + response.status + ": " + error)

            }
       })
       document.getElementById("update-drama-form").addEventListener("submit", async function(event){
           event.preventDefault()
           const drama ={
            dramaID : document.getElementById("dramaID").value,
            dramaName: document.getElementById("update_name").value,
            dramaDescription: document.getElementById("update_description").value,
            accountID: document.getElementById(" dramaAccountID").value
           }
           const response = await fetch(BACKEND_URI+"dramas/", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(drama)
       })
       switch (response.status) {
        case 204:
            const activePageUri = "/"
            history.pushState({}, "", activePageUri)
            hideCurrentPage()
            showPage(activePageUri) 
            window.alert("Drama are Updated")
            break
        case 401:
            accessToken =""
            activeUser = ""
            document.body.classList.add("is-logged-out")
            document.body.classList.remove("is-logged-in")
            const loginPageUri = "/login"
            history.pushState({}, "", loginPageUri)
            hideCurrentPage()
            showPage(loginPageUri)
            const errLogin = await response.json()
            window.alert("Failed to update drama: " + errLogin)
            break
        case 500:
            const loginError = document.createElement("h1")
            loginError.innerText = "internal Error"
            const errorLogin = document.createElement("p")
            errorLogin.innerText = "Error can not go through"
            page.appendChild(h1)
            page.appendChild(p)
            window.alert("Internal Error, can not update drama")
            break
        default:
            const error = await response.json()
            window.alert(" Error " + response.status + ": " + error)     
       }

    })
    document.getElementById("delete-drama-form").addEventListener("submit", async function(event){
        event.preventDefault(event)
        const drama ={
            dramaID: document.getElementById("dramaID").value,
            dramaName: document.getElementById("update_name").value,
            dramaDescription: document.getElementById("update_description").value,
            accountID: document.getElementById("dramaAccountID").value
        }
        const response = await fetch(BACKEND_URI+"dramas/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken
            },
            body: JSON.stringify(drama)
       })
       switch(response.status){
        case 200:
            const activePageUri = "/" 
            history.pushState({}, "", activePageUri)
            hideCurrentPage()
            showPage(activePageUri)
            window.alert("successfully deleted drama")
            break
        case 401:
            accessToken =""
            activeUser = ""
            document.body.classList.add("is-logged-out")
            document.body.classList.remove("is-logged-in")
            const loginPageUri = "/login"
            history.pushState({}, "", loginPageUri)
            hideCurrentPage()
            showPage(loginPageUri)
            const errLogin = await response.json()
            window.alert("Failed for deleting drama: " + errLogin)
            break
        case 500:
            const loginError = document.createElement("h1")
            loginError.innerText = "internal Error"
            const errorLogin = document.createElement("p")
            errorLogin.innerText = "Error can not go through"
            page.appendChild(h1)
            page.appendChild(p)
            window.alert("Internal Error, can not delete drama")
            break
        default:
            const error = await response.json()
            window.alert(" Error " + response.status + ": " + error)
    }
    })    
    window.addEventListener("popstate", function(event){
        const uri = location.pathname
        hideCurrentPage()
        showPage(uri)
        
    })
    
    function showPage(uri){
        let newPageId = ""
        let dramaID
        if(uri.startsWith("/update-drama/")|| uri.startsWith("/delete-drama/")){
            dramaID = uri.split("/")[2]
        }
        
        switch(uri){
            case "/":
                newPageId = "drama-page"
                loadAllDramas()
                break
            case "/home":
                newPageId = "home-page"
                break
            case "/accounts":
                newPageId = "accounts-page"
                loadAllAccounts()
                 break
            case "/login":
                newPageId = "login-page"
                break
            case "/logout":
                newPageId = "logout-page"
                break
            case "/create-account":
                newPageId = "create-account-page"
                break
            case "/update-account":
                newPageId = "update-account-page"
                loadUpdateAccount()
                break
            case "/create-drama":
                newPageId = "create-drama-page"
                break
            case "/update-drama/"+dramaID:
                newPageId = "update-drama-page"
                loadUpdateDrama()
                break
            case "/delete-drama/"+dramaID:
                newPageId = "create-drama-page"
                loadDeleteDrama()
                break
            default: 
                if(uri.startsWith("/dramas/")){
                    newPageId = "drama-page"
                    const dramaId = uri.split("/")[2]
                    loadDramaPage(dramaId)
                }else{
                    newPageId = "not-found-page"
                }         
        }   
        document.getElementById(newPageId).classList.add("current-page")     
    }
    
    function hideCurrentPage(){
        document.querySelector(".current-page").classList.remove("current-page")
    }
    
    async function loadAllDramas(){
        const page = document.getElementById("drama-page")
        page.innerText = ""
        const h1 = document.createElement("h1")
        h1.innerText = "All Dramas"
        page.appendChild(h1)
        const paragraph = document.createElement("p")
        paragraph.innerText = "Welcome to kdramaUnited, you can view dramas on this page"
        page.appendChild(paragraph)

        const response = await fetch(BACKEND_URI+"dramas")
        switch(response.status){ 
            case 200:
                const dramas = await response.json()
                if(dramas.length == 0){
                    const p = document.createElement("p")
                    p.innerText ="There are no dramas"
                    page.appendChild(p)
                }else{
                    const ul = document.createElement("ul")
                    for(const drama of dramas){
                        const li = document.createElement("li")
                        const a = document.createElement("a")
                        a.innerText = drama.name
                        a.setAttribute("href", "/dramas/"+drama.dramaID)
                        li.appendChild(a)
                        ul.appendChild(li)
                    }
                     page.appendChild(ul)
                }       
                break
            
            case 500:
                const h1Error = document.createElement("h1")
                h1Error.innerText = "internal Error"
                const pError = document.createElement("p")
                pError.innerText = "Error can not go through"
                page.appendChild(h1)
                page.appendChild(p)
                window.alert("Internal Error, can not load dramas")
                break
            default:
                const activePageUri ="/"
                history.pushState({}, "", activePageUri)
                if(history.length > 1){
                    hideCurrentPage()
                }
                showPage(activePageUri)
                const error = await response.json()
                window.alert(" Error " + response.status + ": " + error)
            
        }
        
    }
    
    async function loadDramaPage(dramaId){
        const page = document.getElementById("drama-page")
        page.innerText = ""
        const h1 = document.createElement("h1")
        h1.innerText = "Dramas"
        page.appendChild(h1)
        const response = await fetch(BACKEND_URI + "dramas/"+dramaId, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + accessToken
            }
        })
        switch(response.status){ 
            case 200:
                const dramma = await response.json()
                activeDrama = dramma[0].drama
                const dramaRecensions = dramma[0].dramaRecensions
                const signedInUser = dramma[1]
                const ul = document.createElement("d1")
                const draName = document.createElement("dd")
                draName.innerText = activeDrama.dramaName
                const draDescription = document.createElement("dd")
                draDescription.innerText = activeDrama.dramaDescription
                ul.appendChild(draName)
                ul.appendChild(draDescription)
                page.appendChild(ul)
                if(activeDrama.accountID == signedInUser.userID){
                  const updateDelete = document.createElement("ul")
                  const listUpdate = document.createElement("li")
                  const listDelete = document.createElement("li")
                  const updateDrama =document.createElement("a")
                  updateDrama.innerText ="update drama "
                  updateDrama.setAttribute("href", "/update-drama/"+dramaId)
                  const deleteDrama = document.createElement("a")
                  deleteDrama.innerText("Delete drama")
                  deleteDrama.setAttribute("href","/delete-drama/"+dramaId)
                  listUpdate.appendChild(updateDrama)
                  listDelete.appendChild(deleteDrama)
                  updateDelete.appendChild(listDelete)
                  updateDelete.appendChild(listUpdate)
                  page.appendChild(updateDelete)
                }
                const header3 = document.createElement("h3")
                header3.innerText = "DramaRecensions"
                page.appendChild(header3)
                if(dramaRecensions.length == 0){
                   const pRecension= document.createElement("p")
                   pRecension.innerText ="There are no drama Recension"
                   page.appendChild(pRecension)
                }else{
                    const ulRecensions = document.createElement("ul")
                    let i = 1
                    for(const dramaRecension of dramaRecensions){
                        const li = document.createElement("li")
                        const a = document.createElement("a")
                        li.innerText = i + ". " + dramaRecension.dramaRecensionDescription
                        i++
                        ulRecensions.appendChild(li)
                    }
                    page.appendChild(ulRecensions)
                }      
                break
            
            case 401:
                    accessToken =""
                    activeUser = null
                    document.body.classList.add("is-logged-out")
                    document.body.classList.remove("is-logged-in")
                    const loginPageUri = "/login"
                    history.pushState({}, "", loginPageUri)
                    hideCurrentPage()
                    showPage(loginPageUri)
                    const errLogin = await response.json()
                    window.alert("Failed to fetch drama: " + errLogin)
                    break
                
                case 500:
                    const loginError = document.createElement("h1")
                    loginError.innerText = "internal Error"
                    const errorLogin = document.createElement("p")
                    errorLogin.innerText = "Error can not go through"
                    page.appendChild(h1)
                    page.appendChild(p)
                    window.alert("Internal Error, can not fetch drama")
                    break
            
                default:
                    const error = await response.json()
                    window.alert(" Error " + response.status + ": " + error)
                }
           }

    })
    function loadUpdateDrama(){
        document.getElementById("dramaAccountID").value = activeDrama.accountID
        document.getElementById("dramaID").value = activeDrama.dramaID
        document.getElementById("update_name").value = activeDrama.dramaName
        document.getElementById("update_description").value = activeDrama.dramaDescription

    }
    function loadDeleteDrama(){
        document.getElementById("dramaAccountID").value = activeDrama.accountID
        document.getElementById("dramaID").value = activeDrama.dramaID
        document.getElementById("delete-name").value = activeDrama.dramaName
        document.getElementById("delete-description").value = activeDrama.dramaDescription
    }
    async function loadActiveAccount(){
        const response = await fetch(BACKEND_URI+"accounts/" + accountID, {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + accessToken
            }
    })
    switch(response.status){
        case 200:
            activeUser = await response.json()
            break
        case 401:
            accessToken =""
            activeUser = null
            document.body.classList.add("is-logged-out")
            document.body.classList.remove("is-logged-in")
            const loginPageUri = "/login"
            history.pushState({}, "", loginPageUri)
            hideCurrentPage()
            showPage(loginPageUri)
            const errLogin = await response.json()
            window.alert("Failed to fetch drama: " + errLogin)
            break
            
        case 500:
            const loginError = document.createElement("h1")
            loginError.innerText = "internal Error"
            const errorLogin = document.createElement("p")
            errorLogin.innerText = "Error can not go through"
            page.appendChild(h1)
            page.appendChild(p)
            window.alert("Internal Error, can not fetch")
            break
        
        default:
            const error = await response.json()
            window.alert(" Error " + response.status + ": " + error) 
        }
   }
   async function loadAllAccounts(){
        const page = document.getElementById("accounts-page")
        page.innerText =""
        const h1 = document.createElement("h1")
        h1.innerText = "All Accounts"
        page.appendChild(h1)
        const response = await fetch(BACKEND_URI+"accounts", {
            method: "GET",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + accessToken
            }

        })
        switch(response.status){
            case 200:
                const accounts = await response.json()
                if(accounts.length == 0){
                    const p = document.createElement("p")
                    p.innerText = "No account to view"
                    page.appendChild(p)
                }else{
                    const ul = document.createElement("ul")
                    for(const account of accounts){
                    const li = document.createElement("li")
                    li.innerText ="Username: " + account.username
                    ul.appendChild(li)
                    }
                    page.appendChild(ul)
               }
               break
            case 401:
                accessToken =""
                activeUser = null
                document.body.classList.add("is-logged-out")
                document.body.classList.remove("is-logged-in")
                const loginPageUri = "/login"
                history.pushState({}, "", loginPageUri)
                hideCurrentPage()
                showPage(loginPageUri)
                const err = await response.json()
                window.alert("Error : " + err)
                break 
            default:
                const activePageUri ="/"
                history.pushState({}, "", activePageUri)
                hideCurrentPage()
                showPage(activePageUri)
                const error = await response.json()
                window.alert(" Error " + response.status + ": " + error) 
        }
    } 
