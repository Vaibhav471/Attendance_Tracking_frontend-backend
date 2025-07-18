angular.module('myApp').service('leaveService', function ($http, $q) {
    const API_BASE_URL = '/api/leaveRequests';
    const API_HISTORY_URL = '/api/leaveHistory';

    this.getLeaveRequests = function () {
        return $http.get(API_BASE_URL)
            .then(res => res.data)
            .catch(() => {
                console.warn('Using localStorage fallback for leave requests');
                const localData = localStorage.getItem('leaveRequests');
                return $q.resolve(JSON.parse(localData || '[]'));
            });
    };

    this.getLeaveHistory = function () {
        return $http.get(API_HISTORY_URL)
            .then(res => res.data)
            .catch(() => {
                console.warn('Using localStorage fallback for leave history');
                const localData = localStorage.getItem('leaveHistory');
                return $q.resolve(JSON.parse(localData || '[]'));
            });
    };

    this.saveLeaveRequest = function (leaveRequest) {
        return $http.post(API_BASE_URL, leaveRequest)
            .then(res => res.data)
            .catch(() => {
                console.warn('Saving leave request to localStorage');
                const localData = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
                localData.push(leaveRequest);
                localStorage.setItem('leaveRequests', JSON.stringify(localData));
                return $q.resolve({ status: 'saved-locally' });
            });
    };

    this.getLeaveRequestsByEmail = function (email) {
        return this.getLeaveRequests().then(requests =>
            requests.filter(req => req.email === email)
        );
    };

    this.getLeaveHistoryByEmail = function (email) {
        return this.getLeaveHistory().then(history =>
            history.filter(h => h.email === email)
        );
    };
});
