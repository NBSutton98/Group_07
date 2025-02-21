var currentUser;               //points to the document of the user who is logged in

const day = 1000 * 3600 * 24
const currentDay = new Date();

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let buddyPersonality = userDoc.data().buddypersonality;
                    let buddyName = userDoc.data().buddyname;
                    let userBuddy = userDoc.data().buddy;
                    let buddyDate = userDoc.data().createAt;
                    let favClass = userDoc.data().favclass;
                    let userPronoun = userDoc.data().userpronoun;

                    document.getElementById('buddy').src = `./assets/animals/${userBuddy}.svg`

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("username").innerText = userName;
                    }
                    if (buddyName != null) {
                        document.getElementById("buddy-name").innerText = buddyName;
                    }
                    if (buddyPersonality != null) {
                        document.getElementById('buddy-personality').innerText = buddyPersonality
                    }
                    if(userDoc.data().createAt == null){
                        updateMissingInfomation()
                    }
                    if(buddyDate != null){
                        diff =   currentDay - (buddyDate.toDate())
                        document.getElementById('buddy-age').innerText = Math.floor(diff/day) + " days old";
                    }
                    if (favClass != null) {
                        document.getElementById('favourite-class').innerText = favClass
                    }
                    if (userPronoun != null) {
                        document.getElementById('pronouns').innerText = userPronoun
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

populateUserInfo();

function updateMissingInfomation(){
    currentUser.update({
        createAt: firebase.firestore.Timestamp.fromDate(new Date("November 6, 2024"))
    })
}

// Function to copy friend code to clipboard
function copyToClipboard() {
    const copyText = document.getElementById("friendCode");
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    document.execCommand("copy");

    const copyMessage = document.getElementById("copyMessage");
    copyMessage.classList.remove("hidden");

    setTimeout(() => {
        copyMessage.classList.add("hidden");
    }, 2000);
}
