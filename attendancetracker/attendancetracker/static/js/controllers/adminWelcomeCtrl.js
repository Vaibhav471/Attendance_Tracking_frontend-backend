myApp.controller('adminWelcomeController', function ($scope, userService) {

    $scope.employeesAttendanceStatusToday = userService.getUsers();
    $scope.leaveRequests = JSON.parse(localStorage.getItem("leaveRequests"));
    $scope.leaveHistory = JSON.parse(localStorage.getItem("leaveHistory"));

    console.log($scope.leaveRequests)

    $scope.approveLeave = function (item) {
        item.status = 'approved'
        $scope.leaveHistory.push(item);

        const index = $scope.leaveRequests.indexOf(item);
        if (index > -1) {
            $scope.leaveRequests.splice(index, 1);
        }

        localStorage.setItem('leaveRequests', JSON.stringify($scope.leaveRequests));
        localStorage.setItem('leaveHistory', JSON.stringify($scope.leaveHistory));
    }

    $scope.rejectLeave = function (item) {
        item.status = 'rejected'
        $scope.leaveHistory.push(item);

        const index = $scope.leaveRequests.indexOf(item);
        if (index > -1) {
            $scope.leaveRequests.splice(index, 1);
        }

        localStorage.setItem('leaveRequests', JSON.stringify($scope.leaveRequests));
        localStorage.setItem('leaveHistory', JSON.stringify($scope.leaveHistory));
    }

    jQuery(document).ready(function () {
    // Sidebar tggle
    jQuery("#sidebarToggle").click(function () {
        jQuery("#sidebar").addClass("show");
        jQuery("#sidebarOverlay").addClass("show");
    });

    jQuery("#sidebarClose, #sidebarOverlay").click(function () {
        jQuery("#sidebar").removeClass("show");
        jQuery("#sidebarOverlay").removeClass("show");
    });
});

//highchart.js
  const presentCount = userService.getPresentPercentage();
  const absentCount = userService.getAbsentPercentage()
  const leaveCount = userService.getOnLeavePercentage()

  Highcharts.chart('presentPieChart', {
    chart: {
      type: 'pie'
    },
    title: {
      text: "Today's Employee Attendance Status"
    },
    tooltip: {
      pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} Employees)'
    },
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
      //colorByPoint: true,
      data: [
        { name: 'Present', y: presentCount, sliced: true, color: '#28a745' },
        { name: 'Absent', y: absentCount, color: '#dc3545' },
        { name: 'On Leave', y: leaveCount, color: '#ffc107' }
      ]
    }]
  });

});