///////////////////////////////////////////////////////////////////////
///// ================== SERVICE SECTION ======================= //////
///////////////////////////////////////////////////////////////////////

////////////========== Calculate Risk Rating ==========////////////////

const calculateRiskRating = (claimHistory) => {

    const validatedClaimHistory = claimHistory.trim().toLowerCase(); // Convert to lowercase and trim whitespace to validate the claim history

    // ===== Keywords and their variations ===== //

    const keywordsAndVariations = {
        'collide': ['collide', 'collided', 'collision', 'colide', 'collyde'],
        'crash': ['crash', 'crashed', 'crashes', 'crrash'],
        'scratch': ['scratch', 'scratched', 'scratches', 'scrratch'],
        'bump': ['bump', 'bumped', 'bumps', 'bummp'],
        'dent': ['dent', 'dented', 'dents', 'dennt'],
        'smash': ['smash', 'smashed', 'smashes', 'smassh'],
        'accident': ['accident', 'accidents'],
        'bender': ['bender', 'bendered', 'benders'],
        'mishap': ['mishap', 'mishapped', 'mishaps'],
        'incident': ['incident', 'incidentally', 'incidents'],
        'wreck': ['wreck', 'wrecked', 'wrecks'],
        'impact': ['impact', 'impacted', 'impacts'],
        'shatter': ['shatter', 'shattered', 'shatters']
    };

    // ===== Total Loss Keywords (automatically set riskRating to 5) ===== //
    const totalLossKeywords = [
        'destruction', 'write-off', 'writeoff', 'write off', 'totalled', 'totaled', 'total loss'
    ];

    let riskRating = 0;

    // Check for Total Loss Keywords First (highest priority)
    let isTotalLoss = false;
    totalLossKeywords.forEach(keyword => {
        if (validatedClaimHistory.includes(keyword)) {
            riskRating = 5;  // Set riskRating to 5 (Total Loss)
            isTotalLoss = true; //Flag it
        }
    });

    // If not a total loss, proceed with counting other keywords
    if (!isTotalLoss) {

        // Object.keys() returns an array of keys from the keywordsAndVariations object
        // .forEach() iterates over each key in the array

        Object.keys(keywordsAndVariations).forEach(baseKeyword => {

            // Check if any variation of the base keyword is found in the claim history
            // .some() returns true if at least one element in the array passes the test

            if (keywordsAndVariations[baseKeyword].some(variation => validatedClaimHistory.includes(variation))) {
                riskRating++; //.some() returns true if at least one element in the array passes the test
            }
        });

        // Limit the risk rating to a maximum of 5
        const maxRiskRating = 5;
        riskRating = Math.min(riskRating, maxRiskRating); // Ensure riskRating doesn't exceed maxRiskRating
    }

    return riskRating;
};

module.exports = {
    calculateRiskRating,
};