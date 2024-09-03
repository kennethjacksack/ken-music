document.addEventListener('DOMContentLoaded', function() {
    const sidePanel = document.getElementById('side-panel');
    const toggleButton = document.getElementById('toggle-sidepanel-button');

    toggleButton.addEventListener('click', function() {
        if (sidePanel.classList.contains('open')) {
            sidePanel.classList.remove('open');
            toggleButton.classList.remove('moved'); // Move button back to the right
        } else {
            sidePanel.classList.add('open');
            toggleButton.classList.add('moved'); // Move button to the left
        }
    });
});
