angular.module('myApp').service('attendanceRecordsService', function ($http, $q) {
    const API_BASE_URL = 'http://localhost:8000/attendance/attendance/';


    this.getAttendanceRecords = function () {
        const token = sessionStorage.getItem('authToken');

        return $http.get(API_BASE_URL, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(function (response) {
                console.log("Attendance Records:", response.data);
                return response.data;
            })
            .catch(function (error) {
                console.error("Error fetching attendance records:", error);
                return Promise.reject(error);
            });
    };

    this.saveAttendanceRecord = function (attendanceObject) {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            console.error("No token found in sessionStorage");
            return Promise.reject("No token found. Please log in again.");
        }

        return $http.post(API_BASE_URL, attendanceObject, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                console.log("Attendance saved successfully:", response.data);
                return response.data;
            })
            .catch(function (error) {
                console.error("Error saving attendance record:", error);
                return Promise.reject(error);
            });
    };


    this.updateAttendanceRecord = function (id, updatedObject) {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            console.error("No token found in sessionStorage");
            return Promise.reject("No token found. Please log in again.");
        }

        return $http.put(`${API_BASE_URL}${id}/`, updatedObject, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                console.log(`Attendance record ${id} updated successfully:`, response.data);
                return response.data;
            })
            .catch(function (error) {
                console.error(`Error updating attendance record ${id}:`, error);
                return Promise.reject(error);
            });
    };

    //Fetch attendance record by date
    this.getAttendanceByDate = function (dateString) {
        const token = sessionStorage.getItem('authToken');

        if (!token) {
            console.error("No token found in sessionStorage");
            return Promise.reject("No token found. Please log in again.");
        }

        return $http.get(`http://localhost:8000/attendance/by-date/?date=${encodeURIComponent(dateString)}`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(function (response) {
                console.log(`Attendance for date ${dateString}:`, response.data);
                return response.data;
            })
            .catch(function (error) {
                console.error(`Error fetching attendance for date ${dateString}:`, error);
                return Promise.reject(error);
            });
    };


});
