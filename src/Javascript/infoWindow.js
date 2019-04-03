/*
    Available Locks holds the key followed by
    [Free locks, Locks in use, Total Locks]
 */

var availableLocks = {
    'A': [2, 3, 5],
    'B': [0, 5, 5],
    'C': [5, 0, 5],
    'D': [0, 35, 35]
};

document.addEventListener('DOMContentLoaded', () => {
    let lockButton = document.getElementsByClassName('locks')[0];

    lockButton.onclick = () => {
        alert('Available locks: ' + availableLocks[lockButton.classList.item(1)][0]);
    }
});