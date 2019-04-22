window.onload = function () {

    document.getElementsByClassName('burgerButton')[0].onclick = () => {
        let sidePanel = document.getElementsByClassName('sidePanel')[0].style;
        let searchBar = document.getElementsByClassName('pac-input')[0].style;

        if (sidePanel.width === '45%')  {
            sidePanel.width = '0';
            searchBar.display = 'block';
        } else {
            sidePanel.width = '45%';
            searchBar.display = 'none';
        }

        // sidePanel.width = sidePanel.width === '250px' ? '0px' : '250px';
    };

    // function openNav() {
    //     // document.getElementById("mySidepanel").style.width = "250px";
    //     document.getElementsByClassName("openbtn")[0].style.display = "none";
    // }
};