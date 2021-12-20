const partiesTableBody = document.getElementById("parties-tbody");
let parties;
let totalVotes = 0;

fetch(baseURL + "/parties")
    .then(response => response.json())
    .then(result => {
        parties = result;
        parties.map(party => {
            let candidates;
            fetch(baseURL + "/candidates/parties/" + party.id)
                .then(response => response.json())
                .then(result => {
                    candidates = result;
                    party.candidates = candidates;
                    party.totalPartyVotes = countTotalPartyVotes(party.partyVotes, candidates);
                    totalVotes += party.totalPartyVotes;
                });
        });
    });

setTimeout(() => {
    parties.map(createPartyTableRow)
}, 250)

function createPartyTableRow(party){
    const partyTableRow = document.createElement("tr");
    partyTableRow.id = "party-table-row-" + party.id;
    partiesTableBody.appendChild(partyTableRow);
    constructPartyTableRow(partyTableRow, party);
}

function constructPartyTableRow(partyTableRow, party){
    partyTableRow.innerHTML =
        `
        <td>
            <p>${escapeHTML(party.partyLetter)}</p>
        </td>
        <td>
            <p>${escapeHTML(party.partyName)}</p>
        </td>
        <td>
            <p>${party.partyVotes}</p>
        </td>
        <td>
            <p>${party.totalPartyVotes}</p>
        </td>
        <td>
            <p>${countPercentageOfTotalVotes(party)} %</p>
        </td>
        `
}

function countTotalPartyVotes(partyVotes, candidates){
    let totalPartyVotes = partyVotes;
    for (let i = 0; i < candidates.length; i++) {
        totalPartyVotes += candidates[i].personalVotes;
    }
    return totalPartyVotes;
}

function countTotalVotes(parties){
    totalVotes = 0;
    for (let i = 0; 0 < parties.length; i++){
        totalVotes += parties[i].totalPartyVotes;
    }
}

function countPercentageOfTotalVotes(party){
    return (party.totalPartyVotes / totalVotes * 100).toFixed(2);
}