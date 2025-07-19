myApp.controller("leaveController", function ($scope, leaveService) {
    $scope.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    $scope.leaveRequests = [];   
    $scope.leaveHistory = [];    
    $scope.leaveRequestsCount = 0;

    //Fetch pending leaves
    leaveService.getPendingLeaves().then(function (pendingLeaves) {
        $scope.leaveRequests = pendingLeaves;
        $scope.leaveRequestsCount = pendingLeaves.length;
    }).catch(function (error) {
        console.error("Failed to load pending leaves:", error);
    });

    //Fetch non-pending leaves
    leaveService.getNonPendingLeaves().then(function (historyLeaves) {
        $scope.leaveHistory = historyLeaves;
    }).catch(function (error) {
        console.error("Failed to load leave history:", error);
    });

    //Sidebar toggle
    jQuery(document).ready(function () {
        jQuery("#sidebarToggle").click(function () {
            jQuery("#sidebar").addClass("show");
            jQuery("#sidebarOverlay").addClass("show");
        });

        jQuery("#sidebarClose, #sidebarOverlay").click(function () {
            jQuery("#sidebar").removeClass("show");
            jQuery("#sidebarOverlay").removeClass("show");
        });

        jQuery('#pendingLeaves').on('show.bs.collapse', function () {
            jQuery('.collapse-toggle i.fas')
                .removeClass('fa-chevron-down')
                .addClass('fa-chevron-up');
        });

        jQuery('#pendingLeaves').on('hide.bs.collapse', function () {
            jQuery('.collapse-toggle i.fas')
                .removeClass('fa-chevron-up')
                .addClass('fa-chevron-down');
        });

        jQuery('.table tbody tr').hover(
            function () { jQuery(this).addClass('table-active'); },
            function () { jQuery(this).removeClass('table-active'); }
        );
    });
});
