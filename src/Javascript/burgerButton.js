window.onload = function () {

    document.getElementsByClassName('burgerButton')[0].onclick = () => {
        closeSideBar();
    };
};

closeSideBar = function () {
    let sidePanel = document.getElementsByClassName('sidePanel')[0].style;
    let searchBar = document.getElementsByClassName('pac-input')[0].style;

    if (sidePanel.width === '45%')  {
        sidePanel.width = '0';
        searchBar.display = 'block';
    } else {
        sidePanel.width = '45%';
        searchBar.display = 'none';
    }
};