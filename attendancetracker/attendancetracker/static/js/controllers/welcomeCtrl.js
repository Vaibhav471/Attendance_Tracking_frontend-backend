myApp.controller('welcomeController', function ($scope, attendanceRecordsService, leaveService) {

    $scope.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    $scope.records = [];
    var currentEmail = $scope.loggedInUser ? $scope.loggedInUser.email : null;

    attendanceRecordsService.getAttendanceRecords().then(function (allRecords) {
        if (currentEmail) {
            for (var i = allRecords.length - 1; i >= 0; i--) {
                if (allRecords[i].email === currentEmail) {
                    $scope.records.push(allRecords[i]);
                }
            }
        }
    });

    $scope.status = 'offline';
    $scope.break = false;

    let now = new Date();
    $scope.attendance = {
        name: $scope.loggedInUser.name,
        email: $scope.loggedInUser.email,
        date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        day: now.toLocaleDateString('en-GB', { weekday: 'long' }),
        status: "Present",
        checkin: "",
        breakStart: "",
        breakEnd: "",
        checkout: "",
        hours: ""
    };

    $scope.markAttendance = function () {
        $scope.status = 'online';
        $scope.attendance.checkin = new Date().toTimeString().slice(0, 5);
    };

    $scope.markBreak = function () {
        $scope.break = !$scope.break;
        const time = new Date().toTimeString().slice(0, 5);
        if ($scope.break) {
            $scope.attendance.breakStart = time;
        } else {
            $scope.attendance.breakEnd = time;
        }
    };

    $scope.logout = function () {
        $scope.status = 'offline';

        if (!$scope.loggedInUser) {
            alert("No user logged in.");
            return;
        }

        $scope.attendance.checkout = new Date().toTimeString().slice(0, 5);

        const checkin = moment($scope.attendance.checkin, "HH:mm");
        const checkout = moment($scope.attendance.checkout, "HH:mm");

        let netDuration;

        if ($scope.attendance.breakStart && !$scope.attendance.breakEnd) {
            const breakStart = moment($scope.attendance.breakStart, "HH:mm");
            netDuration = moment.duration(breakStart.diff(checkin));
        } else {
            const breakStart = $scope.attendance.breakStart ? moment($scope.attendance.breakStart, "HH:mm") : moment("00:00", "HH:mm");
            const breakEnd = $scope.attendance.breakEnd ? moment($scope.attendance.breakEnd, "HH:mm") : moment("00:00", "HH:mm");

            const workDuration = moment.duration(checkout.diff(checkin));
            const breakDuration = moment.duration(breakEnd.diff(breakStart));
            netDuration = moment.duration(workDuration - breakDuration);
        }

        const hh = String(Math.floor(netDuration.asMinutes() / 60)).padStart(2, '0');
        const mm = String(Math.floor(netDuration.asMinutes() % 60)).padStart(2, '0');
        $scope.attendance.hours = `${hh}:${mm}`;

        attendanceRecordsService.getAttendanceRecords().then(function (existingRecords) {
            existingRecords.push($scope.attendance);
            attendanceRecordsService.saveAllAttendanceRecords(existingRecords).then(() => {
                $scope.records = [];
                for (var i = existingRecords.length - 1; i >= 0; i--) {
                    if (existingRecords[i].email === $scope.loggedInUser.email) {
                        $scope.records.push(existingRecords[i]);
                    }
                }

                let now = new Date();
                $scope.attendance = {
                    name: $scope.loggedInUser.name,
                    email: $scope.loggedInUser.email,
                    date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
                    day: now.toLocaleDateString('en-GB', { weekday: 'long' }),
                    status: "Present",
                    checkin: "",
                    breakStart: "",
                    breakEnd: "",
                    checkout: "",
                    hours: ""
                };
            });
        });
    };

    $scope.leave = {
        name: $scope.loggedInUser.name,
        email: $scope.loggedInUser.email,
        startDate: '',
        endDate: '',
        type: '',
        reason: '',
        status: "pending",
        submitDate: ''
    };

    $scope.submitLeaveRequest = function () {
        $scope.leave.startDate = $scope.leave.startDate.toLocaleDateString('en-GB');
        $scope.leave.endDate = $scope.leave.endDate.toLocaleDateString('en-GB');
        $scope.leave.submitDate = new Date();

        leaveService.saveLeaveRequest($scope.leave).then(function () {
            $scope.leave.startDate = '';
            $scope.leave.endDate = '';
            $scope.leave.type = '';
            $scope.leave.reason = '';
            $scope.leave.submitDate = '';

            jQuery('#leaveModal').modal('hide');
        });
    };

    $scope.updateCheckout = function (item) {
        if (!item.checkin || !item.checkout) {
            alert("Check-in or Checkout time is missing.");
            return;
        }

        const checkin = moment(item.checkin, "HH:mm");
        const checkout = moment(item.checkout, "HH:mm");

        let netDuration;

        if (item.breakStart && !item.breakEnd) {
            const breakStart = moment(item.breakStart, "HH:mm");
            netDuration = moment.duration(breakStart.diff(checkin));
        } else {
            const breakStart = item.breakStart ? moment(item.breakStart, "HH:mm") : moment("00:00", "HH:mm");
            const breakEnd = item.breakEnd ? moment(item.breakEnd, "HH:mm") : moment("00:00", "HH:mm");

            const workDuration = moment.duration(checkout.diff(checkin));
            const breakDuration = moment.duration(breakEnd.diff(breakStart));
            netDuration = moment.duration(workDuration - breakDuration);
        }

        const hh = String(Math.floor(netDuration.asMinutes() / 60)).padStart(2, '0');
        const mm = String(Math.floor(netDuration.asMinutes() % 60)).padStart(2, '0');
        item.hours = `${hh}:${mm}`;

        attendanceRecordsService.getAttendanceRecords().then(function (allRecords) {
            const updatedRecords = [];
            for (var i = 0; i < allRecords.length; i++) {
                const record = allRecords[i];
                if (!(record.date === item.date && record.email === item.email)) {
                    updatedRecords.push(record);
                }
            }
            updatedRecords.push(item);

            attendanceRecordsService.saveAllAttendanceRecords(updatedRecords).then(() => {
                $scope.records = [];
                for (var i = updatedRecords.length - 1; i >= 0; i--) {
                    if (updatedRecords[i].email === item.email) {
                        $scope.records.push(updatedRecords[i]);
                    }
                }
            });
        });
    };

    // Sidebar toggle
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

});
