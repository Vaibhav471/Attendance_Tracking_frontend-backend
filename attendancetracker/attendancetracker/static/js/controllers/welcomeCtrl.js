myApp.controller('welcomeController', function ($scope, attendanceRecordsService, leaveService) {

    $scope.loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    $scope.records = [];
    var currentEmail = $scope.loggedInUser ? $scope.loggedInUser.email : null;
    $scope.isTodayMarked = false

    let now = new Date();
    $scope.attendance = {
        name: $scope.loggedInUser.name,
        email: $scope.loggedInUser.email,
        date: now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        day: now.toLocaleDateString('en-GB', { weekday: 'long' }),
        status: "Present",
        checkin: null,
        break_start: null,
        break_end: null,
        checkout: null,
        hours: ""
    };

    $scope.status = 'offline';
    $scope.break = false;

    $scope.formatTime = function (timeStr) {
        if (!timeStr) return '—';
        return moment(timeStr, "HH:mm:ss").format("hh:mm A");
    };

    attendanceRecordsService.getAttendanceRecords().then(function (allRecords) {
        let att = allRecords.filter(item => (item.date === $scope.attendance.date && item.checkout === null));
        if (currentEmail) {
            $scope.records = allRecords.filter(item =>
                !(item.date === $scope.attendance.date && item.checkout === null)
            );
        }

        if (att) {
            $scope.attendance.checkin = att[0].checkin
            $scope.status = 'online'

            if (att[0].break_start !== null) {
                $scope.attendance.break_start = att[0].break_start
                $scope.break = true
            }

            if (att[0].break_end !== null) {
                $scope.attendance.break_end = att[0].break_end
                $scope.break = false
            }
        }
    });

    function checkAttendanceForSameDate(att) {
        let isTodayMarked = att.some(item =>
            moment(item.date, "D MMMM YYYY").isSame(moment(), 'day') && item.checkout !== null
        );

        if (isTodayMarked) {
            console.log("Attendance for today is already marked");
            $scope.isTodayMarked = true;
        } else {
            console.log("No attendance marked for today yet");
        }
    }

    $scope.$watch('records', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            checkAttendanceForSameDate(newVal);
        }
    }, true);


    $scope.markAttendance = function () {
        $scope.status = 'online';
        $scope.attendance.checkin = new Date().toTimeString().slice(0, 5);
        attendanceRecordsService.saveAttendanceRecord($scope.attendance);
    };

    $scope.markBreak = function () {
        $scope.break = !$scope.break;
        const time = new Date().toTimeString().slice(0, 8);
        if ($scope.break) {
            attendanceRecordsService.getAttendanceByDate($scope.attendance.date).then(function (att) {
                console.log("AAAYAA", att[0])
                $scope.attendance.break_start = time;
                att[0].break_start = time;
                attendanceRecordsService.updateAttendanceRecord(att[0].id, att[0]);
            })

        } else {
            attendanceRecordsService.getAttendanceByDate($scope.attendance.date).then(function (att) {
                $scope.attendance.break_end = time;
                att[0].break_end = time;
                attendanceRecordsService.updateAttendanceRecord(att[0].id, att[0]);
            })
        }
    };

    $scope.logout = function () {
        attendanceRecordsService.getAttendanceByDate($scope.attendance.date).then(function (att){
            $scope.status = 'offline';

        if (!$scope.loggedInUser) {
            alert("No user logged in.");
            return;
        }

        $scope.attendance.checkout = new Date().toTimeString().slice(0, 8);
        att[0].checkout = new Date().toTimeString().slice(0, 8);

        const checkin = moment($scope.attendance.checkin, "HH:mm");
        const checkout = moment($scope.attendance.checkout, "HH:mm");

        let netDuration;

        if ($scope.attendance.break_start && !$scope.attendance.break_end) {
            const breakStart = moment($scope.attendance.break_start, "HH:mm");
            netDuration = moment.duration(breakStart.diff(checkin));
        } else {
            const breakStart = $scope.attendance.break_start ? moment($scope.attendance.break_start, "HH:mm") : moment("00:00", "HH:mm");
            const breakEnd = $scope.attendance.break_end ? moment($scope.attendance.break_end, "HH:mm") : moment("00:00", "HH:mm");

            const workDuration = moment.duration(checkout.diff(checkin));
            const breakDuration = moment.duration(breakEnd.diff(breakStart));
            netDuration = moment.duration(workDuration - breakDuration);
        }

        const hh = String(Math.floor(netDuration.asMinutes() / 60)).padStart(2, '0');
        const mm = String(Math.floor(netDuration.asMinutes() % 60)).padStart(2, '0');
        $scope.attendance.hours = `${hh}:${mm}`;
        att[0].hours = `${hh}:${mm}`;

        attendanceRecordsService.updateAttendanceRecord(att[0].id,att[0]).then(function () {

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
                break_start: "",
                break_end: "",
                checkout: "",
                hours: ""
            };
        })
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

        const startDate = moment($scope.leave.startDate);
        const endDate = moment($scope.leave.endDate);

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
