myApp.controller("leaveController", function ($scope, leaveService) {
    $scope.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    const email = $scope.loggedInUser?.email;

    $scope.leaveRequests = [];
    $scope.leaveHistory = [];
    $scope.leaveRequestsCount = 0;

    leaveService.getLeaveRequestsByEmail(email).then(function (requests) {
        $scope.leaveRequests = requests;
        $scope.leaveRequestsCount = requests.length;
    });

    leaveService.getLeaveHistoryByEmail(email).then(function (history) {
        $scope.leaveHistory = history;
    });

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
            jQuery('.collapse-toggle i.fas').removeClass('fa-chevron-down').addClass('fa-chevron-up');
        });

        jQuery('#pendingLeaves').on('hide.bs.collapse', function () {
            jQuery('.collapse-toggle i.fas').removeClass('fa-chevron-up').addClass('fa-chevron-down');
        });

        jQuery('.table tbody tr').hover(
            function () { jQuery(this).addClass('table-active'); },
            function () { jQuery(this).removeClass('table-active'); }
        );
    });
});
