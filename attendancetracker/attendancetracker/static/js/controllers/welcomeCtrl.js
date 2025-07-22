myApp.controller('welcomeController', function ($scope, attendanceRecordsService, leaveService) {

    $scope.loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    $scope.records = [];
    var currentEmail = $scope.loggedInUser ? $scope.loggedInUser.email : null;

    attendanceRecordsService.getAttendanceRecords().then(function (allRecords) {
        if (currentEmail) {
            $scope.records = allRecords;
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

        attendanceRecordsService.saveAttendanceRecord($scope.attendance).then(function () {

            console.log("attendance saved successfully")

            attendanceRecordsService.getAttendanceRecords().then(function (allRecords) {
                if (currentEmail) {
                    $scope.records = allRecords;
                }
            });

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
        })
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

        const today = moment().startOf('day');
        const startDate = moment($scope.leave.startDate);
        const endDate = moment($scope.leave.endDate);

        if (startDate.isBefore(today)) {
            alert("Start date cannot be before today!");
            return;
        }
        if (endDate.isBefore(today)) {
            alert("End date cannot be before today!");
            return;
        }

        if (startDate.isAfter(endDate)) {
            alert("End date must be after or equal to start date!");
            return;
        }

        const payload = {
            name: $scope.loggedInUser.name,
            email: $scope.loggedInUser.email,
            type: $scope.leave.type,
            reason: $scope.leave.reason,
            start_date: startDate.format("YYYY-MM-DD"),
            end_date: endDate.format("YYYY-MM-DD"),
            status: "pending"
        };

        leaveService.applyLeave(payload)
            .then(function () {
                // Reset form after success
                $scope.leave.startDate = new Date();
                $scope.leave.endDate = new Date();
                $scope.leave.type = '';
                $scope.leave.reason = '';

                jQuery('#leaveModal').modal('hide');

                alert("Leave request submitted!");
            })
            .catch(function (error) {
                console.error("Failed to apply leave:", error);
                alert("Failed to apply leave. Please try again.");
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

        // Format hours as HH:mm
        const hh = String(Math.floor(netDuration.asMinutes() / 60)).padStart(2, '0');
        const mm = String(Math.floor(netDuration.asMinutes() % 60)).padStart(2, '0');
        item.hours = `${hh}:${mm}`;

        attendanceRecordsService.updateAttendanceRecord(item.id, item)
            .then(function (response) {
                console.log("Checkout updated successfully:", response);
                alert("Checkout updated successfully!");
            })
            .catch(function (error) {
                console.error("Failed to update checkout:", error);
                alert("Failed to update checkout. Please try again.");
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
