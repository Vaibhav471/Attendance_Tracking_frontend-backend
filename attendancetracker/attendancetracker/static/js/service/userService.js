angular.module('myApp').service('userService', function () {

    var users = [
        { name: "John Doe", email: "john.doe@example.com", status: "present" },
        { name: "Jane Smith", email: "jane.smith@example.com", status: "present" },
        { name: "Amit Verma", email: "amit.verma@example.com", status: "present" },
        { name: "Priya Patel", email: "priya.patel@example.com", status: "present" },
        { name: "Rohit Sharma", email: "rohit.sharma@example.com", status: "absent" },
        { name: "Anjali Mehra", email: "anjali.mehra@example.com", status: "onleave" },
        { name: "Deepak Yadav", email: "deepak.yadav@example.com", status: "present" },
        { name: "Neha Singh", email: "neha.singh@example.com", status: "present" },
        { name: "Siddharth Jain", email: "siddharth.jain@example.com", status: "present" },
        { name: "Kavya Nair", email: "kavya.nair@example.com", status: "onleave" }
    ];

    this.getUsers = function () {
        return users;
    };

    function calculatePercentages() {
        var total = users.length;

        var presentCount = users.filter(user => user.status === 'present').length;
        var absentCount = users.filter(user => user.status === 'absent').length;
        var onLeaveCount = users.filter(user => user.status === 'onleave').length;

        return [
            parseFloat(((presentCount / total) * 100).toFixed(2)),
            parseFloat(((absentCount / total) * 100).toFixed(2)),
            parseFloat(((onLeaveCount / total) * 100).toFixed(2))
        ];
    }

    this.getPresentPercentage = function () {
        return calculatePercentages()[0];
    };

    this.getAbsentPercentage = function () {
        return calculatePercentages()[1];
    };

    this.getOnLeavePercentage = function () {
        return calculatePercentages()[2];
    };

});
