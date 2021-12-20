const candidatesTableBody = document.getElementById("candidates-tbody");
let candidates;
let parties;


fetch(baseURL + "/candidates")
    .then(response => response.json())
    .then(result =>{
        candidates = result;
        candidates.sort(function (a, b) {
            const nameA = a.name.toUpperCase();
            const nameB = b.name.toUpperCase();
            if(nameA < nameB){
              return -1;
            }
            if(nameA > nameB){
                return 1;
            }
            return 0;
        });
        candidates.map(createCandidateTableRow);
        }
    );

fetch(baseURL + "/parties")
    .then(response => response.json())
    .then(result => {
        parties = result;
    });


function createCandidateTableRow(candidate){
    const candidateTableRow = document.createElement("tr");
    candidateTableRow.id = "candidate-table-row-" + candidate.id;
    candidatesTableBody.appendChild(candidateTableRow);
    constructCandidateTableRow(candidateTableRow, candidate);
}

function constructCandidateTableRow(candidateTableRow, candidate){
    candidateTableRow.innerHTML =
        `
        <td>
            <p>${escapeHTML(candidate.name)}</p>
        </td>
        <td>
            <p>${escapeHTML(candidate.party.partyName)}</p>
        </td>
        <td>
            <p>${escapeHTML(candidate.personalVotes.toString())}</p>
        </td>
        <td>
            <button id="update-button-${candidate.id}">🔧</button>
        </td>
        <td>
            <button onclick="deleteCandidate(${candidate.id})">❌</button>
        </td>
        `
    document.getElementById("update-button-"+candidate.id).addEventListener("click", () => updateCandidate(candidate));
}

function deleteCandidate(candidateId){
    fetch(baseURL + "/candidates/" + candidateId, {
        method: "DELETE"
    }).then(response => {
        if (response.status === 200){
            document.getElementById("candidate-table-row-" + candidateId).remove();
        }else{
            console.log(response.status);
        }
    });
}

function sortAndDisplayByName(){
    candidatesTableBody.innerHTML = ``;
    candidates.sort(function (a, b) {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if(nameA < nameB){
            return -1;
        }
        if(nameA > nameB){
            return 1;
        }
        return 0;
    });
    candidates.map(createCandidateTableRow);
}

function sortAndDisplayByParty(){
    candidatesTableBody.innerHTML = ``;
    candidates.sort(function (a, b) {
        const partyLetterA = a.party.partyLetter.toUpperCase();
        const partyLetterB = b.party.partyLetter.toUpperCase();
        if(partyLetterA < partyLetterB){
            return -1;
        }
        if(partyLetterA > partyLetterB){
            return 1;
        }
        return 0;
    });
    candidates.map(createCandidateTableRow);
}

function sortAndDisplayByVotes(){
    candidatesTableBody.innerHTML = ``;
    candidates.sort(function (a, b) {
        return -(a.personalVotes - b.personalVotes);
    });
    candidates.map(createCandidateTableRow);
}

document.getElementById("sort-by-name").addEventListener("click", sortAndDisplayByName);
document.getElementById("sort-by-party").addEventListener("click", sortAndDisplayByParty);
document.getElementById("sort-by-votes").addEventListener("click", sortAndDisplayByVotes);

