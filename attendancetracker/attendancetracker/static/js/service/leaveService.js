angular.module('myApp').service('leaveService', function($http) {

    // Base endpoint for Django DRF LeaveViewSet
    const API_BASE_URL = "http://localhost:8000/leave/";

    //Get pending leaves
    this.getPendingLeaves = function() {
        const token = sessionStorage.getItem('authToken');
        return $http.get(`${API_BASE_URL}pending/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching pending leaves:", error);
            return Promise.reject(error);
        });
    };

    //Get non-pending leaves
    this.getNonPendingLeaves = function() {
        const token = sessionStorage.getItem('authToken');
        return $http.get(`${API_BASE_URL}non-pending/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching non-pending leaves:", error);
            return Promise.reject(error);
        });
    };

    //Submit a new leave request
    this.applyLeave = function(leaveData) {
        const token = sessionStorage.getItem('authToken');
        return $http.post(`${API_BASE_URL}leaves/`, leaveData, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.data)
        .catch(error => {
            console.error("Error applying leave:", error);
            return Promise.reject(error);
        });
    };

    //Fetch ALL pending leaves of ALL users (NO token required)
    this.getAllPendingLeaves = function() {
        return $http.get(`${API_BASE_URL}all-pending/`)
        .then(response => response.data)
        .catch(error => {
            console.error("Error fetching all pending leaves:", error);
            return Promise.reject(error);
        });
    };

    //Update leave status by ID (NO token required)
    this.updateLeaveStatus = function(leaveId, newStatus) {
        return $http.patch(`${API_BASE_URL}update-status/${leaveId}/`, 
            { status: newStatus },
            { headers: { 'Content-Type': 'application/json' } }
        )
        .then(response => response.data)
        .catch(error => {
            console.error(`Error updating leave ${leaveId} status:`, error);
            return Promise.reject(error);
        });
    };
});
