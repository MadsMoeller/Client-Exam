const candidateFormParentDiv = document.getElementById("create-candidate-form");
const candidateFormExpandButton = document.getElementById("expand-candidate-form");
const createCandidateForm =
    `
    <div>
        <label>Navn</label>
        <input id="create-candidate-name" placeholder="kandidat">
        <label>Parti</label>
        <select id="create-candidate-party"></select>
        <label>Personlige stemmer</label>
        <input type="number" id="create-candidate-personal-votes">
        <button onclick="removeCandidateForm()">Annullér</button>
        <button onclick="createCandidate()">Tilføj kandidat</button>
    </div>
    `;


function showCandidateForm(){
    candidateFormExpandButton.style.display = "none";
    candidateFormParentDiv.innerHTML = createCandidateForm;
    parties.map(addPartyToCreateList);
}

function removeCandidateForm(){
    candidateFormExpandButton.style.display = "block";
    candidateFormParentDiv.innerHTML = "";
}

function createCandidate(){
    const candidateToCreate = {
        name: document.getElementById("create-candidate-name").value,
        personalVotes: parseInt(document.getElementById("create-candidate-personal-votes").value),
        party: returnPartyByName(document.getElementById("create-candidate-party").value)
    }
    console.log("creating the following candidate:");
    console.log(candidateToCreate);
    fetch(baseURL + "/candidates", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(candidateToCreate)
    }).then(response => response.json())
        .then(candidate => {
            candidates.push(candidate);
            createCandidateTableRow(candidate);
            removeCandidateForm();
        }).catch(error => console.log(error));
}

function addPartyToCreateList(party){
    const partyOption = document.createElement("option");
    partyOption.innerText = party.partyName;
    document.getElementById("create-candidate-party").appendChild(partyOption);
}

function returnPartyByName(partyName){
    let party;
    for (let i = 0; i < parties.length; i++) {
        if(partyName === parties[i].partyName){
            party = parties[i];
        }
    }
    return party;
}

document.getElementById("expand-candidate-form").addEventListener("click", showCandidateForm);