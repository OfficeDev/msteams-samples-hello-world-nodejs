(function() {
    'use strict';

    // Call the initialize API first
    microsoftTeams.initialize();

    microsoftTeams.settings.registerOnSaveHandler(function(saveEvent) {
        // Let the Microsoft Teams platform know what you want to load based on
        // what the user configured on this page
        microsoftTeams.settings.setSettings({
            contentUrl: createTabUrl(), // Mandatory parameter
            entityId: createTabUrl() // Mandatory parameter
        });

        // Tells Microsoft Teams platform that we are done saving our settings
        saveEvent.notifySuccess();
    });

    // Logic to let the user configure what they want to see in the tab being loaded
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('appTab').onchange = function() {
            var selectedTab = this[this.selectedIndex].value;
            microsoftTeams.settings.setValidityState(selectedTab === 'first' || selectedTab === 'second');
        };
    });

    function createTabUrl() {
        var tabOpt = document.getElementById('appTab');
        var selectedTab = tabOpt[tabOpt.selectedIndex].value;

        return window.location.protocol + "//" + window.location.host + "/" + selectedTab;
    }
})();