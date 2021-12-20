function updateCandidate(candidate){
    const tableRowToUpdate = document.getElementById("candidate-table-row-" + candidate.id);
    tableRowToUpdate.innerHTML =
        `
        <tr>
            <td>
                <input id="update-candidate-name-${candidate.id}" value="${escapeHTML(candidate.name)}">
            </td>
            <td>
                <select id="update-candidate-party-${candidate.id}"></select>
            </td>
            <td>
                <input type="number" id="update-candidate-personal-votes-${candidate.id}" value="${candidate.personalVotes}">
            </td>
            <td>
                <button onclick="updateCandidateInBackend(${candidate.id})">✔</button>
                <button id="cancel-update-${candidate.id}">🛑</button>
            </td>
            <td>
                <button onclick="deleteCandidate(${candidate.id})">❌</button>
            </td>
        </tr>
        `
    document.getElementById("cancel-update-" + candidate.id)
        .addEventListener("click", () => undoUpdateTableRow(candidate));
    parties.map(party => addPartyToUpdateList(party, candidate));
    document.getElementById("update-candidate-party-" + candidate.id).value = candidate.party.partyName;
}

function undoUpdateTableRow(candidate){
    const candidateTableRow = document.getElementById("candidate-table-row-" + candidate.id);
    constructCandidateTableRow(candidateTableRow, candidate);
}

function updateCandidateInBackend(candidateId){
    const tableRowToUpdate = document.getElementById("candidate-table-row-" + candidateId);
    const candidateToUpdate = {
        id: candidateId,
        name: document.getElementById("update-candidate-name-" + candidateId).value,
        personalVotes: parseInt(document.getElementById("update-candidate-personal-votes-" + candidateId).value),
        party: returnPartyByName(document.getElementById("update-candidate-party-" + candidateId).value)
    }
    fetch(baseURL + "/candidates/" + candidateId, {
        method: "PATCH",
        headers: {"Content-type": "application/json;charset=UTF-8"},
        body: JSON.stringify(candidateToUpdate)
    }).then(response => {
        if(response.status === 200){
            constructCandidateTableRow(tableRowToUpdate, candidateToUpdate)
        }
    });
}

function addPartyToUpdateList(party, candidate){
    const partyOption = document.createElement("option");
    partyOption.innerText = party.partyName;
    document.getElementById("update-candidate-party-" + candidate.id).appendChild(partyOption);
}