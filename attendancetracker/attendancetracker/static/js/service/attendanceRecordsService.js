angular.module('myApp').service('attendanceRecordsService', function ($http, $q) {
    const API_BASE_URL = '/api/attendanceRecords';

    this.getAttendanceRecords = function () {
        return $http.get(API_BASE_URL)
            .then(function (response) {
                return response.data;
            })
            .catch(function () {
                console.warn('Using localStorage fallback for attendance records');
                const localData = localStorage.getItem('attendanceRecords');
                console.log(JSON.parse(localData || '[]'));
                return $q.resolve(JSON.parse(localData || '[]'));
            });
    };

    this.saveAllAttendanceRecords = function (records) {
        return $http.post(API_BASE_URL + '/bulk', records)
            .then(function (response) {
                return response.data;
            })
            .catch(function () {
                console.warn('Bulk saving to localStorage fallback');
                localStorage.setItem('attendanceRecords', JSON.stringify(records));
                return $q.resolve({ status: 'bulk-saved-locally' });
            });
    };
});
