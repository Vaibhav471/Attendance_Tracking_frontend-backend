myApp.controller('adminWelcomeController', function ($scope, userService, leaveService) {

    $scope.employeesAttendanceStatusToday = userService.getUsers();
    $scope.leaveRequests = [];

    //Function to fetch all pending leaves
    function loadPendingLeaves() {
        leaveService.getAllPendingLeaves()
            .then(function (requests) {
                $scope.leaveRequests = requests;
            })
            .catch(function (error) {
                console.error("Failed to fetch pending leaves:", error);
            });
    }

    //Initial load
    loadPendingLeaves();

    //Approve or reject a leave
    $scope.updateLeave = function (item, newStatus) {
        leaveService.updateLeaveStatus(item.id, newStatus)
            .then(function () {
                loadPendingLeaves();
            })
            .catch(function (error) {
                console.error(`Error updating leave status to ${newStatus}:`, error);
            });
    };

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
    });

    // ✅ Highcharts pie chart
    const presentCount = userService.getPresentPercentage();
    const absentCount = userService.getAbsentPercentage();
    const leaveCount = userService.getOnLeavePercentage();

    Highcharts.chart('presentPieChart', {
        chart: { type: 'pie' },
        title: { text: "Today's Employee Attendance Status" },
        tooltip: { pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} Employees)' },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.y}%'
                }
            }
        },
        series: [{
            name: 'Employees',
            data: [
                { name: 'Present', y: presentCount, sliced: true, color: '#28a745' },
                { name: 'Absent', y: absentCount, color: '#dc3545' },
                { name: 'On Leave', y: leaveCount, color: '#ffc107' }
            ]
        }]
    });

});
